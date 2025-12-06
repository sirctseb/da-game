import type { GameState } from "../../../model";
import type { Serialized } from "../../../state";

export interface PilesProps {
  game: Serialized<GameState>;
  onPickPile: (pile: keyof GameState["piles"]) => void;
}

export function Piles({ game, onPickPile }: PilesProps) {
  return (
    <div>
      <div onClick={() => onPickPile("upOne")}>
        up
        {game.piles.upOne.cards.at(-1)}
      </div>
      <div onClick={() => onPickPile("upTwo")}>
        up
        {game.piles.upTwo.cards.at(-1)}
      </div>
      <div onClick={() => onPickPile("downOne")}>
        down
        {game.piles.downOne.cards.at(-1)}
      </div>
      <div onClick={() => onPickPile("downTwo")}>
        down
        {game.piles.downTwo.cards.at(-1)}
      </div>
    </div>
  );
}
