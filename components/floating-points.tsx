"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type FloatingPoint = {
  id: number
  value: number
  x: number
  y: number
}

export default function FloatingPoints() {
  const [points, setPoints] = useState<FloatingPoint[]>([])

  // Listen for custom events to add floating points
  useEffect(() => {
    const handleAddPoints = (e: CustomEvent) => {
      const { value, x, y } = e.detail

      // Generate a unique ID for this floating point
      const id = Date.now() + Math.random()

      // Add the new floating point
      setPoints((prev) => [...prev, { id, value, x, y }])

      // Remove it after animation completes
      setTimeout(() => {
        setPoints((prev) => prev.filter((p) => p.id !== id))
      }, 2000) // Match animation duration
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
            "absolute text-xl md:text-2xl font-bold animate-float-up",
            point.value > 0 ? "text-green-500" : "text-red-500",
          )}
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            textShadow: "0 0 5px rgba(0,0,0,0.5)",
          }}
        >
          {point.value > 0 ? `+${point.value}` : point.value}
        </div>
      ))}
    </div>
  )
}

