"use client"

import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import PowerUpButton from './power-up-button'
import { playSound } from '@/lib/game-utils'

// Calculate XP needed for the next level
const calculateNextLevelXP = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

type LevelUpCelebrationProps = {
  isVisible: boolean
  newLevel: number
  onClose: () => void
}

export default function LevelUpCelebration({ isVisible, newLevel, onClose }: LevelUpCelebrationProps) {
  useEffect(() => {
    if (!isVisible) return

    // Initialize audio context and play level up sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioContext.resume().then(() => {
      playSound("levelUp")
    })

    // Create a spiral animation effect
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ['#FFD700', '#F5BC41', '#FFF'];
    
    const frame = () => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) return;
      
      const particleCount = 2;
      
      // Calculate spiral position
      const angle = (timeLeft / duration) * 720; // 2 full rotations
      const velocity = 2;
      const spread = 60;
      
      confetti({
        particleCount,
        angle: angle,
        spread: spread,
        origin: { x: 0.5 + Math.cos(angle * Math.PI / 180) * 0.3, 
                 y: 0.5 + Math.sin(angle * Math.PI / 180) * 0.3 },
        colors: colors,
        shapes: ['star'],
        ticks: 200,
        gravity: 0.3,
        scalar: 0.8,
        drift: 0,
        startVelocity: velocity * 2
      });
      
      requestAnimationFrame(frame);
    };
    
    frame();
  }, [isVisible]);

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#4B3418]/90 p-6 rounded-xl shadow-2xl border-4 border-[#FFD700] animate-bounce-fade relative">
        <button 
          onClick={onClose}
          className="absolute top-1 right-1 text-[#FFD700] hover:text-[#F9EED7] transition-colors text-xs leading-none w-4 h-4 flex items-center justify-center rounded-full border-[1.5px] border-[#FFD700] hover:bg-[#FFD700]"
        >
          ×
        </button>
        <h2 className="text-4xl font-bold text-[#F9EED7] mb-2 text-center">
          Level Up!
        </h2>
        <p className="text-2xl text-[#FFD700] font-bold text-center mb-4">
          You reached Level {newLevel}
        </p>
        <div className="bg-[#F9EED7]/10 p-4 rounded-lg mb-4">
          <h3 className="text-[#F5BC41] font-bold mb-2 text-center">Rewards:</h3>
          <div className="grid grid-cols-4 gap-3">
            <PowerUpButton type="peek" count={1} disabled onClick={() => {}} />
            <PowerUpButton type="swap" count={1} disabled onClick={() => {}} />
            <PowerUpButton type="steal" count={1} disabled onClick={() => {}} />
            <PowerUpButton type="skip" count={1} disabled onClick={() => {}} />
          </div>
        </div>
        <div className="text-center text-[#F9EED7]/80 text-sm">
          Next level at {calculateNextLevelXP(newLevel)} XP
        </div>
      </div>
    </div>
  )
} 