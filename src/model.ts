import type { Serialized } from "./state";

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

export type PersistedGameState = Serialized<GameState>;

export interface Player {
  key: string;
  name: string;
  hand: Hand;
}

export interface Hand {
  cards: number[];
}

export interface Turn {
  playerId: string;
  playedCards: number[];
}

export interface Play {
  card: number;
  pile: "upOne" | "upTwo" | "downOne" | "downTwo";
}
