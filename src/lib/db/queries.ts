import { prisma } from '@/lib/db/client'
import type { GrowthRecord, TimelineSummary } from '@/lib/types/growth-record'
import type { Tag } from '@/lib/types/tag'

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

export async function deleteGrowthRecord(id: string): Promise<void> {
  await prisma.growthRecord.delete({ where: { id } })
}

export async function fetchAllGrowthRecordsForAdmin(): Promise<GrowthRecord[]> {
  const rows = await prisma.growthRecord.findMany({
    orderBy: { date: 'desc' },
  })
  return rows.map(mapRecord)
}

export async function createGrowthRecord(
  data: Omit<GrowthRecord, 'id'>
): Promise<GrowthRecord> {
  const row = await prisma.growthRecord.create({
    data: {
      title: data.title,
      date: new Date(data.date),
      memo: data.memo,
      photoUrl: data.photoUrl ?? null,
      tags: data.tags,
      ageMonths: data.ageMonths ?? null,
    },
  })
  return mapRecord(row)
}

export async function updateGrowthRecord(
  id: string,
  data: Partial<Omit<GrowthRecord, 'id'>>
): Promise<GrowthRecord> {
  const row = await prisma.growthRecord.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.memo !== undefined && { memo: data.memo }),
      ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl }),
      ...(data.tags !== undefined && { tags: data.tags }),
      ...(data.ageMonths !== undefined && { ageMonths: data.ageMonths }),
    },
  })
  return mapRecord(row)
}

function mapTag(row: { id: string; name: string; color: string }): Tag {
  return { id: row.id, name: row.name, color: row.color }
}

export async function fetchTags(): Promise<Tag[]> {
  const rows = await prisma.tag.findMany({ orderBy: { createdAt: 'asc' } })
  return rows.map(mapTag)
}

export async function createTag(data: {
  name: string
  color: string
}): Promise<Tag> {
  const row = await prisma.tag.create({ data })
  return mapTag(row)
}

export async function updateTag(
  id: string,
  data: { name?: string; color?: string }
): Promise<Tag> {
  const row = await prisma.tag.update({ where: { id }, data })
  return mapTag(row)
}

export async function deleteTag(id: string): Promise<void> {
  await prisma.tag.delete({ where: { id } })
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
