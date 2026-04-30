import { Container } from '@/components/layout/container'
import { StatsCard } from '@/components/timeline/stats-card'
import { TimelineView } from '@/components/timeline/timeline-view'
import {
  fetchGrowthRecords,
  fetchTimelineSummary,
  fetchTags,
} from '@/lib/db/queries'
import { buildTagColorMap } from '@/lib/types/tag'

export const revalidate = 3600

export default async function TimelinePage() {
  const [records, tags] = await Promise.all([fetchGrowthRecords(), fetchTags()])
  const summary = await fetchTimelineSummary(records)
  const tagColorMap = buildTagColorMap(tags)

  const allTags = tags
    .filter(t => records.some(r => r.tags.includes(t.name)))
    .map(t => t.name)

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <Container size="sm" className="py-8">
        <StatsCard summary={summary} />
        <TimelineView
          records={records}
          allTags={allTags}
          tagColorMap={tagColorMap}
        />
      </Container>
    </div>
  )
}
