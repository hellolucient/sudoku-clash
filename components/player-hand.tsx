"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

type PlayerHandProps = {
  tiles: number[]
  onTileSelect: (index: number) => void
  disabled?: boolean
  highlightedTileIndex?: number
  isSwapActive?: boolean
}

export default function PlayerHand({ tiles, onTileSelect, disabled = false, highlightedTileIndex, isSwapActive }: PlayerHandProps) {
  // If tiles is not provided or empty, show empty state
  if (!tiles || tiles.length === 0) {
    return (
      <div className="mt-1">
        <div className="flex justify-center space-x-1 md:space-x-2">
          <div className="text-[#14F195] text-xs">No tiles available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-1 flex-wrap">
      {tiles.map((tile, index) => (
        <button
          key={`${index}-${tile}`}
          onClick={() => onTileSelect(index)}
          disabled={disabled}
          className={cn(
            "relative flex items-center justify-center",
            "aspect-square rounded-lg number-tile",
            "text-sm md:text-base font-bold text-white",
            "w-11 h-11 md:w-10 md:h-10",
            "drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]",
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:translate-y-[-2px] hover:shadow-lg',
            highlightedTileIndex === index && 'scale-110 shadow-lg translate-y-[-4px] border-2 border-[#14F195] z-10 animate-slow-pulse',
            isSwapActive && 'animate-slow-pulse border-2 border-[#14F195]',
            "transition-all duration-300"
          )}
        >
          {tile}
        </button>
      ))}
    </div>
  )
}

