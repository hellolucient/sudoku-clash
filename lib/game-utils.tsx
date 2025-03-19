"use client"

import type { SoundType } from "./sound-manager"

// Helper to play sounds with fallback
export function playSound(type: SoundType) {
  if (typeof window !== "undefined") {
    try {
      const event = new CustomEvent("playSound", {
        detail: { type },
      })
      window.dispatchEvent(event)
    } catch (error) {
      // Silently fail if event dispatch fails
      console.log(`Failed to dispatch sound event: ${type}`)
    }
  }
}

// Helper to add floating points
export function addFloatingPoints(value: number, x: number, y: number, isBonus: boolean = false) {
  if (typeof window !== "undefined") {
    try {
      const event = new CustomEvent("addFloatingPoints", {
        detail: { value, x, y, isBonus },
      })
      window.dispatchEvent(event)
    } catch (error) {
      // Silently fail if event dispatch fails
      console.log(`Failed to dispatch floating points event`)
    }
  }
}

