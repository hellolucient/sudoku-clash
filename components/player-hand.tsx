"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

type PlayerHandProps = {
  tiles: number[]
  onTileSelect: (index: number) => void
  disabled?: boolean
  highlightedTileIndex?: number
}

export default function PlayerHand({ tiles, onTileSelect, disabled = false, highlightedTileIndex }: PlayerHandProps) {
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
    <div className="grid grid-cols-8 gap-1">
      {tiles.map((tile, index) => (
        <button
          key={`${index}-${tile}`}
          onClick={() => onTileSelect(index)}
          disabled={disabled}
          className={`
            relative flex items-center justify-center
            w-10 h-10 md:w-12 md:h-12
            rounded-lg number-tile
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:translate-y-[-2px] hover:shadow-lg'}
            ${highlightedTileIndex === index ? 'scale-110 shadow-lg translate-y-[-4px] border-2 border-[#1B998B] z-10 animate-slow-pulse' : ''}
            transition-all duration-300
          `}
        >
          {tile}
        </button>
      ))}
    </div>
  )
}

