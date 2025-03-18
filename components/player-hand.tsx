"use client"

import { cn } from "@/lib/utils"

type PlayerHandProps = {
  tiles: number[]
  onTileSelect: (index: number) => void
  disabled: boolean
}

export default function PlayerHand({ tiles, onTileSelect, disabled }: PlayerHandProps) {
  // Get a unique gradient for each number
  const getGradient = (number: number) => {
    const gradients = [
      "from-pink-500 to-rose-600",
      "from-purple-500 to-violet-600",
      "from-indigo-500 to-blue-600",
      "from-cyan-500 to-teal-600",
      "from-emerald-500 to-green-600",
      "from-amber-500 to-yellow-600",
      "from-orange-500 to-red-600",
      "from-fuchsia-500 to-pink-600",
      "from-blue-500 to-indigo-600",
    ]

    return gradients[number - 1] || "from-violet-500 to-purple-600"
  }

  return (
    <div className="flex gap-1 md:gap-3 justify-center">
      {tiles.map((tile, index) => (
        <button
          key={index}
          className={cn(
            "w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-base md:text-xl font-bold rounded-lg",
            "transition-all duration-200 shadow-lg transform hover:scale-110 hover:shadow-xl",
            "bg-gradient-to-br text-white",
            disabled
              ? "opacity-50 cursor-not-allowed from-gray-400 to-gray-500"
              : `${getGradient(tile)} cursor-pointer`,
            !disabled && "hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]",
          )}
          onClick={() => !disabled && onTileSelect(index)}
          disabled={disabled}
        >
          {tile}
        </button>
      ))}
    </div>
  )
}

