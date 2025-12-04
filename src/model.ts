export interface Pile {
  direction: "up" | "down";
  cards: number[];
}

export interface Deck {
  cards: number[];
}

export interface GameState {
  piles: {
    upOne: Pile;
    upTwo: Pile;
    downOne: Pile;
    downTwo: Pile;
  };
  deck: Deck;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  hand: Hand;
}

export interface Hand {
  cards: Set<number>;
}

export interface Turn {
  playerId: string;
  playedCards: number[];
}
