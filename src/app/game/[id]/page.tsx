import { getGame } from "../../../state";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGame(id);

  return <pre>{JSON.stringify(game, undefined, "\t")}</pre>;
}
