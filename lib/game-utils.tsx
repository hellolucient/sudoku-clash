"use client"

import type { SoundType } from "@/components/sound-manager"
import { soundPresets } from "./placeholder-sounds"

let isMuted = false

export const setMuted = (muted: boolean) => {
  isMuted = muted
}

export const playSound = async (sound: string) => {
  if (isMuted) return

  try {
    // Use the sound presets
    switch (sound) {
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
        await soundPresets.levelUp()
        break
      case "tick":
        await soundPresets.tick()
        break
      default:
        console.warn(`Unknown sound type: ${sound}`)
    }
  } catch (error) {
    console.error(`Error playing sound ${sound}:`, error)
  }
}

// Helper to add floating points
export const addFloatingPoints = (value: number, x: number, y: number, isBonus?: boolean, message?: string) => {
  const event = new CustomEvent("addFloatingPoints", {
    detail: { value, x, y, isBonus, message }
  })
  try {
    window.dispatchEvent(event)
  } catch (error) {
    console.error("Failed to dispatch addFloatingPoints event:", error)
  }
}

