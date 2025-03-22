"use client"

/**
 * This file provides a way to generate placeholder sounds programmatically
 * until real sound files are added to the project.
 */

// Generate a simple tone with the Web Audio API
export function generateTone(
  frequency = 440,
  duration = 0.2,
  volume = 0.1,
  type: OscillatorType = "sine",
): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Create buffer
      const sampleRate = audioContext.sampleRate
      const bufferLength = duration * sampleRate
      const buffer = audioContext.createBuffer(1, bufferLength, sampleRate)

      // Fill buffer with waveform data
      const channelData = buffer.getChannelData(0)

      for (let i = 0; i < bufferLength; i++) {
        const t = i / sampleRate

        // Different waveform types
        let sample = 0

        switch (type) {
          case "sine":
            sample = Math.sin(2 * Math.PI * frequency * t)
            break
          case "square":
            sample = Math.sign(Math.sin(2 * Math.PI * frequency * t))
            break
          case "sawtooth":
            sample = 2 * (t * frequency - Math.floor(0.5 + t * frequency))
            break
          case "triangle":
            sample = Math.abs(2 * (t * frequency - Math.floor(0.5 + t * frequency))) * 2 - 1
            break
        }

        // Apply volume and fade out
        const fadeOutStart = bufferLength * 0.7
        if (i > fadeOutStart) {
          const fadeOut = 1 - (i - fadeOutStart) / (bufferLength - fadeOutStart)
          sample *= fadeOut
        }

        channelData[i] = sample * volume
      }

      resolve(buffer)
    } catch (error) {
      reject(error)
    }
  })
}

// Play a generated tone
export async function playTone(frequency = 440, duration = 0.2, volume = 0.1, type: OscillatorType = "sine"): Promise<void> {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Ensure audio context is resumed
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = type
    oscillator.frequency.value = frequency
    gainNode.gain.value = volume

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()

    // Fade out
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

    // Stop after duration
    oscillator.stop(audioContext.currentTime + duration)
  } catch (error) {
    console.error("Error playing tone:", error)
  }
}

// Sound presets for different game events
export const soundPresets = {
  place: async () => await playTone(440, 0.15, 0.1, "sine"),
  invalid: async () => await playTone(220, 0.3, 0.1, "square"),
  complete: async () => {
    await playTone(523.25, 0.1, 0.1, "sine")
    await new Promise(resolve => setTimeout(resolve, 100))
    await playTone(659.25, 0.1, 0.1, "sine")
    await new Promise(resolve => setTimeout(resolve, 100))
    await playTone(783.99, 0.2, 0.1, "sine")
  },
  bonus: async () => {
    await playTone(523.25, 0.1, 0.1, "sine")
    await new Promise(resolve => setTimeout(resolve, 100))
    await playTone(659.25, 0.2, 0.1, "sine")
  },
  gameOver: async () => {
    await playTone(440, 0.1, 0.1, "sine")
    await new Promise(resolve => setTimeout(resolve, 100))
    await playTone(392, 0.1, 0.1, "sine")
    await new Promise(resolve => setTimeout(resolve, 100))
    await playTone(349.23, 0.1, 0.1, "sine")
    await new Promise(resolve => setTimeout(resolve, 100))
    await playTone(329.63, 0.3, 0.1, "sine")
  },
  select: async () => await playTone(330, 0.05, 0.05, "sine"),
  draw: async () => await playTone(392, 0.1, 0.05, "sine"),
  levelUp: async () => {
    // Play an ascending major arpeggio with a final chord
    await playTone(523.25, 0.15, 0.1, "sine") // C
    await new Promise(resolve => setTimeout(resolve, 150))
    await playTone(659.25, 0.15, 0.1, "sine") // E
    await new Promise(resolve => setTimeout(resolve, 150))
    await playTone(783.99, 0.15, 0.1, "sine") // G
    await new Promise(resolve => setTimeout(resolve, 150))
    await playTone(1046.50, 0.15, 0.1, "sine") // High C
    await new Promise(resolve => setTimeout(resolve, 150))
    // Final chord
    await Promise.all([
      playTone(523.25, 0.4, 0.08, "sine"), // C
      playTone(659.25, 0.4, 0.08, "sine"), // E
      playTone(783.99, 0.4, 0.08, "sine"), // G
      playTone(1046.50, 0.4, 0.08, "sine") // High C
    ])
  }
}

