'use client'

import { useState } from 'react'
import { TagChip } from '@/components/ui/tag-chip'
import { TimelineCard } from '@/components/timeline/timeline-card'
import { EmptyState } from '@/components/ui/empty-state'
import { PhotoDetailModal } from '@/components/timeline/photo-detail-modal'
import type { GrowthRecord } from '@/lib/types/growth-record'

interface TimelineViewProps {
  records: GrowthRecord[]
  allTags: string[]
}

function getYearMonth(dateStr: string): string {
  const [year, month] = dateStr.split('-').map(Number)
  return `${year}년 ${month}월`
}

export function TimelineView({ records, allTags }: TimelineViewProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedRecord, setSelectedRecord] = useState<GrowthRecord | null>(
    null
  )

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  function clearTags() {
    setSelectedTags([])
  }

  const filteredRecords =
    selectedTags.length === 0
      ? records
      : records.filter(r => r.tags.some(t => selectedTags.includes(t)))

  // Track year-month changes for group headers
  const renderedYearMonths = new Set<string>()

  return (
    <div>
      {/* 태그 필터 영역 */}
      <div
        role="group"
        aria-label="태그 필터"
        className="mt-6 flex flex-wrap gap-2"
      >
        <TagChip
          name="전체 보기"
          selected={selectedTags.length === 0}
          onClick={clearTags}
        />
        {allTags.map(tag => (
          <TagChip
            key={tag}
            name={tag}
            selected={selectedTags.includes(tag)}
            onClick={() => toggleTag(tag)}
          />
        ))}
      </div>

      {/* 타임라인 영역 */}
      <div className="mt-8">
        {filteredRecords.length === 0 ? (
          <EmptyState
            title="기록이 없어요"
            description="선택한 태그에 해당하는 기록이 없습니다."
          />
        ) : (
          <ul role="list" className="relative">
            {/* 세로선 */}
            <div
              aria-hidden="true"
              className="bg-border absolute top-0 bottom-0 left-4 w-px"
            />

            {filteredRecords.map((record, index) => {
              const yearMonth = getYearMonth(record.date)
              const showHeader = !renderedYearMonths.has(yearMonth)
              if (showHeader) renderedYearMonths.add(yearMonth)

              return (
                <li key={record.id} role="listitem">
                  {/* 날짜 그룹 헤더 */}
                  {showHeader && (
                    <div className="relative mb-4 flex items-center pl-12">
                      <span className="text-muted-foreground text-xs font-medium">
                        {yearMonth}
                      </span>
                    </div>
                  )}

                  {/* 카드 행 */}
                  <div
                    className="animate-in fade-in relative mb-8 pl-12 duration-500"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    {/* 타임라인 점 */}
                    <div
                      aria-hidden="true"
                      className="border-primary bg-background absolute top-6 left-[0.8125rem] h-2.5 w-2.5 rounded-full border-2"
                    />

                    {/* 카드 */}
                    <div className="mx-auto max-w-xl">
                      <TimelineCard
                        record={record}
                        onClick={() => setSelectedRecord(record)}
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <PhotoDetailModal
        record={selectedRecord}
        open={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  )
}
