"use client";

import type { GameState } from "@/data";
import type { Serialized } from "../../../data/state";
import { getUserId } from "../../../user";

interface HandProps {
  game: Serialized<GameState>;
  onPickCard: (card: number) => void;
}

export function Hand({ game, onPickCard }: HandProps) {
  const userId = getUserId();
  const player = game.players.find((p) => p.key === userId);

  if (!player) {
    return <div>Your hand is not available.</div>;
  }

  return (
    <div>
      {player.hand.cards.map((card) => (
        <div key={card} onClick={() => onPickCard(card)}>
          {card}
        </div>
      ))}
    </div>
  );
}
