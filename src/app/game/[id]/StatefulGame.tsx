"use client";

import { useState } from "react";
import type { GameState } from "../../../model";

import { GameDisplay } from "./GameDisplay";
import { UserDisplay } from "./UserDisplay";
import type { Serialized } from "../../../state";
import { GameControls } from "./GameControls";

export function StatefulGame({
  gameState,
}: {
  gameState: Serialized<GameState>;
}) {
  const [game, setGame] = useState(gameState);

  return (
    <div>
      <GameDisplay game={game} />
      <GameControls game={game} onUpdateGame={setGame} />
      <UserDisplay game={game} onUpdateGame={setGame} />
    </div>
  );
}
