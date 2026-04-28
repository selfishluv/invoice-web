'use client'

import { useEffect } from 'react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container
      size="sm"
      className="flex min-h-screen flex-col items-center justify-center gap-6 py-20 text-center"
    >
      <div className="space-y-2">
        <h2 className="text-foreground text-2xl font-bold">
          오류가 발생했습니다
        </h2>
        <p className="text-muted-foreground">
          데이터를 불러오는 중 문제가 발생했습니다.
        </p>
        {error.digest && (
          <p className="text-muted-foreground text-xs">
            오류 코드: {error.digest}
          </p>
        )}
      </div>
      <Button onClick={reset}>다시 시도</Button>
    </Container>
  )
}
