import { Badge } from '@/components/ui/badge'
import { SafeImage } from '@/components/ui/safe-image'
import { cn } from '@/lib/utils'
import type { GrowthRecord } from '@/lib/types/growth-record'

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return `${year}년 ${month}월 ${day}일`
}

interface TimelineCardProps {
  record: GrowthRecord
  onClick: () => void
  className?: string
  priority?: boolean
}

export function TimelineCard({
  record,
  onClick,
  className,
  priority = false,
}: TimelineCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onClick()
      }}
      className={cn(
        'bg-card text-card-foreground cursor-pointer rounded-xl border shadow-sm transition-all hover:scale-[1.01] hover:shadow-md',
        className
      )}
    >
      <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden rounded-t-xl">
        <SafeImage
          src={record.photoUrl}
          alt={record.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 560px, 576px"
          priority={priority}
          className="rounded-t-xl"
        />
      </div>

      <div className="p-4">
        <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
          <span>{formatDate(record.date)}</span>
          {record.ageMonths !== null && (
            <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
              {record.ageMonths}개월
            </span>
          )}
        </div>

        <p className="text-foreground mb-2 leading-snug font-semibold">
          {record.title}
        </p>

        {record.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {record.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {record.memo && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {record.memo}
          </p>
        )}
      </div>
    </div>
  )
}
