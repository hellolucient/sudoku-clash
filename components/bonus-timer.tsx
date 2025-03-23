"use client"

import { useEffect, useState } from "react"
import { playSound } from "@/lib/game-utils"

type BonusTimerProps = {
  endTime: number
  onEnd: () => void
}

export default function BonusTimer({ endTime, onEnd }: BonusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(20)

  useEffect(() => {
    // Play initial bonus sound
    playSound("bonus")

    // Play tick sound immediately
    playSound("tick")

    const interval = setInterval(() => {
      const now = Date.now()
      const remaining = Math.max(0, endTime - now)
      setTimeLeft(Math.ceil(remaining / 1000))

      // Play tick sound every second if there's time remaining
      if (remaining > 0) {
        playSound("tick")
      } else {
        clearInterval(interval)
        playSound("gameOver") // Play game over sound when bonus ends
        onEnd()
      }
    }, 1000)

    // Cleanup function
    return () => {
      clearInterval(interval)
    }
  }, [endTime, onEnd])

  return (
    <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold px-3 py-1 rounded-xl shadow-lg flex items-center gap-2">
      <span className="text-lg">⭐</span>
      <span>{timeLeft}s</span>
    </div>
  )
} 