"use client";

import type { GameState } from "@/data";
import type { Serialized } from "../../../data/state";
import { Card } from "../Card";
import { useUserId } from "../../useUserId";

interface HandProps {
  game: Serialized<GameState>;
  onPickCard: (card: number) => void;
  draftPlay?: number;
}

export function Hand({ game, onPickCard, draftPlay }: HandProps) {
  const userId = useUserId();
  const player = game.players.find((p) => p.key === userId);

  if (!player) {
    return <div>Spectating</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        justifyContent: "center",
      }}
    >
      {player.hand.cards.map((card) => (
        <div
          key={card}
          onClick={() => onPickCard(card)}
          style={{
            cursor: "pointer",
            position: "relative",
            bottom: draftPlay === card ? "1rem" : 0,
            transition: "bottom 0.1s",
          }}
        >
          <Card>{card}</Card>
        </div>
      ))}
    </div>
  );
}
