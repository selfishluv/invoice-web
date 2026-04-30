'use client'

import { useTransition } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { recordSchema, type RecordFormData } from '@/lib/schemas/record'
import { createRecord, updateRecord } from '@/lib/actions/record-actions'
import type { GrowthRecord } from '@/lib/types/growth-record'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/admin/image-upload'
import { cn } from '@/lib/utils'

interface RecordFormProps {
  mode: 'create' | 'edit'
  defaultValues?: GrowthRecord
  availableTags: string[]
}

export function RecordForm({
  mode,
  defaultValues,
  availableTags,
}: RecordFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RecordFormData>({
    resolver: zodResolver(recordSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          date: defaultValues.date,
          tags: defaultValues.tags,
          memo: defaultValues.memo,
          ageMonths: defaultValues.ageMonths ?? undefined,
          photoUrl: defaultValues.photoUrl ?? '',
        }
      : { tags: [], memo: '', photoUrl: '' },
  })

  function onSubmit(data: RecordFormData) {
    startTransition(async () => {
      const payload = {
        ...data,
        photoUrl: data.photoUrl === '' ? null : data.photoUrl,
      }
      if (mode === 'create') {
        await createRecord(payload)
      } else {
        await updateRecord(defaultValues!.id, payload)
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="max-w-lg space-y-6"
    >
      <div className="space-y-1">
        <Label htmlFor="title">제목 *</Label>
        <Input id="title" placeholder="예: 첫 걸음마" {...register('title')} />
        {errors.title && (
          <p className="text-destructive text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="date">날짜 *</Label>
        <Input id="date" type="date" {...register('date')} />
        {errors.date && (
          <p className="text-destructive text-sm">{errors.date.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>태그</Label>
        <div className="flex flex-wrap gap-4">
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <>
                {availableTags.map(tag => (
                  <div key={tag} className="flex items-center gap-1.5">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={field.value.includes(tag)}
                      onCheckedChange={checked => {
                        if (checked) {
                          field.onChange([...field.value, tag])
                        } else {
                          field.onChange(field.value.filter(t => t !== tag))
                        }
                      }}
                    />
                    <Label
                      htmlFor={`tag-${tag}`}
                      className="cursor-pointer font-normal"
                    >
                      {tag}
                    </Label>
                  </div>
                ))}
              </>
            )}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="memo">메모</Label>
        <textarea
          id="memo"
          rows={4}
          placeholder="기록에 남기고 싶은 내용을 자유롭게 적어주세요"
          {...register('memo')}
          className={cn(
            'border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
          )}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="ageMonths">개월 수</Label>
        <Input
          id="ageMonths"
          type="number"
          min={0}
          placeholder="예: 12"
          {...register('ageMonths', {
            setValueAs: v => (v === '' ? null : parseInt(v, 10)),
          })}
        />
      </div>

      <div className="space-y-1">
        <Label>사진</Label>
        <Controller
          name="photoUrl"
          control={control}
          render={({ field }) => (
            <ImageUpload value={field.value ?? ''} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? '저장 중...'
            : mode === 'create'
              ? '기록 추가'
              : '수정 저장'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin')}
          disabled={isPending}
        >
          취소
        </Button>
      </div>
    </form>
  )
}
