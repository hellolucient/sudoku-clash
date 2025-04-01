"use client"

import { useState, useEffect } from 'react'
import { soundManager } from '@/lib/sound-manager'

type PrizeSliderProps = {
  isVisible: boolean
  onClose: () => void
  onPrizeSelected: (prize: string) => void
  forceXP?: boolean
}

const prizes = [
  { type: 'peek', label: '👁️ Peek' },
  { type: 'swap', label: '🔁 Swap' },
  { type: 'steal', label: '👉 Steal' },
  { type: 'skip', label: '⏩ Skip' },
  { type: 'xp', label: '⭐ 25 XP' }
]

// Each prize box is 120px total (100px + 20px margins)
const PRIZE_WIDTH = 120
const PRIZES_PER_SET = prizes.length
const SET_WIDTH = PRIZE_WIDTH * PRIZES_PER_SET
const VIEWPORT_WIDTH = 300

export default function PrizeSlider({ isVisible, onClose, onPrizeSelected, forceXP = false }: PrizeSliderProps) {
  const [isSliding, setIsSliding] = useState(false)
  const [position, setPosition] = useState(0)
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null)
  const [hasSpun, setHasSpun] = useState(false)
  const [animationDuration, setAnimationDuration] = useState('5s')
  const [animationTiming, setAnimationTiming] = useState('cubic-bezier(0.15,0.85,0.25,1)')

  useEffect(() => {
    if (isVisible) {
      soundManager.playSound('celebration')
    }
  }, [isVisible])

  const startSlide = () => {
    if (hasSpun) return // Prevent multiple spins
    
    setIsSliding(true)
    setSelectedPrize(null)
    setHasSpun(true)
    soundManager.playSound('slide')
    
    // Calculate final stop position within first visible set
    const stopIndex = forceXP ? 4 : Math.floor(Math.random() * PRIZES_PER_SET) // XP is at index 4
    
    // Reset position without animation
    setAnimationDuration('0s')
    setPosition(0)

    // Start spinning after a brief delay to ensure reset is applied
    setTimeout(() => {
      // Initial fast spin - move through many sets to create continuous motion
      setAnimationDuration('3s')
      setAnimationTiming('linear')
      setPosition(SET_WIDTH * 8) // Spin through 8 sets at constant speed

      // Slow down to final position
      setTimeout(() => {
        setAnimationDuration('2s')
        setAnimationTiming('cubic-bezier(0.33, 1, 0.68, 1)')
        
        // Calculate final position to center the selected prize
        // We want the prize to land in the center of the viewport (150px)
        // Each prize is 120px wide, so we need to adjust the position accordingly
        const centerOffset = (VIEWPORT_WIDTH - PRIZE_WIDTH) / 2
        const finalPosition = (SET_WIDTH * 10) + (stopIndex * PRIZE_WIDTH) - centerOffset

        setPosition(finalPosition)

        // After final slowdown, show prize
        setTimeout(() => {
          const prize = prizes[stopIndex]
          setSelectedPrize(prize.type)
          soundManager.playSound('win')
          setIsSliding(false)
        }, 2000)
      }, 3000)
    }, 50)
  }

  const handleClaim = () => {
    if (selectedPrize) {
      onPrizeSelected(selectedPrize)
      onClose()
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#F4E6CC] p-8 rounded-xl shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-[#4A2F1F] hover:text-[#6B4D28] transition-colors"
        >
          ×
        </button>
        
        <h2 className="text-2xl font-bold text-[#4A2F1F] mb-6 text-center">
          🎉 Spin to Win! 🎉
        </h2>

        <div className="w-[300px] h-[140px] overflow-hidden border-4 border-[#222] rounded-lg mx-auto relative">
          {/* Center marker line */}
          <div className="absolute w-1 h-[140px] bg-black top-0 left-1/2 -translate-x-1/2 z-10" />
          
          <div 
            className="flex transition-transform pt-[8px] pb-[20px]"
            style={{ 
              transform: `translateX(-${position}px)`,
              transitionDuration: animationDuration,
              transitionTimingFunction: animationTiming,
              willChange: 'transform'
            }}
          >
            {/* Repeat prizes many times to ensure smooth infinite scroll */}
            {[...Array(24)].map((_, setIndex) => (
              prizes.map((prize, index) => (
                <div 
                  key={`set${setIndex}-${index}`}
                  className="flex-shrink-0 w-[100px] h-[100px] m-[10px] flex items-center justify-center bg-white rounded-lg text-center shadow-sm text-lg"
                >
                  {prize.label}
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}