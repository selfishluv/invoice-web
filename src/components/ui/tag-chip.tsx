import { cn } from '@/lib/utils'
import { DEFAULT_TAG_COLOR } from '@/lib/types/tag'

interface TagChipProps {
  name: string
  selected?: boolean
  onClick?: () => void
  className?: string
  colorMap?: Record<string, string>
}

export function TagChip({
  name,
  selected = false,
  onClick,
  className,
  colorMap,
}: TagChipProps) {
  const colorClass = colorMap?.[name] ?? DEFAULT_TAG_COLOR

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
