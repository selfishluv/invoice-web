import Link from 'next/link'
import { fetchTags } from '@/lib/db/queries'
import { Button } from '@/components/ui/button'
import { TagForm } from '@/components/admin/tag-form'
import { DeleteTagButton } from '@/components/admin/delete-tag-button'
import { cn } from '@/lib/utils'

export default async function AdminTagsPage() {
  const tags = await fetchTags()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">태그 관리</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">← 기록 관리</Link>
        </Button>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-sm font-medium">새 태그 추가</h2>
          <TagForm mode="create" />
        </div>

        <div>
          <h2 className="mb-4 text-sm font-medium">태그 목록</h2>
          {tags.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              등록된 태그가 없습니다.
            </p>
          ) : (
            <ul className="space-y-2">
              {tags.map(tag => (
                <li key={tag.id} className="flex items-center gap-3">
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-sm font-medium',
                      tag.color
                    )}
                  >
                    {tag.name}
                  </span>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/tags/${tag.id}/edit`}>수정</Link>
                  </Button>
                  <DeleteTagButton id={tag.id} name={tag.name} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
