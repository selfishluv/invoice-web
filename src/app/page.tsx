import { Container } from '@/components/layout/container'
import { StatsCard } from '@/components/timeline/stats-card'
import { TimelineView } from '@/components/timeline/timeline-view'
import { fetchGrowthRecords, fetchTimelineSummary } from '@/lib/db/queries'
import { TAG_COLORS } from '@/lib/types/tag'

export const revalidate = 3600

export default async function TimelinePage() {
  const records = await fetchGrowthRecords()
  const summary = await fetchTimelineSummary(records)

  const allTags = Object.keys(TAG_COLORS).filter(tag =>
    records.some(r => r.tags.includes(tag))
  )

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <Container size="sm" className="py-8">
        <StatsCard summary={summary} />
        <TimelineView records={records} allTags={allTags} />
      </Container>
    </div>
  )
}
