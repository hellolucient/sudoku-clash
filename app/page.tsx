"use client"

import { useState } from "react"
import SudokuGame from "@/components/sudoku-game"
import FloatingPoints from "@/components/floating-points"
import ProfileManagement from "@/components/profile-management"

export default function Home() {
  const [gameState, setGameState] = useState<{
    isStarted: boolean;
    difficulty: "easy" | "medium" | "hard";
  }>({
    isStarted: false,
    difficulty: "medium"
  });

  const handleStartGame = (difficulty: "easy" | "medium" | "hard") => {
    setGameState({
      isStarted: true,
      difficulty
    });
  };

  const handleExitGame = () => {
    setGameState(prev => ({
      ...prev,
      isStarted: false
    }));
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-1 md:p-2">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-xl md:text-2xl font-bold text-center mb-1 text-[#4B3418] drop-shadow-lg bg-[#F9EED7]/80 py-1 px-4 rounded-lg border-2 border-[#8C653C] wooden-border shadow-xl">
          SUDOKU CLASH
        </h1>
        {!gameState.isStarted ? (
          <ProfileManagement onStartGame={handleStartGame} />
        ) : (
          <SudokuGame onExit={handleExitGame} difficulty={gameState.difficulty} />
        )}
        <FloatingPoints />
      </div>
    </main>
  )
}

