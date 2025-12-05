"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { push } = useRouter();

  const handleClick = useCallback(async () => {
    const response = await fetch("/actions/game", {
      method: "POST",
    });
    const data = await response.json();
    push(`/game/${data.gameId}`);
  }, [push]);

  return (
    <div>
      <button onClick={handleClick}>new game</button>
    </div>
  );
}
