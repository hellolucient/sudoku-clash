"use client"

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

type VictoryCelebrationProps = {
  isVisible: boolean
  score: number
  onClose: () => void
  onPlayAgain: () => void
}

export default function VictoryCelebration({ isVisible, score, onClose, onPlayAgain }: VictoryCelebrationProps) {
  useEffect(() => {
    if (!isVisible) return

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
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#4B3418]/90 p-6 rounded-xl shadow-2xl border-4 border-[#F5BC41] animate-bounce-fade relative">
        <button 
          onClick={onClose}
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
    </div>
  )
} 