"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

type PlayerHandProps = {
  tiles: number[]
  onTileSelect: (index: number) => void
  disabled: boolean
}

export default function PlayerHand({ tiles = [], onTileSelect, disabled = false }: PlayerHandProps) {
  // Get the color class based on the number value
  const getColorClass = (value: number) => {
    // Ensure value is between 1-9
    const safeValue = Math.min(Math.max(1, value), 9);
    return `tile-number-${safeValue}`;
  }

  // If tiles is not provided or empty, show empty state
  if (!tiles || tiles.length === 0) {
    return (
      <div className="mt-2">
        <div className="flex justify-center space-x-2 md:space-x-3">
          <div className="text-[#4B3418]">No tiles available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-2 md:space-x-3">
      {tiles.map((value, index) => (
        <button
          key={`hand-${index}`}
          className={cn(
            "player-tile w-12 h-12 md:w-16 md:h-16 flex items-center justify-center",
            getColorClass(value),
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

