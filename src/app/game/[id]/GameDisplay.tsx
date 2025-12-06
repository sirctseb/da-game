import type { GameState } from "../../../model";

export function GameDisplay({ game }: { game: GameState }) {
  const { ...displayGame } = game;
  // so what's the pattern here? we want a level where we can accept client-side fetched
  return (
    <div>
      <pre>{JSON.stringify(displayGame, undefined, "\t")}</pre>
    </div>
  );
}
