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
      <div className="bg-[#4B3418]/90 p-6 rounded-xl shadow-2xl border-4 border-[#CC4B37] animate-fade-in relative">
        <button 
          onClick={onClose}
          className="absolute top-1 right-1 text-[#CC4B37] hover:text-[#F9EED7] transition-colors text-xs leading-none w-4 h-4 flex items-center justify-center rounded-full border-[1.5px] border-[#CC4B37] hover:bg-[#CC4B37]"
        >
          ×
        </button>
        <h2 className="text-4xl font-bold text-[#F9EED7] mb-2 text-center opacity-80">
          You Lost
        </h2>
        <p className="text-2xl text-[#CC4B37] font-bold text-center mb-4">
          Score: {score}
        </p>
        <div className="flex justify-center">
          <button
            onClick={onPlayAgain}
            className="bg-gradient-to-r from-[#CC4B37] to-[#8C3527] hover:from-[#BC3B27] hover:to-[#7C2517] text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  )
} 