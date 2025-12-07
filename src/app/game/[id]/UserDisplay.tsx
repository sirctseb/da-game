"use client";

import { useCallback } from "react";
import type { GameState } from "@/data";
import type { Serialized } from "../../../data/state";
import { useUserId } from "../../useUserId";
import { api } from "../../../apiClient";
import "./UserDisplay.css";

export function UserDisplay({
  game,
  onUpdateGame,
}: {
  game: Serialized<GameState>;
  onUpdateGame: (game: Serialized<GameState>) => void;
}) {
  // this is hiding a localStorage call, so we can't render this on the server.
  // i think it would work if we store the user key in a cookie
  const key = useUserId();

  const handleJoin = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!key) {
        return;
      }

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
    if (!key) {
      return;
    }

    onUpdateGame(await api.leave({ key }, game._id));
  }, [game._id, onUpdateGame, key]);

  const currentPlayer = game.players.find((p) => p.key === key);

  return (
    <div className="user-display">
      {currentPlayer ? (
        <p>
          Playing as: <span className="player-name">{currentPlayer.name}</span>
          <button className="leave-btn" onClick={handleLeave}>
            leave game
          </button>
        </p>
      ) : (
        <form onSubmit={handleJoin}>
          <label>
            Name:
            <input name="name" placeholder="Enter your name" />
          </label>
          <button type="submit">Join Game</button>
        </form>
      )}
    </div>
  );
}
