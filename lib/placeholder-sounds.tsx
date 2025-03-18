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
export function playTone(frequency = 440, duration = 0.2, volume = 0.1, type: OscillatorType = "sine"): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
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
    console.log("Error playing tone:", error)
  }
}

// Sound presets for different game events
export const soundPresets = {
  place: () => playTone(440, 0.15, 0.1, "sine"),
  invalid: () => playTone(220, 0.3, 0.1, "square"),
  complete: () => {
    playTone(523.25, 0.1, 0.1, "sine")
    setTimeout(() => playTone(659.25, 0.1, 0.1, "sine"), 100)
    setTimeout(() => playTone(783.99, 0.2, 0.1, "sine"), 200)
  },
  bonus: () => {
    playTone(523.25, 0.1, 0.1, "sine")
    setTimeout(() => playTone(659.25, 0.2, 0.1, "sine"), 100)
  },
  gameOver: () => {
    playTone(440, 0.1, 0.1, "sine")
    setTimeout(() => playTone(392, 0.1, 0.1, "sine"), 100)
    setTimeout(() => playTone(349.23, 0.1, 0.1, "sine"), 200)
    setTimeout(() => playTone(329.63, 0.3, 0.1, "sine"), 300)
  },
  select: () => playTone(330, 0.05, 0.05, "sine"),
  draw: () => playTone(392, 0.1, 0.05, "sine"),
}

