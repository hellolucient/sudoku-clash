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
  steal: '🫳',
  skip: '⏭️'
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
        flex items-center gap-1 px-2 py-1 rounded-lg min-w-[80px]
        bg-[#F9EED7]/90 border border-[#8C653C]
        ${disabled || count === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F5DFB3]'}
        transition-all
      `}
    >
      <div className="flex items-center gap-1 flex-1">
        <span className="text-sm" role="img" aria-label={type}>
          {POWER_UP_ICONS[type]}
        </span>
        <div className="text-[#2196F3] text-xs font-bold">
          {POWER_UP_LABELS[type]}
        </div>
      </div>
      <span className="text-sm font-bold text-[#4B3418]">
        {count}
      </span>
    </button>
  )
} 