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

export default function PowerUpButton({ type, count, disabled = false, onClick }: PowerUpButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || count === 0}
      className={`
        flex items-center gap-1 px-2 py-1 rounded-lg
        bg-[#F9EED7]/90 border border-[#8C653C]
        ${disabled || count === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F5DFB3]'}
        transition-all
      `}
    >
      <span className="text-sm" role="img" aria-label={type}>
        {POWER_UP_ICONS[type]}
      </span>
      <span className={`text-sm font-bold text-[#4B3418]`}>
        {count}
      </span>
    </button>
  )
} 