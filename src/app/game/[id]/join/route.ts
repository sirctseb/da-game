import type { NextRequest } from "next/server";
import { getGame, serialized, updateGame } from "../../../../data/state";
import { joinGame } from "../../../../mutations";
import type { JoinArgs } from "../../../../apiClient";

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const id = (await params).id;

  if (!id) {
    return new Response("Game ID is required", { status: 400 });
  }

  const body = (await request.json()) as JoinArgs;
  const { name, key } = body;

  if (!name) {
    return new Response("Player name is required", { status: 400 });
  }

  if (!key) {
    return new Response("Player key is required", { status: 400 });
  }

  const game = await getGame(id);

  if (!game) {
    return new Response("No such game", { status: 404 });
  }

  const updatedGame = joinGame(serialized(game), name, key);
  const result = await updateGame(updatedGame);

  if (!result) {
    return new Response("Join failed", { status: 500 });
  }

  return Response.json(serialized(result));
};
