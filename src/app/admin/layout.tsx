import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/auth'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="border-border border-b">
        <Container size="md">
          <div className="flex h-10 items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">
                {session.user?.email}
              </span>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/tags">태그 관리</Link>
              </Button>
            </div>
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/login' })
              }}
            >
              <Button variant="ghost" size="sm" type="submit">
                로그아웃
              </Button>
            </form>
          </div>
        </Container>
      </div>
      <Container size="md" className="py-8">
        {children}
      </Container>
    </div>
  )
}
