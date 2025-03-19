import SudokuGame from "@/components/sudoku-game"
import FloatingPoints from "@/components/floating-points"
import SoundManager from "@/lib/sound-manager"
import ProfileManagement from "@/components/profile-management"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-1 md:p-2">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-xl md:text-2xl font-bold text-center mb-1 text-[#4B3418] drop-shadow-lg bg-[#F9EED7]/80 py-1 px-4 rounded-lg border-2 border-[#8C653C] wooden-border shadow-xl">
          SUDOKU CLASH
        </h1>
        <ProfileManagement />
        <SudokuGame />
        <FloatingPoints />
        <SoundManager />
      </div>
    </main>
  )
}

