import Ably from "ably";

// Server-side Ably client using API key for publishing updates
let serverAbly: Ably.Realtime | null = null;

function getServerAblyClient(): Ably.Realtime {
  if (!serverAbly && process.env.ABLY_API_KEY) {
    serverAbly = new Ably.Realtime(process.env.ABLY_API_KEY);
  }
  if (!serverAbly) {
    throw new Error("Ably API key not configured");
  }
  return serverAbly;
}

// Server-side function to publish game state updates
export function publishGameUpdate(gameId: string) {
  try {
    const ably = getServerAblyClient();
    const channel = ably.channels.get(`game:${gameId}`);
    channel.publish("gameStateChanged", {
      timestamp: Date.now(),
      gameId,
    });
    console.log(`Published update for game ${gameId}`);
  } catch (error) {
    console.error("Failed to publish game update:", error);
  }
}
