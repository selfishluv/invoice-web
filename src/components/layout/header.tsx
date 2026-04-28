import Link from 'next/link'
import { Container } from '@/components/layout/container'

export function Header() {
  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <Container size="md">
        <div className="flex h-14 items-center">
          <Link
            href="/"
            className="text-foreground flex items-center gap-2 font-semibold transition-opacity hover:opacity-80"
          >
            <span className="text-lg">아이타임</span>
            <span className="text-muted-foreground text-sm font-normal">
              AiTime
            </span>
          </Link>
        </div>
      </Container>
    </header>
  )
}
