"use client";

import { useEffect, useCallback } from "react";
import Ably from "ably";
import type { GameState } from "../../data";
import type { Serialized } from "../../data/state";
import { api } from "../../apiClient";
import type { InboundMessage } from "ably";

export interface UseGameUpdatesProps {
  gameId: string;
  userId: string;
  onGameUpdate: (game: Serialized<GameState>) => void;
}

// Client-side Ably client factory with token auth
function createAblyClient(clientId: string): Ably.Realtime {
  return new Ably.Realtime({
    authUrl: "/api/ably-token",
    authMethod: "POST",
    authHeaders: {
      "Content-Type": "application/json",
    },
    authParams: { clientId },
    clientId: clientId,
  });
}

export function useGameUpdates({
  gameId,
  userId,
  onGameUpdate,
}: UseGameUpdatesProps) {
  const refreshGameState = useCallback(async () => {
    try {
      const updatedGame = await api.getGame(gameId);
      onGameUpdate(updatedGame);
    } catch (error) {
      console.error("Failed to refresh game state:", error);
    }
  }, [gameId, onGameUpdate]);

  useEffect(() => {
    if (!userId) return;

    const ably = createAblyClient(userId);
    const channel = ably.channels.get(`game:${gameId}`);

    const handleGameStateChanged = (message: InboundMessage) => {
      console.log("Received game state change notification:", message.data);
      refreshGameState();
    };

    channel.subscribe("gameStateChanged", handleGameStateChanged);

    return () => {
      channel.unsubscribe("gameStateChanged", handleGameStateChanged);
      ably.close();
    };
  }, [gameId, userId, refreshGameState]);
}
