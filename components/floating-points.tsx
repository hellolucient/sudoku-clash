"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type FloatingPoint = {
  id: number
  value: number
  x: number
  y: number
  isBonus?: boolean
}

export default function FloatingPoints() {
  const [points, setPoints] = useState<FloatingPoint[]>([])

  // Listen for custom events to add floating points
  useEffect(() => {
    const handleAddPoints = (e: CustomEvent) => {
      const { value, x, y, isBonus } = e.detail

      // Generate a unique ID for this floating point
      const id = Date.now() + Math.random()

      // Add the new floating point
      setPoints((prev) => [...prev, { id, value, x, y, isBonus }])

      // Remove it after animation completes
      setTimeout(() => {
        setPoints((prev) => prev.filter((p) => p.id !== id))
      }, 1500) // Match animation duration (reduced from 2000)
    }

    // Add event listener
    window.addEventListener("addFloatingPoints" as any, handleAddPoints as any)

    // Clean up
    return () => {
      window.removeEventListener("addFloatingPoints" as any, handleAddPoints as any)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {points.map((point) => (
        <div
          key={point.id}
          className={cn(
            "floating-points",
            point.isBonus 
              ? "points-bonus" 
              : point.value > 0 
                ? "points-positive" 
                : "points-negative"
          )}
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
          }}
        >
          {point.value > 0 ? `+${point.value}` : point.value}
        </div>
      ))}
    </div>
  )
}

