"use client"

import { useState } from 'react';
import ProfileManagement from '@/components/profile-management';
import SudokuGame from '@/components/sudoku-game';

export default function HomePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  const handleStartGame = (selectedDifficulty: "easy" | "medium" | "hard") => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
  };

  const handleExitGame = () => {
    setGameStarted(false);
  };

  if (gameStarted) {
    return (
      <div className="h-screen bg-gradient-to-b from-[#0D1117] to-[#1a1a2e] p-2 overflow-y-auto">
        <div className="max-w-md mx-auto min-h-full flex flex-col pb-safe">
          <SudokuGame onExit={handleExitGame} difficulty={difficulty} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D1117] to-[#1a1a2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ProfileManagement onStartGame={handleStartGame} />
      </div>
    </div>
  );
}
