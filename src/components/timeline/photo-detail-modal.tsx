import { cn } from '@/lib/utils'
import { SafeImage } from '@/components/ui/safe-image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TAG_COLORS, DEFAULT_TAG_COLOR } from '@/lib/types/tag'
import type { GrowthRecord } from '@/lib/types/growth-record'

interface PhotoDetailModalProps {
  record: GrowthRecord | null
  open: boolean
  onClose: () => void
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return `${year}년 ${month}월 ${day}일`
}

export function PhotoDetailModal({
  record,
  open,
  onClose,
}: PhotoDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent
        className={cn(
          'overflow-hidden p-0',
          'max-h-[90vh] w-[calc(100vw-2rem)]',
          'sm:max-h-[85vh] sm:max-w-lg',
          'flex flex-col'
        )}
      >
        {/* 사진 영역 */}
        <div className="relative aspect-[4/3] w-full shrink-0">
          <SafeImage
            src={record?.photoUrl ?? null}
            alt={record?.title ?? '사진'}
            fill
            sizes="(max-width: 640px) calc(100vw - 2rem), 512px"
            className="rounded-t-lg"
          />
        </div>

        {/* 정보 영역 */}
        <div className="flex flex-col gap-3 overflow-y-auto p-5">
          <DialogHeader>
            <DialogTitle className="text-lg leading-snug font-bold">
              {record?.title}
            </DialogTitle>
          </DialogHeader>

          {/* 날짜 + 개월수 */}
          <p className="text-muted-foreground text-sm">
            {record ? formatDate(record.date) : ''}
            {record?.ageMonths != null && ` · ${record.ageMonths}개월`}
          </p>

          {/* 태그 */}
          {record && record.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {record.tags.map(tag => (
                <span
                  key={tag}
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs',
                    TAG_COLORS[tag] ?? DEFAULT_TAG_COLOR
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 구분선 */}
          <div className="border-t" />

          {/* 메모 */}
          <p className="text-sm whitespace-pre-line">
            {record?.memo ? record.memo : '메모가 없습니다.'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
