import type { NextRequest } from "next/server";
import { getGame, serialized, updateGame } from "../../../../data/state";
import { playCard } from "../../../../mutations";
import type { PlayArgs } from "../../../../apiClient";
import { publishGameUpdate } from "../../../../lib/ably";

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

  const body = (await request.json()) as PlayArgs;

  const updatedGame = playCard(
    serialized(game),
    body.pile,
    body.card,
    body.playerKey
  );
  const result = await updateGame(updatedGame);

  if (!result) {
    return new Response("Play failed", { status: 500 });
  }

  // Notify all players of the game state change
  publishGameUpdate(id);

  return Response.json(serialized(result));
};
