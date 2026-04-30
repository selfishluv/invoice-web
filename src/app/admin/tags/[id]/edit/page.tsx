import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db/client'
import { TagForm } from '@/components/admin/tag-form'

interface EditTagPageProps {
  params: Promise<{ id: string }>
}

export default async function EditTagPage({ params }: EditTagPageProps) {
  const { id } = await params
  const tag = await prisma.tag.findUnique({ where: { id } })

  if (!tag) notFound()

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/tags"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          ← 태그 관리
        </Link>
        <h1 className="mt-2 text-xl font-semibold">태그 수정</h1>
      </div>
      <TagForm mode="edit" defaultValues={tag} />
    </div>
  )
}
