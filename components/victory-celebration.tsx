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
    const colors = ['#F5BC41', '#CC4B37', '#F9EED7']
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
    
    if (prizeType === 'xp') {
      // Add 25 XP to the player's profile
      addExperience(25)
    } else {
      // Handle power-up prizes
      const powerUpType = prizeType as PowerUpType
      if (['peek', 'swap', 'steal', 'skip'].includes(powerUpType)) {
        addPowerup(powerUpType, 1)
      }
    }
    
    setHasClaimed(true)
    setShowPrizeSlider(false)
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
      <div className="bg-[#4B3418]/90 p-6 rounded-xl shadow-2xl border-4 border-[#F5BC41] animate-bounce-fade relative">
        <button 
          onClick={handleClose}
          className="absolute top-1 right-1 text-[#F5BC41] hover:text-[#F9EED7] transition-colors text-xs leading-none w-4 h-4 flex items-center justify-center rounded-full border-[1.5px] border-[#F5BC41] hover:bg-[#F5BC41]"
        >
          ×
        </button>
        <h2 className="text-4xl font-bold text-[#F9EED7] mb-2 text-center">
          Victory!
        </h2>
        <p className="text-2xl text-[#F5BC41] font-bold text-center mb-4">
          Score: {score}
        </p>
        <div className="flex justify-center">
          <button
            onClick={onPlayAgain}
            className="bg-gradient-to-r from-[#F5BC41] to-[#CC7A4D] hover:from-[#E5AC31] hover:to-[#BC6A3D] text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
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