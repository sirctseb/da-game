import type { Deck, GameState } from "./model";

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
    gameState.players.some((player) => player.hand.cards.size > 0)
  );
}

export function joinGame(
  gameState: GameState,
  playerName: string,
  playerKey: string
): GameState {
  // validation
  // game not started
  if (gameStarted(gameState)) {
    throw new Error("Cannot add player: game has already started");
  }

  const newPlayer = {
    key: playerKey,
    name: playerName,
    hand: { cards: new Set<number>() },
  };
  return {
    ...gameState,
    players: [...gameState.players, newPlayer],
  };
}

export function playCard(
  gameState: GameState,
  pileKey: keyof GameState["piles"],
  cardValue: number,
  playerKey: string
): GameState {
  const pile = gameState.piles[pileKey];

  // validations
  // player exists
  const player = gameState.players.find((p) => p.key === playerKey);
  if (!player) {
    throw new Error("Player not found");
  }

  // player has card
  if (!player.hand.cards.has(cardValue)) {
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
      const updatedHand = new Set(p.hand.cards);
      updatedHand.delete(cardValue);
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

export function endTurn(gameState: GameState, playerKey: string): GameState {
  // validation

  // player exists
  const player = gameState.players.find((p) => p.key === playerKey);
  if (!player) {
    throw new Error("Player not found");
  }

  // have played enough cards
  if (gameState.deck.cards.length === 0) {
    if (player.hand.cards.size >= 7) {
      throw new Error("Must play at least one card when deck is empty");
    }
  } else {
    if (player.hand.cards.size >= 5) {
      throw new Error("Must play at least two cards before ending turn");
    }
  }

  let workingDeck = [...gameState.deck.cards];
  const updatedPlayers = gameState.players.map((p) => {
    if (p.key === playerKey) {
      const updatedHand = new Set(p.hand.cards);
      while (updatedHand.size < 6 && workingDeck.length > 0) {
        const drawnCard = gameState.deck.cards[0];
        updatedHand.add(drawnCard);
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
