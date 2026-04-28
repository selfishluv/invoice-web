export const TAG_COLORS: Record<string, string> = {
  첫걸음: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
  첫말: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  첫니: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  생일: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  병원: 'bg-green-100 text-green-800 hover:bg-green-200',
  여행: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
}

export const DEFAULT_TAG_COLOR =
  'bg-muted text-muted-foreground hover:bg-muted/80'

export type TagName = keyof typeof TAG_COLORS
