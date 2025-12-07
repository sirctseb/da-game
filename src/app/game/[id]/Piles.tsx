import type { GameState } from "@/data";
import type { Serialized } from "../../../data/state";
import { Card } from "../Card";

export interface PilesProps {
  game: Serialized<GameState>;
  onPickPile: (pile: keyof GameState["piles"]) => void;
}

export function Piles({ game, onPickPile }: PilesProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
      }}
    >
      <div onClick={() => onPickPile("upOne")}>
        <Card>{game.piles.upOne.cards.at(-1)}</Card>
        <Card>⬆️</Card>
      </div>
      <div onClick={() => onPickPile("upTwo")}>
        <Card>{game.piles.upTwo.cards.at(-1)}</Card>
        <Card>⬆️</Card>
      </div>
      <div onClick={() => onPickPile("downOne")}>
        <Card>{game.piles.downOne.cards.at(-1)}</Card>
        <Card>️⬇️</Card>
      </div>
      <div onClick={() => onPickPile("downTwo")}>
        <Card>{game.piles.downTwo.cards.at(-1)}</Card>
        <Card>️⬇️</Card>
      </div>
    </div>
  );
}
