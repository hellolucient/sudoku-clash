"use client"

import type { SoundType } from "@/components/sound-manager"
import { soundPresets } from "./placeholder-sounds"

let isMuted = false

export const setMuted = (muted: boolean) => {
  isMuted = muted
}

export const playSound = async (sound: string) => {
  if (isMuted) return
  if (typeof window === 'undefined') return

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
export const addFloatingPoints = (value: number, x: number, y: number, isBonus?: boolean, message?: string, playSoundForBubble?: boolean) => {
  // Play sound for this floating point bubble if requested
  if (playSoundForBubble && !isMuted) {
    if (isBonus || value >= 25) {
      // Play bonus sound for bonus points
      playSound("bonus").catch(err => console.error("Error playing bonus sound:", err))
    } else if (value > 0) {
      // Play a light sound for regular points
      playSound("select").catch(err => console.error("Error playing select sound:", err))
    }
  }
  // Adjust X position if too close to edges to prevent cutoff
  if (typeof window === 'undefined') {
    // SSR fallback - just use the provided X
    const event = new CustomEvent("addFloatingPoints", {
      detail: { value, x, y, isBonus, message }
    })
    try {
      window.dispatchEvent(event)
    } catch (error) {
      console.error("Failed to dispatch addFloatingPoints event:", error)
    }
    return
  }
  
  const windowWidth = window.innerWidth
  // Estimate bubble width based on content (longer for bonus messages)
  const bubbleWidth = message ? 180 : (isBonus ? 100 : 70)
  const padding = 16 // Padding from edge
  const minX = padding
  const maxX = windowWidth - bubbleWidth - padding
  
  // If X is too close to right edge, move it inward
  // If X is too close to left edge, move it inward
  let adjustedX = x
  if (x > maxX) {
    adjustedX = maxX
  } else if (x < minX) {
    adjustedX = minX
  }
  
  const event = new CustomEvent("addFloatingPoints", {
    detail: { value, x: adjustedX, y, isBonus, message }
  })
  try {
    window.dispatchEvent(event)
  } catch (error) {
    console.error("Failed to dispatch addFloatingPoints event:", error)
  }
}

