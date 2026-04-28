import { Skeleton } from '@/components/ui/skeleton'

interface TimelineSkeletonProps {
  count?: number
}

function TimelineCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border shadow-sm">
      <Skeleton className="aspect-[4/3] w-full rounded-t-xl rounded-b-none" />
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-5 w-10 rounded-md" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    </div>
  )
}

export function TimelineSkeleton({ count = 3 }: TimelineSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <TimelineCardSkeleton key={i} />
      ))}
    </div>
  )
}
