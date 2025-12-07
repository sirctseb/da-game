import type { Deck, GameState, PersistedGameState } from "./data";

export const shuffleCards = (): Deck => {
  const cards = [...Array(98).keys()].map((i) => i + 1);
  for (let i = cards.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return { cards };
};

export function initializeGameState(): GameState {
  return {
    piles: {
      upOne: { direction: "up", cards: [] },
      upTwo: { direction: "up", cards: [] },
      downOne: { direction: "down", cards: [] },
      downTwo: { direction: "down", cards: [] },
    },
    deck: shuffleCards(),
    players: [],
    gameOver: false,
  };
}

function gameStarted(gameState: GameState): boolean {
  return (
    gameState.piles.upOne.cards.length > 0 ||
    gameState.piles.upTwo.cards.length > 0 ||
    gameState.piles.downOne.cards.length > 0 ||
    gameState.piles.downTwo.cards.length > 0 ||
    gameState.players.some((player) => player.hand.cards.length > 0)
  );
}

export function joinGame(
  gameState: PersistedGameState,
  playerName: string,
  playerKey: string
): PersistedGameState {
  // validation
  // game not started
  if (gameStarted(gameState)) {
    throw new Error("Cannot add player: game has already started");
  }

  const newPlayer = {
    key: playerKey,
    name: playerName,
    hand: { cards: [] },
  };
  return {
    ...gameState,
    players: [...gameState.players, newPlayer],
  };
}

export function leaveGame(
  gameState: PersistedGameState,
  playerKey: string
): PersistedGameState {
  // validation
  // game not started
  if (gameStarted(gameState)) {
    throw new Error("Cannot remove player: game has already started");
  }

  const players = gameState.players.filter((p) => p.key !== playerKey);
  return {
    ...gameState,
    players,
  };
}

function getHandLimit(game: GameState): number {
  switch (game.players.length) {
    case 1:
      return 8;
    case 2:
      return 7;
    default:
      return 6;
  }
}

export function deal(gameState: PersistedGameState): PersistedGameState {
  // validation
  // game not started
  if (gameStarted(gameState)) {
    throw new Error("Cannot deal: game has already started");
  }

  const playerKeys = gameState.players.map((p) => p.key);
  const handLimit = getHandLimit(gameState);

  let workingGameState = gameState;
  for (const playerKey of playerKeys) {
    for (let i = 0; i < handLimit; i++) {
      workingGameState = drawOne(workingGameState, playerKey);
    }
  }

  return {
    ...workingGameState,
    turn: { playerId: playerKeys[0], playedCards: [] },
  };
}

function isLegalPlacement(
  card: number,
  pileTop: number | undefined,
  direction: "up" | "down"
): boolean {
  if (pileTop === undefined) {
    return true;
  }
  return (
    (direction === "up" && card > pileTop) ||
    (direction === "down" && card < pileTop) ||
    Math.abs(card - pileTop) === 10
  );
}

function hasPlayedEnoughCards(gameState: GameState): boolean {
  if (!gameState.turn) {
    return false;
  }

  if (gameState.deck.cards.length === 0) {
    return gameState.turn.playedCards.length >= 1;
  } else {
    return gameState.turn.playedCards.length >= 2;
  }
}

// the game is over when the player whose turn it is must play
// another card but does not have a legal move
function isGameOver(gameState: GameState): boolean {
  const currentPlayer = gameState.players.find(
    (p) => p.key === gameState.turn?.playerId
  );
  if (!currentPlayer) {
    return false;
  }

  if (hasPlayedEnoughCards(gameState)) {
    return false;
  }

  for (const card of currentPlayer.hand.cards) {
    for (const pileKey in gameState.piles) {
      const pile = gameState.piles[pileKey as keyof GameState["piles"]];
      const topCard = pile.cards[pile.cards.length - 1];

      if (isLegalPlacement(card, topCard, pile.direction)) {
        return false;
      }
    }
  }

  return true;
}

export function playCard(
  gameState: PersistedGameState,
  pileKey: keyof GameState["piles"],
  cardValue: number,
  playerKey: string
): PersistedGameState {
  const pile = gameState.piles[pileKey];

  // validations
  // player exists
  const player = gameState.players.find((p) => p.key === playerKey);
  if (!player) {
    throw new Error("Player not found");
  }

  // player has card
  if (!player.hand.cards.includes(cardValue)) {
    throw new Error("Player does not have the specified card");
  }

  if (gameState.turn?.playerId !== playerKey) {
    throw new Error("It's not this player's turn");
  }

  // card is legal on pile (correct direction or opposite by 10)
  const topCard = pile.cards[pile.cards.length - 1];

  if (!isLegalPlacement(cardValue, topCard, pile.direction)) {
    throw new Error("Illegal move: card cannot be played on this pile");
  }

  // perform the move
  const updatedPile = {
    ...pile,
    cards: [...pile.cards, cardValue],
  };
  const updatedPlayers = gameState.players.map((p) => {
    if (p.key === playerKey) {
      const updatedHand = p.hand.cards.filter((c) => c !== cardValue);
      return { ...p, hand: { cards: updatedHand } };
    }
    return p;
  });

  const result = {
    ...gameState,
    piles: {
      ...gameState.piles,
      [pileKey]: updatedPile,
    },
    players: updatedPlayers,
    turn: {
      // TODO these are the !s we can remove with a lobby
      ...gameState.turn!,
      playedCards: [...gameState.turn!.playedCards, cardValue],
    },
  };

  // TODO well this can be derived from the state so maybe no reason to persist it?
  // its not derivable from what information is known to an arbitrary player though,
  // so we can't do it if we restrict what is sent to the client. probably should just
  // persist it anyway
  if (isGameOver(result)) {
    return {
      ...result,
      gameOver: true,
    };
  }

  return result;
}

function drawOne(
  gameState: PersistedGameState,
  playerKey: string
): PersistedGameState {
  const player = gameState.players.find((p) => p.key === playerKey);
  if (!player) {
    throw new Error("Player not found");
  }

  if (gameState.deck.cards.length === 0) {
    throw new Error("Deck is empty");
  }

  const drawnCard = gameState.deck.cards[0];
  const updatedHand = [...player.hand.cards, drawnCard];
  const updatedPlayers = gameState.players.map((p) => {
    if (p.key === playerKey) {
      return { ...p, hand: { cards: updatedHand } };
    }
    return p;
  });
  const updatedDeck = {
    cards: gameState.deck.cards.slice(1),
  };

  return {
    ...gameState,
    players: updatedPlayers,
    deck: updatedDeck,
  };
}

export function endTurn(
  gameState: PersistedGameState,
  playerKey: string
): PersistedGameState {
  // validation

  // player exists
  const player = gameState.players.find((p) => p.key === playerKey);
  if (!player) {
    throw new Error("Player not found");
  }

  if (gameState.turn?.playerId !== playerKey) {
    throw new Error("It's not this player's turn");
  }

  // have played enough cards
  if (!hasPlayedEnoughCards(gameState)) {
    if (gameState.deck.cards.length === 0) {
      throw new Error("Must play at least one card when deck is empty");
    } else {
      throw new Error("Must play at least two cards before ending turn");
    }
  }

  // TODO refactor to use drawOne
  let workingDeck = [...gameState.deck.cards];
  const handLimit = getHandLimit(gameState);
  const updatedPlayers = gameState.players.map((p) => {
    if (p.key === playerKey) {
      const updatedHand = [...p.hand.cards];
      while (updatedHand.length < handLimit && workingDeck.length > 0) {
        const drawnCard = workingDeck[0];
        updatedHand.push(drawnCard);
        workingDeck = workingDeck.slice(1);
      }
      return { ...p, hand: { cards: updatedHand } };
    }
    return p;
  });

  const result = {
    ...gameState,
    players: updatedPlayers,
    deck: { cards: workingDeck },
    turn: {
      playerId:
        gameState.players[
          (gameState.players.findIndex((p) => p.key === playerKey) + 1) %
            gameState.players.length
        ].key,
      playedCards: [],
    },
  };

  if (isGameOver(result)) {
    return {
      ...result,
      gameOver: true,
    };
  }

  return result;
}

// remove player
// clear players
// concede (acknowledge end of game)
// edit player name
