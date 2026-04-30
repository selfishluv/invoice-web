import { z } from 'zod'

export const recordSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  date: z
    .string()
    .min(1, '날짜를 선택해주세요')
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다'),
  tags: z.array(z.string()),
  memo: z.string(),
  ageMonths: z.number().int().nonnegative().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
})

export type RecordFormData = z.infer<typeof recordSchema>
