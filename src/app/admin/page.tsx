import Link from 'next/link'
import { fetchAllGrowthRecordsForAdmin } from '@/lib/db/queries'
import { Button } from '@/components/ui/button'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'

export default async function AdminPage() {
  const records = await fetchAllGrowthRecordsForAdmin()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">성장 기록 관리</h1>
        <Button asChild>
          <Link href="/admin/records/new">+ 새 기록 추가</Link>
        </Button>
      </div>

      {records.length === 0 ? (
        <p className="text-muted-foreground text-sm">등록된 기록이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b">
                <th className="py-2 pr-4 text-left font-medium">날짜</th>
                <th className="py-2 pr-4 text-left font-medium">제목</th>
                <th className="py-2 pr-4 text-left font-medium">태그</th>
                <th className="py-2 text-left font-medium">작업</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr
                  key={record.id}
                  className="border-border hover:bg-muted/40 border-b transition-colors"
                >
                  <td className="py-2 pr-4 tabular-nums">{record.date}</td>
                  <td className="py-2 pr-4">{record.title}</td>
                  <td className="text-muted-foreground py-2 pr-4">
                    {record.tags.join(', ') || '—'}
                  </td>
                  <td className="flex items-center gap-1 py-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/records/${record.id}/edit`}>
                        수정
                      </Link>
                    </Button>
                    <DeleteConfirmDialog id={record.id} title={record.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
