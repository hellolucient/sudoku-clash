import SudokuGame from "@/components/sudoku-game"
import FloatingPoints from "@/components/floating-points"
import SoundManager from "@/lib/sound-manager"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-2 md:p-8">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 text-[#4B3418] drop-shadow-lg bg-[#F9EED7]/80 py-2 px-4 rounded-lg border-2 border-[#8C653C] wooden-border shadow-xl">
          SUDOKU CLASH
        </h1>
        <SudokuGame />
        <FloatingPoints />
        <SoundManager />
      </div>
    </main>
  )
}

