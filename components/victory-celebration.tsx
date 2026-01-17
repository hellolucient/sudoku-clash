"use client"

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { usePlayerProfile } from '@/contexts/player-profile-context'
import { PlayerProfile } from '@/types/player-profile'
import PrizeSlider from './prize-slider'

type VictoryCelebrationProps = {
  isVisible: boolean
  score: number
  onClose: () => void
  onPlayAgain: () => void
}

type PowerUpType = 'peek' | 'swap' | 'steal' | 'skip'

export default function VictoryCelebration({ isVisible, score, onClose, onPlayAgain }: VictoryCelebrationProps) {
  const [showPrizeSlider, setShowPrizeSlider] = useState(false)
  const [hasClaimed, setHasClaimed] = useState(false)
  const { addPowerup, addExperience } = usePlayerProfile()

  useEffect(() => {
    if (!isVisible) return

    // Reset state when victory celebration becomes visible
    setHasClaimed(false)
    
    // Fire confetti from the left
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.1, y: 0.6 }
    })

    // Fire confetti from the right
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.9, y: 0.6 }
    })

    // Fire confetti bursts in the center
    const colors = ['#9945FF', '#14F195', '#F5BC41']
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { x: 0.5, y: 0.6 },
      colors
    })

    // Show prize slider after a short delay
    setTimeout(() => {
      setShowPrizeSlider(true)
    }, 1000)
  }, [isVisible])

  const handlePrizeSelected = (prize: string) => {
    const prizeType = prize.toLowerCase()
    
    // Set claimed first to prevent multiple claims
    setHasClaimed(true)
    
    // Handle all prize types with setTimeout to ensure state updates
    setTimeout(() => {
      if (prizeType === 'xp') {
        addExperience(25)
      } else {
        // Handle power-up prizes
        const powerUpType = prizeType as PowerUpType
        if (['peek', 'swap', 'steal', 'skip'].includes(powerUpType)) {
          addPowerup(powerUpType, 1)
        }
      }
      setShowPrizeSlider(false)
    }, 0)
  }

  const handleClose = () => {
    if (!hasClaimed) {
      setShowPrizeSlider(true)
      return
    }
    onClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-2xl border-2 border-[#14F195] relative max-w-sm w-full mx-4">
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 text-[#14F195] hover:text-white transition-colors text-lg leading-none w-6 h-6 flex items-center justify-center rounded-full border border-[#14F195]/50 hover:bg-[#14F195]/20"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          Victory!
        </h2>
        <p className="text-xl text-[#14F195] font-bold text-center mb-4">
          Score: {score}
        </p>
        <div className="flex justify-center">
          <button
            onClick={onPlayAgain}
            className="bg-gradient-to-r from-[#9945FF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all text-sm"
          >
            Play Again
          </button>
        </div>
      </div>

      <PrizeSlider 
        isVisible={showPrizeSlider} 
        onClose={() => setShowPrizeSlider(false)}
        onPrizeSelected={handlePrizeSelected}
      />
    </div>
  )
} 