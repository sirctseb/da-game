"use client";

import { useCallback, useState } from "react";
import type { GameState, Play } from "../../../model";

import { GameDisplay } from "./GameDisplay";
import { UserDisplay } from "./UserDisplay";
import type { Serialized } from "../../../state";
import { GameControls } from "./GameControls";
import { Hand } from "./Hand";
import { ClientDisplay } from "./ClientDisplay";
import { Piles } from "./Piles";
import { useUserId } from "../../useUserId";

export function StatefulGame({
  gameState,
}: {
  gameState: Serialized<GameState>;
}) {
  const [game, setGame] = useState(gameState);
  const [draftPlay, setDraftPlay] = useState<Partial<Play>>({});
  // TODO we should be able to render more of this server side
  const userId = useUserId();
  const handlePickCard = useCallback(
    (card: number) => {
      setDraftPlay((play) => ({ ...play, card }));
    },
    [setDraftPlay]
  );

  const handlePickPile = useCallback(
    (pile: Play["pile"]) => {
      setDraftPlay((play) => ({ ...play, pile }));
    },
    [setDraftPlay]
  );

  const handlePlay = useCallback(async () => {
    if (draftPlay.card == null || draftPlay.pile == null) {
      console.error("Incomplete play");
      return;
    }

    const response = await fetch(`/game/${game._id}/play`, {
      method: "POST",
      body: JSON.stringify({
        ...draftPlay,
        playerKey: userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      setGame(await response.json());
      setDraftPlay({});
    } else {
      console.error("Failed to submit play");
    }
  }, [draftPlay, game._id, userId]);

  return (
    <div>
      <GameDisplay game={game} />
      <ClientDisplay draftPlay={draftPlay} />
      <Piles game={game} onPickPile={handlePickPile} />
      <Hand game={game} onPickCard={handlePickCard} />
      <GameControls game={game} onUpdateGame={setGame} />
      <UserDisplay game={game} onUpdateGame={setGame} />
      <button onClick={handlePlay}>play</button>
    </div>
  );
}
