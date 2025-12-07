"use client";

import "./GameControls.css";

export interface GameControlsProps {
  onStart: () => void;
  onPlay: () => void;
  onEndTurn: () => void;
}

export function GameControls({
  onEndTurn,
  onPlay,
  onStart,
}: GameControlsProps) {
  return (
    <div className="game-controls">
      <button onClick={onStart}>start game</button>
      <button onClick={onPlay}>play</button>
      <button onClick={onEndTurn}>end turn</button>
    </div>
  );
}
