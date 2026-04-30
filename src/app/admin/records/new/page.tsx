import Link from 'next/link'
import { fetchTags } from '@/lib/db/queries'
import { RecordForm } from '@/components/admin/record-form'

export default async function NewRecordPage() {
  const tags = await fetchTags()

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          ← 목록으로
        </Link>
        <h1 className="mt-2 text-xl font-semibold">새 기록 추가</h1>
      </div>
      <RecordForm mode="create" availableTags={tags.map(t => t.name)} />
    </div>
  )
}
