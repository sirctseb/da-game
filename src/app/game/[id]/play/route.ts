import type { NextRequest } from "next/server";
import { getGame, serialized, updateGame } from "../../../../state";
import { playCard } from "../../../../mutations";

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const id = (await params).id;

  if (!id) {
    return new Response("Game ID is required", { status: 400 });
  }

  const game = await getGame(id);

  if (!game) {
    return new Response("No such game", { status: 404 });
  }

  const body = await request.json();

  const updatedGame = playCard(game, body.pile, body.card, body.playerKey);
  const result = await updateGame(updatedGame);

  if (!result) {
    return new Response("Leave failed", { status: 500 });
  }

  return Response.json(serialized(result));
};
