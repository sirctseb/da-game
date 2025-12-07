"use client";

import { useCallback } from "react";
import type { GameState } from "../../../model";
import { getUserId } from "../../../user";
import type { Serialized } from "../../../state";
import { useUserId } from "../../useUserId";
import { api } from "../../../apiClient";

export function UserDisplay({
  game,
  onUpdateGame,
}: {
  game: Serialized<GameState>;
  onUpdateGame: (game: Serialized<GameState>) => void;
}) {
  const key = getUserId();

  const handleJoin = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name")?.toString();

      if (name) {
        onUpdateGame(await api.join({ name, key }, game._id));
      } else {
        // TODO error display with blank name
        console.error("Name is required to join the game");
      }
    },
    [game?._id, onUpdateGame, key]
  );

  const handleLeave = useCallback(async () => {
    onUpdateGame(await api.leave({ key }, game._id));
  }, [game._id, onUpdateGame, key]);

  // this is hiding a localStorage call, so we can't render this on the server.
  // i think it would work if we store the user key in a cookie
  const playerKey = useUserId();
  const currentPlayer = game.players.find((p) => p.key === playerKey);

  return currentPlayer ? (
    <p>
      Playing as: {currentPlayer.name}{" "}
      <button onClick={handleLeave}>leave game</button>
    </p>
  ) : (
    <form onSubmit={handleJoin}>
      <label>
        name:
        <input name="name" />
      </label>
      <button type="submit">join game</button>
    </form>
  );
}
