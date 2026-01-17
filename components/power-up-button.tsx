"use client"

type PowerUpButtonProps = {
  type: 'peek' | 'swap' | 'steal' | 'skip'
  count: number
  disabled?: boolean
  onClick: () => void
}

const POWER_UP_ICONS = {
  peek: '👁️',
  swap: '🔄',
  steal: '💸',
  skip: '⏩'
}

const POWER_UP_LABELS = {
  peek: 'Peek',
  swap: 'Swap',
  steal: 'Steal',
  skip: 'Skip'
}

export default function PowerUpButton({ type, count, disabled = false, onClick }: PowerUpButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || count === 0}
      className={`
        flex items-center gap-1 px-2 py-1.5 rounded-lg min-w-[70px] min-h-[44px]
        bg-[#1a1a2e] border border-[#14F195]/30
        ${disabled || count === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#252547] active:scale-95'}
        transition-all shadow-sm touch-manipulation
      `}
    >
      <span className="text-sm" role="img" aria-label={type}>
        {POWER_UP_ICONS[type]}
      </span>
      <div className="text-[#14F195] text-xs font-bold">
        {POWER_UP_LABELS[type]}
      </div>
      <span className="text-xs font-bold text-white ml-auto">
        {count}
      </span>
    </button>
  )
} 