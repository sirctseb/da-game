import { NextRequest } from "next/server";
import { getGame, serialized } from "../../../../data/state";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  if (!id) {
    return new Response("Game ID is required", { status: 400 });
  }

  const game = await getGame(id);

  if (!game) {
    return new Response("Game not found", { status: 404 });
  }

  return Response.json(serialized(game));
}
