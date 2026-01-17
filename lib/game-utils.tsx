"use client"

import type { SoundType } from "@/components/sound-manager"
import { soundPresets, getAudioContext } from "./placeholder-sounds"

let isMuted = false
let isMusicMuted = false
let backgroundMusicAudio: HTMLAudioElement | null = null
let isBackgroundMusicPlaying = false

export const setMuted = (muted: boolean) => {
  isMuted = muted
}

export const setMusicMuted = (muted: boolean) => {
  isMusicMuted = muted
  if (muted) {
    stopBackgroundMusic()
  } else {
    // When unmuted, restart music if it was playing before
    // The component will handle starting it
    if (backgroundMusicAudio && !isBackgroundMusicPlaying) {
      startBackgroundMusic().catch(err => {
        console.error("Failed to restart background music on unmute:", err)
      })
    }
  }
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

// Background music - using MP3 file
export const startBackgroundMusic = async () => {
  console.log("startBackgroundMusic called", { 
    window: typeof window !== 'undefined',
    isMusicMuted, 
    isBackgroundMusicPlaying 
  })
  
  if (typeof window === 'undefined') {
    console.log("Background music: window undefined")
    return
  }
  if (isMusicMuted) {
    console.log("Background music: muted")
    return
  }
  if (isBackgroundMusicPlaying) {
    console.log("Background music: already playing")
    return
  }
  
  try {
    // Create or reuse audio element
    if (!backgroundMusicAudio) {
      backgroundMusicAudio = new Audio('/sounds/background-music.mp3')
      backgroundMusicAudio.loop = true
      backgroundMusicAudio.volume = 0.3 // 30% volume - adjust as needed
      backgroundMusicAudio.preload = 'auto'
      
      // Handle errors
      backgroundMusicAudio.addEventListener('error', (e) => {
        console.error("Error loading background music:", e)
        isBackgroundMusicPlaying = false
      })
      
      // Handle when music ends (shouldn't happen with loop, but just in case)
      backgroundMusicAudio.addEventListener('ended', () => {
        console.log("Background music ended")
        isBackgroundMusicPlaying = false
      })
    }
    
    // Set flag before playing
    isBackgroundMusicPlaying = true
    
    // Play the music
    try {
      await backgroundMusicAudio.play()
      console.log("Background music started playing")
    } catch (playError) {
      console.error("Error playing background music:", playError)
      // If autoplay is blocked, we'll try again on user interaction
      isBackgroundMusicPlaying = false
    }
  } catch (error) {
    console.error("Error starting background music:", error)
    isBackgroundMusicPlaying = false
  }
}

export const stopBackgroundMusic = () => {
  console.log("Stopping background music")
  isBackgroundMusicPlaying = false
  
  if (backgroundMusicAudio) {
    try {
      backgroundMusicAudio.pause()
      backgroundMusicAudio.currentTime = 0
      console.log("Background music stopped")
    } catch (e) {
      console.error("Error stopping background music:", e)
    }
  }
}

