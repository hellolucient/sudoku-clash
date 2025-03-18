"use client"

import { useEffect, useRef, useState } from "react"
import { soundPresets } from "@/lib/placeholder-sounds"

// Define sound types
export type SoundType = "place" | "invalid" | "complete" | "bonus" | "gameOver" | "select" | "draw"

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
  })

  // Create refs for all sounds
  const placeSound = useRef<HTMLAudioElement | null>(null)
  const invalidSound = useRef<HTMLAudioElement | null>(null)
  const completeSound = useRef<HTMLAudioElement | null>(null)
  const bonusSound = useRef<HTMLAudioElement | null>(null)
  const gameOverSound = useRef<HTMLAudioElement | null>(null)
  const selectSound = useRef<HTMLAudioElement | null>(null)
  const drawSound = useRef<HTMLAudioElement | null>(null)

  // Initialize sounds
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Helper function to create and test audio elements
      const createSound = (type: SoundType, path: string) => {
        const audio = new Audio()

        // Add event listeners to track loading status
        audio.addEventListener("canplaythrough", () => {
          setSoundsLoaded((prev) => ({ ...prev, [type]: true }))
        })

        audio.addEventListener("error", () => {
          console.log(`Sound file ${path} could not be loaded`)
          setSoundsLoaded((prev) => ({ ...prev, [type]: false }))
        })

        // Set source and attempt to load
        audio.src = path
        audio.load()
        return audio
      }

      // Create all sound elements with error handling
      placeSound.current = createSound("place", "/sounds/place.mp3")
      invalidSound.current = createSound("invalid", "/sounds/invalid.mp3")
      completeSound.current = createSound("complete", "/sounds/complete.mp3")
      bonusSound.current = createSound("bonus", "/sounds/bonus.mp3")
      gameOverSound.current = createSound("gameOver", "/sounds/game-over.mp3")
      selectSound.current = createSound("select", "/sounds/select.mp3")
      drawSound.current = createSound("draw", "/sounds/draw.mp3")
    }
  }, [])

  // Listen for play sound events
  useEffect(() => {
    const handlePlaySound = (e: CustomEvent) => {
      const { type } = e.detail

      let sound: HTMLAudioElement | null = null
      let isLoaded = false

      switch (type) {
        case "place":
          sound = placeSound.current
          isLoaded = soundsLoaded.place
          break
        case "invalid":
          sound = invalidSound.current
          isLoaded = soundsLoaded.invalid
          break
        case "complete":
          sound = completeSound.current
          isLoaded = soundsLoaded.complete
          break
        case "bonus":
          sound = bonusSound.current
          isLoaded = soundsLoaded.bonus
          break
        case "gameOver":
          sound = gameOverSound.current
          isLoaded = soundsLoaded.gameOver
          break
        case "select":
          sound = selectSound.current
          isLoaded = soundsLoaded.select
          break
        case "draw":
          sound = drawSound.current
          isLoaded = soundsLoaded.draw
          break
      }

      // Only attempt to play if sound is loaded
      if (sound && isLoaded) {
        sound.currentTime = 0
        sound.play().catch((err) => {
          // Silently handle any play errors
          console.log(`Could not play sound: ${type}`)
        })
      } else {
        // Use placeholder sounds as fallback
        switch (type) {
          case "place":
            soundPresets.place()
            break
          case "invalid":
            soundPresets.invalid()
            break
          case "complete":
            soundPresets.complete()
            break
          case "bonus":
            soundPresets.bonus()
            break
          case "gameOver":
            soundPresets.gameOver()
            break
          case "select":
            soundPresets.select()
            break
          case "draw":
            soundPresets.draw()
            break
        }
      }
    }

    // Add event listener
    window.addEventListener("playSound" as any, handlePlaySound as any)

    // Clean up
    return () => {
      window.removeEventListener("playSound" as any, handlePlaySound as any)
    }
  }, [soundsLoaded])

  // This component doesn't render anything
  return null
}

