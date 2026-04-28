import { cn } from '@/lib/utils'
import { DEFAULT_TAG_COLOR, TAG_COLORS } from '@/lib/types/tag'

interface TagChipProps {
  name: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function TagChip({
  name,
  selected = false,
  onClick,
  className,
}: TagChipProps) {
  const colorClass = TAG_COLORS[name] ?? DEFAULT_TAG_COLOR

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors',
        colorClass,
        selected && 'ring-2 ring-current ring-offset-1',
        className
      )}
    >
      {name}
    </button>
  )
}
