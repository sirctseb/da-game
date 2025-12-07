"use client";

import { useCallback } from "react";
import type { GameState } from "@/data";
import type { Serialized } from "../../../data/state";
import { api } from "../../../apiClient";

export function GameControls({
  game,
  onUpdateGame,
}: {
  game: Serialized<GameState>;
  onUpdateGame: (game: Serialized<GameState>) => void;
}) {
  const handleStart = useCallback(async () => {
    onUpdateGame(await api.start(game._id));
  }, [game._id, onUpdateGame]);

  return <button onClick={handleStart}>start game</button>;
}
