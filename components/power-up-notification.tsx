"use client"

import { useEffect } from 'react'

type PowerUpAction = 'peek' | 'swap' | 'steal' | 'skip'
type PowerUpType = PowerUpAction | 'none'

type PowerUpNotificationProps = {
  isVisible: boolean
  action: PowerUpType
  player: 'player' | 'cpu'
  onClose: () => void
  gameState?: { activePowerUp?: PowerUpType | null, pool: number[] }
}

export default function PowerUpNotification({ isVisible, action, player, onClose, gameState }: PowerUpNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      // Auto-hide notification after 2 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const getMessage = () => {
    if (player === 'cpu') {
      return `CPU used ${action.toUpperCase()}!`
    }

    switch (action) {
      case 'peek':
        return 'Select an empty cell to peek at its number'
      case 'swap':
        // If there's an active power-up, show the initial message
        if (gameState?.activePowerUp === 'swap') {
          return gameState.pool.length > 0
            ? 'Select a tile from YOUR HAND to swap with the Pool'
            : 'Select a tile from YOUR HAND to swap with CPU'
        }
        // Otherwise, show the completion message
        return gameState?.pool.length ? 'You have swapped a tile with the Pool' : 'You have swapped a tile with CPU'
      case 'steal':
        return 'You stole a tile from CPU!'
      case 'skip':
        return 'You skipped your turn!'
      default:
        return ''
    }
  }

  const message = getMessage()
  const bgColor = player === 'player' ? 'bg-[#4B3418]' : 'bg-[#8C653C]'
  const borderColor = player === 'player' ? 'border-[#F5BC41]' : 'border-[#CC4B37]'

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className={`${bgColor}/90 p-4 rounded-xl shadow-2xl border-2 ${borderColor}`}>
        <p className="text-lg font-bold text-[#F9EED7] text-center">
          {message}
        </p>
      </div>
    </div>
  )
} 