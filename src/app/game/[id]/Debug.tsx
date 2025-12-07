"use client";

import { useCallback, useState } from "react";
import type { Play } from "../../../model";

import { GameDisplay } from "./GameDisplay";
import type { Serialized } from "../../../data/state";
import { ClientDisplay } from "./ClientDisplay";
import type { GameState } from "../../../data";

export interface DebugProps {
  game: Serialized<GameState>;
  draftPlay: Partial<Play>;
  userId: string | null;
}

export function Debug({ game, draftPlay, userId }: DebugProps) {
  const [debug, setDebug] = useState(false);

  const handleDebugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDebug(e.target.checked);
    },
    []
  );

  return (
    <div>
      <label>
        debug: <input type="checkbox" id="debug" onChange={handleDebugChange} />
      </label>
      {debug && (
        <>
          <GameDisplay game={game} />
          <ClientDisplay draftPlay={draftPlay} />
          userId: {userId}
        </>
      )}
    </div>
  );
}
