"use client"

import { useState } from 'react'
import PrizeSlider from '@/components/prize-slider'
import { PlayerProfileProvider, usePlayerProfile } from '@/contexts/player-profile-context'

function PrizeSliderTest() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null)
  const { addExperience, addPowerup, profile } = usePlayerProfile()

  const handlePrizeSelected = (prize: string) => {
    const prizeType = prize.toLowerCase()
    setSelectedPrize(prize)
    
    if (prizeType === 'xp') {
      addExperience(25)
    } else {
      const powerUpType = prizeType as 'peek' | 'swap' | 'steal' | 'skip'
      if (['peek', 'swap', 'steal', 'skip'].includes(powerUpType)) {
        addPowerup(powerUpType, 1)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#8B8074] flex flex-col items-center justify-center p-4">
      <div className="bg-[#F4E6CC] p-8 rounded-xl shadow-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#4A2F1F] mb-6 text-center">
          Prize Slider Test
        </h1>

        {profile && (
          <div className="mb-6 p-4 bg-white rounded-lg">
            <h2 className="text-lg font-bold text-[#4A2F1F] mb-2">Player Stats:</h2>
            <p>Level: {profile.level}</p>
            <p>XP: {profile.experience}/{profile.experienceToNextLevel}</p>
            <p>Power-ups:</p>
            <ul>
              <li>Peek: {profile.powerups.peek}</li>
              <li>Swap: {profile.powerups.swap}</li>
              <li>Steal: {profile.powerups.steal}</li>
              <li>Skip: {profile.powerups.skip}</li>
            </ul>
          </div>
        )}

        <button
          onClick={() => setIsVisible(true)}
          className="w-full px-5 py-3 bg-[#4A2F1F] text-white rounded-lg cursor-pointer text-lg hover:bg-[#6B4D28] transition-colors"
        >
          Show Prize Slider
        </button>

        {selectedPrize && (
          <div className="mt-6 p-4 bg-white rounded-lg text-center">
            <h2 className="text-lg font-bold text-[#4A2F1F] mb-2">Last Selected Prize:</h2>
            <p className="text-xl">{selectedPrize}</p>
          </div>
        )}
      </div>

      <PrizeSlider
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        onPrizeSelected={handlePrizeSelected}
        forceXP={true}
      />
    </div>
  )
}

export default function PrizeSliderTestWrapper() {
  return (
    <PlayerProfileProvider>
      <PrizeSliderTest />
    </PlayerProfileProvider>
  )
} 