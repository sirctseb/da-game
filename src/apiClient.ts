import type { PersistedGameState } from "./model";

export interface JoinArgs {
  name: string;
  key: string;
}

async function join(
  args: JoinArgs,
  gameId: string
): Promise<PersistedGameState> {
  const response = await fetch(`/game/${gameId}/join`, {
    method: "PUT",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to join game");
    throw new Error("Failed to join game");
  }
  // successfully joined
  return await response.json();
}

export interface LeaveArgs {
  key: string;
}

async function leave(
  args: LeaveArgs,
  gameId: string
): Promise<PersistedGameState> {
  const response = await fetch(`/game/${gameId}/leave`, {
    method: "PUT",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // handle error
    console.error("Failed to leave game", { message: await response.json() });
    throw new Error("Failed to leave game");
  }
  // successfully left
  return await response.json();
}

export interface PlayArgs {
  card: number;
  pile: "upOne" | "upTwo" | "downOne" | "downTwo";
  playerKey: string;
}

async function play(
  args: PlayArgs,
  gameId: string
): Promise<PersistedGameState> {
  const response = await fetch(`/game/${gameId}/play`, {
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to submit play");
    throw new Error("Failed to submit play");
  }
  return await response.json();
}

async function start(gameId: string): Promise<PersistedGameState> {
  const response = await fetch(`/game/${gameId}/start`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // handle error
    console.error("Failed to start game");
    throw new Error("Failed to start game");
  }

  // successfully started
  return await response.json();
}

export interface PlayCardArgs {
  playerKey: string;
  pile: "upOne" | "upTwo" | "downOne" | "downTwo";
  card: number;
}

export const api = {
  join,
  leave,
  start,
  play,
};
