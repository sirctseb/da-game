"use client";

import { useCallback } from "react";
import type { GameState } from "../../../model";
import { getUserId } from "../../../user";
import type { Serialized } from "../../../state";

export function GameControls({
  game,
  onUpdateGame,
}: {
  game: Serialized<GameState> | null;
  onUpdateGame: (game: Serialized<GameState>) => void;
}) {
  const handleStart = useCallback(async () => {
    const response = await fetch(`/game/${game?._id}/start`, {
      method: "PUT",
      body: JSON.stringify({ key: getUserId() }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // successfully started
      onUpdateGame(await response.json());
    } else {
      // handle error
      console.error("Failed to start game");
    }
  }, [game?._id, onUpdateGame]);

  return <button onClick={handleStart}>start game</button>;
}
