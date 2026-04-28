import type { TimelineSummary } from '@/lib/types/growth-record'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  const [year, month, day] = dateStr.split('-').map(Number)
  return `${year}년 ${month}월 ${day}일`
}

interface StatsCardProps {
  summary: TimelineSummary
}

export function StatsCard({ summary }: StatsCardProps) {
  const stats = [
    {
      label: '총 기록 수',
      value: `${summary.totalCount}개`,
    },
    {
      label: '첫 이벤트 날짜',
      value: formatDate(summary.firstEventDate),
    },
    {
      label: '최근 기록',
      value: summary.latestRecord?.title ?? '-',
    },
  ]

  return (
    <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
      <div className="grid grid-cols-3 divide-x">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-1 px-4 py-5 text-center"
          >
            <span className="text-muted-foreground text-xs">{stat.label}</span>
            <span className="text-foreground line-clamp-1 text-sm font-semibold">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
