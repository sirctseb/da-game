import { getGame } from "../../../state";
import { StatefulGame } from "./StatefulGame";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGame(id);

  return game ? <StatefulGame gameState={game} /> : <div>Game not found</div>;
}
