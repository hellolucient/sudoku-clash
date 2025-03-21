"use client"

import { useEffect } from 'react'

type DefeatMessageProps = {
  isVisible: boolean
  score: number
  onClose: () => void
}

export default function DefeatMessage({ isVisible, score, onClose }: DefeatMessageProps) {
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
        <p className="text-2xl text-[#CC4B37] font-bold text-center">
          Score: {score}
        </p>
      </div>
    </div>
  )
} 