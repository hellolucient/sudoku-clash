"use client"

import { useEffect } from 'react'

type DefeatMessageProps = {
  isVisible: boolean
  score: number
  onClose: () => void
  onPlayAgain: () => void
}

export default function DefeatMessage({ isVisible, score, onClose, onPlayAgain }: DefeatMessageProps) {
  useEffect(() => {
    if (!isVisible) return
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-2xl border-2 border-[#FF6B6B] relative max-w-sm w-full mx-4">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-[#FF6B6B] hover:text-white transition-colors text-lg leading-none w-6 h-6 flex items-center justify-center rounded-full border border-[#FF6B6B]/50 hover:bg-[#FF6B6B]/20"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-white mb-2 text-center opacity-90">
          You Lost
        </h2>
        <p className="text-xl text-[#FF6B6B] font-bold text-center mb-4">
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
    </div>
  )
} 