'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import {
  createGrowthRecord,
  updateGrowthRecord,
  deleteGrowthRecord,
} from '@/lib/db/queries'
import { recordSchema, type RecordFormData } from '@/lib/schemas/record'

export async function createRecord(data: RecordFormData) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  const parsed = recordSchema.parse(data)
  await createGrowthRecord({
    title: parsed.title,
    date: parsed.date,
    tags: parsed.tags,
    memo: parsed.memo,
    ageMonths: parsed.ageMonths ?? null,
    photoUrl: parsed.photoUrl ?? null,
  })
  revalidatePath('/')
  redirect('/admin')
}

export async function updateRecord(id: string, data: RecordFormData) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  const parsed = recordSchema.parse(data)
  await updateGrowthRecord(id, {
    title: parsed.title,
    date: parsed.date,
    tags: parsed.tags,
    memo: parsed.memo,
    ageMonths: parsed.ageMonths ?? null,
    photoUrl: parsed.photoUrl ?? null,
  })
  revalidatePath('/')
  redirect('/admin')
}

export async function deleteRecord(id: string) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  await deleteGrowthRecord(id)
  revalidatePath('/')
}
