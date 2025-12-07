import type { GameState } from "@/data";
import type { Serialized } from "../../../data/state";
import { Card } from "../Card";
import { useCallback } from "react";

function Pile({
  children,
  draftPile,
  onPickPile,
  pile,
}: {
  children: React.ReactNode;
  draftPile?: keyof GameState["piles"];
  pile: keyof GameState["piles"];
  onPickPile: (pile: keyof GameState["piles"]) => void;
}) {
  const handlePickPile = useCallback(() => {
    onPickPile(pile);
  }, [onPickPile, pile]);

  return (
    <div
      style={{
        cursor: "pointer",
        position: "relative",
        bottom: draftPile === pile ? "1rem" : 0,
        transition: "bottom 0.1s",
      }}
      onClick={handlePickPile}
    >
      {children}
    </div>
  );
}

export interface PilesProps {
  game: Serialized<GameState>;
  onPickPile: (pile: keyof GameState["piles"]) => void;
  draftPile?: keyof GameState["piles"];
}

export function Piles({ game, onPickPile, draftPile }: PilesProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
      }}
    >
      <Pile onPickPile={onPickPile} pile="upOne" draftPile={draftPile}>
        <Card>{game.piles.upOne.cards.at(-1)}</Card>
        <Card>⬆️</Card>
      </Pile>
      <Pile onPickPile={onPickPile} pile="upTwo" draftPile={draftPile}>
        <Card>{game.piles.upTwo.cards.at(-1)}</Card>
        <Card>⬆️</Card>
      </Pile>
      <Pile onPickPile={onPickPile} pile="downOne" draftPile={draftPile}>
        <Card>{game.piles.downOne.cards.at(-1)}</Card>
        <Card>️⬇️</Card>
      </Pile>
      <Pile onPickPile={onPickPile} pile="downTwo" draftPile={draftPile}>
        <Card>{game.piles.downTwo.cards.at(-1)}</Card>
        <Card>️⬇️</Card>
      </Pile>
    </div>
  );
}
