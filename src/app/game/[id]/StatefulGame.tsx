"use client";

import { useCallback, useState } from "react";
import type { Play } from "../../../model";
import type { GameState } from "@/data";

import { UserDisplay } from "./UserDisplay";
import type { Serialized } from "../../../data/state";
import { GameControls } from "./GameControls";
import { Hand } from "./Hand";
import { Piles } from "./Piles";
import { useUserId } from "../../useUserId";
import { api } from "../../../apiClient";
import { Debug } from "./Debug";
import { OtherPlayers } from "./OtherPlayers";

const useCurrentPlayerName = (game: Serialized<GameState>): string | null => {
  return game.players.find((p) => p.key === game.turn?.playerId)?.name || null;
};

export function StatefulGame({
  gameState,
}: {
  gameState: Serialized<GameState>;
}) {
  const [game, setGame] = useState(gameState);
  const [draftPlay, setDraftPlay] = useState<Partial<Play>>({});
  // TODO we should be able to render more of this server side
  // TODO well i guess we are still rendering everything, just waiating
  // on a value to be able to make callbacks
  const userId = useUserId();
  const currentPlayerName = useCurrentPlayerName(game);
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

  const handleStart = useCallback(async () => {
    setGame(await api.start(game._id));
  }, [game._id, setGame]);

  const handlePlay = useCallback(async () => {
    if (draftPlay.card == null || draftPlay.pile == null) {
      console.error("Incomplete play");
      return;
    }

    if (userId) {
      setGame(
        await api.play(
          { card: draftPlay.card, pile: draftPlay.pile, playerKey: userId },
          game._id
        )
      );
      setDraftPlay({});
    }
  }, [draftPlay, game._id, userId]);

  const handleEndTurn = useCallback(async () => {
    if (userId) {
      setGame(await api.endTurn({ playerKey: userId }, game._id));
      setDraftPlay({});
    }
  }, [game._id, userId]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        marginTop: "1rem",
      }}
    >
      <OtherPlayers game={game} userId={userId} />
      <Piles
        game={game}
        onPickPile={handlePickPile}
        draftPile={draftPlay.pile}
      />
      <Hand
        game={game}
        onPickCard={handlePickCard}
        draftPlay={draftPlay.card}
      />
      <GameControls
        onEndTurn={handleEndTurn}
        onPlay={handlePlay}
        onStart={handleStart}
      />
      {currentPlayerName && <p>It is {currentPlayerName}&apos;s turn</p>}
      <UserDisplay game={game} onUpdateGame={setGame} />
      <Debug game={gameState} draftPlay={draftPlay} userId={userId} />
    </div>
  );
}
