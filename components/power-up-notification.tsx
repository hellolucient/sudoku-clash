"use client"

import { useEffect } from 'react'

type PowerUpAction = 'peek' | 'swap' | 'steal' | 'skip'

type PowerUpNotificationProps = {
  isVisible: boolean
  action: PowerUpAction
  player: 'player' | 'cpu'
  onClose: () => void
}

export default function PowerUpNotification({ isVisible, action, player, onClose }: PowerUpNotificationProps) {
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

  const messages = {
    peek: {
      player: "You used Peek to reveal a number!",
      cpu: "CPU used Peek to reveal a number!"
    },
    swap: {
      player: "You swapped a tile with the pool!",
      cpu: "CPU swapped a tile with the pool!"
    },
    steal: {
      player: "You stole a tile from CPU!",
      cpu: "CPU stole a tile from you!"
    },
    skip: {
      player: "You skipped your turn!",
      cpu: "CPU skipped their turn!"
    }
  }

  const message = messages[action][player]
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