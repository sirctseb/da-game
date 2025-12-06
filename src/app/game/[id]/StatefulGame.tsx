"use client";

import { useState } from "react";
import type { GameState } from "../../../model";

import { GameDisplay } from "./GameDisplay";
import { UserDisplay } from "./UserDisplay";
import type { Serialized } from "../../../state";

export function StatefulGame({
  gameState,
}: {
  gameState: Serialized<GameState>;
}) {
  const [game, setGame] = useState(gameState);

  return (
    <div>
      <GameDisplay game={game} />
      <UserDisplay game={game} onUpdateGame={setGame} />
    </div>
  );
}
