import { initializeGameState } from "../../mutations";
import { createGame } from "../../state";

export async function POST() {
  const gameState = initializeGameState();

  const { insertedId } = await createGame(gameState);

  return Response.json({ gameId: insertedId });
}
