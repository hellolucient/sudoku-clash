"use client"

import { useState } from 'react'
import PrizeSlider from '@/components/prize-slider'
import { PlayerProfileProvider, usePlayerProfile } from '@/contexts/player-profile-context'

export default function TestPrizeSlider() {
  const [isVisible, setIsVisible] = useState(true)
  const { addExperience, addPowerup, profile } = usePlayerProfile()

  const handlePrizeSelected = (prize: string) => {
    console.log('Prize selected:', prize)
  }

  return (
    <div className="min-h-screen bg-[#E5D5B7] p-8">
      <h1 className="text-3xl font-bold text-[#4A2F1F] mb-6">Prize Slider Test</h1>
      
      <button
        onClick={() => setIsVisible(true)}
        className="px-5 py-2 bg-[#4A2F1F] text-white rounded-lg"
      >
        Show Prize Slider
      </button>

      <PrizeSlider
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        onPrizeSelected={handlePrizeSelected}
      />
    </div>
  )
} 