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

// Each prize box is 96px total (80px + 16px margins)
const PRIZE_WIDTH = 96
const PRIZES_PER_SET = prizes.length
const SET_WIDTH = PRIZE_WIDTH * PRIZES_PER_SET
const VIEWPORT_WIDTH = 240

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
        // Center of viewport is at VIEWPORT_WIDTH / 2 = 120px
        // We need to position the prize so its center aligns with the viewport center
        // The left edge of the prize should be at: (VIEWPORT_WIDTH - PRIZE_WIDTH) / 2
        const centerOffset = (VIEWPORT_WIDTH - PRIZE_WIDTH) / 2
        // Position the slider so the selected prize's left edge is at centerOffset
        // Starting from set 10, move to the selected prize and adjust for centering
        const finalPosition = (SET_WIDTH * 10) + (stopIndex * PRIZE_WIDTH) - centerOffset

        setPosition(finalPosition)

        // After final slowdown, set the selected prize based on stopIndex
        // We use stopIndex directly since that's what we calculated to be at the center
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
      <div className="bg-[#1a1a2e] p-4 rounded-lg shadow-2xl relative border-2 border-[#14F195] max-w-sm w-full mx-4">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-[#14F195] hover:text-white transition-colors text-lg leading-none w-6 h-6 flex items-center justify-center rounded-full border border-[#14F195]/50 hover:bg-[#14F195]/20"
        >
          ×
        </button>
        
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          🎉 Spin to Win! 🎉
        </h2>

        <div className="w-[240px] h-[100px] overflow-hidden border-2 border-[#14F195]/50 rounded-lg mx-auto relative">
          {/* Center marker line */}
          <div className="absolute w-1 h-[100px] bg-[#14F195] top-0 left-1/2 -translate-x-1/2 z-10" />
          
          <div 
            className="flex transition-transform pt-[2px] pb-[18px]"
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
                  className="flex-shrink-0 w-[80px] h-[80px] m-[8px] flex items-center justify-center bg-[#0D1117] border border-[#14F195]/30 rounded-lg text-center text-sm text-white"
                >
                  {prize.label}
                </div>
              ))
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-3">
          {!selectedPrize ? (
            <button
              onClick={startSlide}
              disabled={isSliding || hasSpun}
              className="px-4 py-1.5 bg-gradient-to-r from-[#9945FF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white rounded-lg cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSliding ? 'Spinning...' : hasSpun ? 'Already Spun' : 'Spin'}
            </button>
          ) : (
            <>
              <div className="text-center font-bold text-[#14F195] text-sm">
                You won: {prizes.find(p => p.type === selectedPrize)?.label}! 🎉
              </div>
              <button
                onClick={handleClaim}
                className="px-4 py-1.5 bg-gradient-to-r from-[#14F195] to-[#00D4AA] hover:from-[#12E085] hover:to-[#00C49A] text-[#0D1117] rounded-lg cursor-pointer text-sm transition-colors font-bold"
              >
                Claim Prize
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}