"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

type PlayerHandProps = {
  tiles: number[]
  onTileSelect: (index: number) => void
  disabled: boolean
}

const colorClasses = [
  "player-tile-purple",
  "player-tile-blue", 
  "player-tile-green",
  "player-tile-red",
  "player-tile-orange",
  "player-tile-pink",
  "player-tile-teal"
]

export default function PlayerHand({ tiles = [], onTileSelect, disabled = false }: PlayerHandProps) {
  // Get a random but consistent color for each tile
  const getColorClass = (index: number, value: number) => {
    return colorClasses[(index + value) % colorClasses.length]
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
            getColorClass(index, value),
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

