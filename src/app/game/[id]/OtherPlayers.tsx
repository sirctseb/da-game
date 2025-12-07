"use client";

import type { GameState } from "@/data";
import type { Serialized } from "../../../data/state";
import { Card } from "../Card";
import "./OtherPlayers.css";

export interface OtherPlayersProps {
  game: Serialized<GameState>;
  userId: string | null;
}

export function OtherPlayers({ game, userId }: OtherPlayersProps) {
  const otherPlayers = game.players.filter((player) => player.key !== userId);

  if (otherPlayers.length === 0) {
    return null;
  }

  return (
    <div className="players-container">
      {otherPlayers.map((player) => (
        <div key={player.key} className="player">
          <div className="player-name">{player.name}</div>
          <div className="player-hand">
            {player.hand.cards.map((_, index) => (
              <div key={index} className="card-container">
                <Card>
                  <div className="card-back">?</div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
