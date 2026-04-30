'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createTagAction, updateTagAction } from '@/lib/actions/tag-actions'
import type { Tag } from '@/lib/types/tag'
import { cn } from '@/lib/utils'

const COLOR_OPTIONS = [
  { label: '분홍', value: 'bg-pink-100 text-pink-800 hover:bg-pink-200' },
  { label: '보라', value: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
  { label: '파랑', value: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
  { label: '노랑', value: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
  { label: '초록', value: 'bg-green-100 text-green-800 hover:bg-green-200' },
  { label: '주황', value: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
  { label: '빨강', value: 'bg-red-100 text-red-800 hover:bg-red-200' },
  { label: '청록', value: 'bg-teal-100 text-teal-800 hover:bg-teal-200' },
  {
    label: '인디고',
    value: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
  },
]

const tagFormSchema = z.object({
  name: z.string().min(1, '태그 이름을 입력해주세요'),
  color: z.string().min(1, '색상을 선택해주세요'),
})
type TagFormData = z.infer<typeof tagFormSchema>

interface TagFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Tag
}

export function TagForm({ mode, defaultValues }: TagFormProps) {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: defaultValues
      ? { name: defaultValues.name, color: defaultValues.color }
      : { name: '', color: COLOR_OPTIONS[0].value },
  })

  const selectedColor = watch('color')

  function onSubmit(data: TagFormData) {
    startTransition(async () => {
      if (mode === 'create') {
        await createTagAction(data)
      } else {
        await updateTagAction(defaultValues!.id, data)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm space-y-4">
      <div className="space-y-1">
        <Label htmlFor="tag-name">태그 이름 *</Label>
        <Input id="tag-name" placeholder="예: 첫걸음" {...register('name')} />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>색상 *</Label>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue('color', opt.value)}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium transition-all',
                opt.value,
                selectedColor === opt.value &&
                  'ring-2 ring-current ring-offset-1'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input type="hidden" {...register('color')} />
        {errors.color && (
          <p className="text-destructive text-sm">{errors.color.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? '저장 중...'
            : mode === 'create'
              ? '태그 추가'
              : '수정 저장'}
        </Button>
      </div>
    </form>
  )
}
