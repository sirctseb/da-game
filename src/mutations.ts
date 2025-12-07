import type { Deck, GameState, PersistedGameState } from "./data";

export const shuffleCards = (): Deck => {
  const cards = [...Array(98).keys()].map((i) => i + 1);
  for (let i = cards.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return { cards };
};

// TODO resetGameWithPlayers

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

export function deal(gameState: PersistedGameState): PersistedGameState {
  // validation
  // game not started
  if (gameStarted(gameState)) {
    throw new Error("Cannot deal: game has already started");
  }

  const playerKeys = gameState.players.map((p) => p.key);
  const DRAW_COUNT =
    gameState.players.length === 1 ? 8 : gameState.players.length === 2 ? 7 : 6;

  let workingGameState = gameState;
  for (const playerKey of playerKeys) {
    for (let i = 0; i < DRAW_COUNT; i++) {
      workingGameState = drawOne(workingGameState, playerKey);
    }
  }

  return workingGameState;
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

  // card is legal on pile (correct direction or opposite by 10)
  const topCard = pile.cards[pile.cards.length - 1];
  const isLegalMove =
    (pile.direction === "up" &&
      (topCard === undefined || cardValue > topCard)) ||
    (pile.direction === "down" &&
      (topCard === undefined || cardValue < topCard)) ||
    (topCard !== undefined && Math.abs(cardValue - topCard) === 10);

  if (!isLegalMove) {
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

  return {
    ...gameState,
    piles: {
      ...gameState.piles,
      [pileKey]: updatedPile,
    },
    players: updatedPlayers,
  };
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

  // have played enough cards
  if (gameState.deck.cards.length === 0) {
    if (player.hand.cards.length >= 7) {
      throw new Error("Must play at least one card when deck is empty");
    }
  } else {
    if (player.hand.cards.length >= 5) {
      throw new Error("Must play at least two cards before ending turn");
    }
  }

  // TODO refactor to use drawOne
  let workingDeck = [...gameState.deck.cards];
  const updatedPlayers = gameState.players.map((p) => {
    if (p.key === playerKey) {
      let updatedHand = [...p.hand.cards];
      while (updatedHand.length < 6 && workingDeck.length > 0) {
        const drawnCard = gameState.deck.cards[0];
        updatedHand = [...updatedHand, drawnCard];
        workingDeck = workingDeck.slice(1);
      }
      return { ...p, hand: { cards: updatedHand } };
    }
    return p;
  });

  return {
    ...gameState,
    players: updatedPlayers,
    deck: { cards: workingDeck },
  };
}

// remove player
// clear players
// concede (acknowledge end of game)
// edit player name
