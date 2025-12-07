export interface Pile {
  direction: "up" | "down";
  cards: number[];
}

export interface Deck {
  cards: number[];
}

export interface Player {
  key: string;
  name: string;
  hand: Hand;
}

export interface Hand {
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
  // games exist before we can populate a turn
  // let's make this optional with a
  // TODO create a Lobby collection with just the players
  // and latch them into a Game when it starts
  turn?: Turn;
}

// TODO this might be more appropriately placed in the api layer
// the data layer doesn't have anything to do with string ids. it needs
// to stay here though if input arguments remain with string ids as a convenience.
// otherwise, the api layer needs to do the work to produce the object ids for the data layer.
export type PersistedGameState = GameState & {
  _id: string;
};

export interface Turn {
  playerId: string;
  playedCards: number[];
}
