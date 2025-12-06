import { getGame } from "../../../state";
import { UserDisplay } from "./UserDisplay";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGame(id);
  const { deck, ...displayGame } = game;

  return (
    <div>
      <pre>{JSON.stringify(displayGame, undefined, "\t")}</pre>
      <UserDisplay game={game} />
    </div>
  );
}
