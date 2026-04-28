'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface SafeImageProps {
  src: string | null
  alt: string
  className?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
}

export function SafeImage({
  src,
  alt,
  className,
  fill = false,
  sizes,
  priority = false,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return <div className={cn('bg-muted', className)} aria-label={alt} />
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={cn('object-cover', className)}
      onError={() => setHasError(true)}
    />
  )
}
