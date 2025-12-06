"use client";

import { useCallback } from "react";
import type { GameState } from "../../../model";
import { getUserId } from "../../../user";
import type { Serialized } from "../../../state";
import { useUserId } from "../../useUserId";

export function UserDisplay({
  game,
  onUpdateGame,
}: {
  game: Serialized<GameState> | null;
  onUpdateGame: (game: Serialized<GameState>) => void;
}) {
  const handleJoin = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name");
      const playerKey = getUserId();

      const response = await fetch(`/game/${game?._id}/join`, {
        method: "PUT",
        body: JSON.stringify({ name, key: playerKey }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // successfully joined
        onUpdateGame(await response.json());
      } else {
        // handle error
        console.error("Failed to join game");
      }
    },
    [game?._id]
  );

  const handleLeave = useCallback(async () => {
    const response = await fetch(`/game/${game?._id}/leave`, {
      method: "PUT",
      body: JSON.stringify({ key: getUserId() }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // successfully left
      onUpdateGame(await response.json());
    } else {
      // handle error
      console.error("Failed to leave game", { message: await response.json() });
    }
  }, [game?._id]);

  // this is hiding a localStorage call, so we can't render this on the server.
  // i think it would work if we store the user key in a cookie
  const playerKey = useUserId();
  const currentPlayer = game?.players.find((p) => p.key === playerKey);

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
