"use client"

import { useEffect, useRef, useState } from "react"
import { soundPresets } from "@/lib/placeholder-sounds"

// Define sound types
export type SoundType = "place" | "invalid" | "complete" | "bonus" | "gameOver" | "select" | "draw" | "levelUp" | "tick"

// Define custom event type
interface PlaySoundEvent extends CustomEvent {
  detail: {
    type: SoundType
  }
}

// Sound manager component
export default function SoundManager() {
  const [soundsLoaded, setSoundsLoaded] = useState<Record<SoundType, boolean>>({
    place: false,
    invalid: false,
    complete: false,
    bonus: false,
    gameOver: false,
    select: false,
    draw: false,
    levelUp: false,
    tick: false
  })

  // Listen for play sound events
  useEffect(() => {
    const handlePlaySound = async (e: Event) => {
      const event = e as PlaySoundEvent
      console.log('Received sound event:', event.detail.type) // Debug log
      const { type } = event.detail

      try {
        // Use placeholder sounds
        switch (type) {
          case "place":
            await soundPresets.place()
            break
          case "invalid":
            await soundPresets.invalid()
            break
          case "complete":
            await soundPresets.complete()
            break
          case "bonus":
            await soundPresets.bonus()
            break
          case "gameOver":
            await soundPresets.gameOver()
            break
          case "select":
            await soundPresets.select()
            break
          case "draw":
            await soundPresets.draw()
            break
          case "levelUp":
            console.log('Playing level up sound') // Debug log
            await soundPresets.levelUp()
            break
          case "tick":
            await soundPresets.tick()
            break
        }
      } catch (error) {
        console.error('Error playing sound:', error) // Debug log
      }
    }

    console.log('Setting up sound event listener') // Debug log

    // Add event listener
    window.addEventListener("playSound", handlePlaySound)

    // Clean up
    return () => {
      window.removeEventListener("playSound", handlePlaySound)
    }
  }, [])

  // This component doesn't render anything
  return null
} 