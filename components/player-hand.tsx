"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

type PlayerHandProps = {
  tiles: number[]
  onTileSelect: (index: number) => void
  disabled: boolean
}

export default function PlayerHand({ tiles = [], onTileSelect, disabled = false }: PlayerHandProps) {
  // If tiles is not provided or empty, show empty state
  if (!tiles || tiles.length === 0) {
    return (
      <div className="mt-1">
        <div className="flex justify-center space-x-1 md:space-x-2">
          <div className="text-[#4B3418] text-xs">No tiles available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-1 md:space-x-2">
      {tiles.map((value, index) => (
        <button
          key={`hand-${index}`}
          className={cn(
            "number-tile w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-lg md:text-xl font-bold text-[#4B3418]",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !disabled && onTileSelect(index)}
          disabled={disabled}
          aria-label={`Select number ${value}`}
        >
          {value}
        </button>
      ))}
    </div>
  )
}

