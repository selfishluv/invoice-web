import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <Container
      size="sm"
      className="flex min-h-screen flex-col items-center justify-center gap-6 py-20 text-center"
    >
      <div className="space-y-2">
        <h1 className="text-foreground text-6xl font-bold">404</h1>
        <p className="text-foreground text-xl font-medium">
          페이지를 찾을 수 없습니다
        </p>
        <p className="text-muted-foreground">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
      </div>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </Container>
  )
}
