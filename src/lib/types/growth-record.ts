export interface GrowthRecord {
  id: string
  title: string
  date: string
  photoUrl: string | null
  tags: string[]
  memo: string
  ageMonths: number | null
}

export interface TimelineSummary {
  totalCount: number
  firstEventDate: string | null
  latestRecord: GrowthRecord | null
}
