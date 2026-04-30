import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchRecordById, fetchTags } from '@/lib/db/queries'
import { RecordForm } from '@/components/admin/record-form'

interface EditRecordPageProps {
  params: Promise<{ id: string }>
}

export default async function EditRecordPage({ params }: EditRecordPageProps) {
  const { id } = await params
  const [record, tags] = await Promise.all([fetchRecordById(id), fetchTags()])

  if (!record) notFound()

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          ← 목록으로
        </Link>
        <h1 className="mt-2 text-xl font-semibold">기록 수정</h1>
      </div>
      <RecordForm
        mode="edit"
        defaultValues={record}
        availableTags={tags.map(t => t.name)}
      />
    </div>
  )
}
