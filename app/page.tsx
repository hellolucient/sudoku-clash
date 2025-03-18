import SudokuGame from "@/components/sudoku-game"
import FloatingPoints from "@/components/floating-points"
import SoundManager from "@/lib/sound-manager"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-2 md:p-8">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 text-white drop-shadow-lg">SUDOKU CLASH</h1>
        <SudokuGame />
        <FloatingPoints />
        <SoundManager />
      </div>
    </main>
  )
}

