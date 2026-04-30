export interface Tag {
  id: string
  name: string
  color: string
}

export const DEFAULT_TAG_COLOR =
  'bg-muted text-muted-foreground hover:bg-muted/80'

export function buildTagColorMap(tags: Tag[]): Record<string, string> {
  return Object.fromEntries(tags.map(t => [t.name, t.color]))
}
