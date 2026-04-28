import { prisma } from '@/lib/db/client'
import type { GrowthRecord, TimelineSummary } from '@/lib/types/growth-record'

function mapRecord(row: {
  id: string
  title: string
  date: Date
  memo: string
  photoUrl: string | null
  tags: string[]
  ageMonths: number | null
}): GrowthRecord {
  return {
    id: row.id,
    title: row.title,
    date: row.date.toISOString().split('T')[0],
    memo: row.memo,
    photoUrl: row.photoUrl,
    tags: row.tags,
    ageMonths: row.ageMonths,
  }
}

export async function fetchGrowthRecords(): Promise<GrowthRecord[]> {
  const rows = await prisma.growthRecord.findMany({
    orderBy: { date: 'desc' },
  })
  return rows.map(mapRecord)
}

export async function fetchRecordById(
  id: string
): Promise<GrowthRecord | null> {
  const row = await prisma.growthRecord.findUnique({ where: { id } })
  return row ? mapRecord(row) : null
}

export async function fetchTimelineSummary(
  growthRecords: GrowthRecord[]
): Promise<TimelineSummary> {
  const latestRecord = growthRecords[0] ?? null
  const sorted = [...growthRecords].sort((a, b) => a.date.localeCompare(b.date))
  return {
    totalCount: growthRecords.length,
    firstEventDate: sorted[0]?.date ?? null,
    latestRecord,
  }
}
