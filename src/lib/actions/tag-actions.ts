'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { auth } from '@/auth'
import { createTag, updateTag, deleteTag } from '@/lib/db/queries'

const tagSchema = z.object({
  name: z.string().min(1, '태그 이름을 입력해주세요'),
  color: z.string().min(1, '색상을 선택해주세요'),
})

export async function createTagAction(data: { name: string; color: string }) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  const parsed = tagSchema.parse(data)
  await createTag(parsed)
  revalidatePath('/')
  revalidatePath('/admin/tags')
  redirect('/admin/tags')
}

export async function updateTagAction(
  id: string,
  data: { name: string; color: string }
) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  const parsed = tagSchema.parse(data)
  await updateTag(id, parsed)
  revalidatePath('/')
  revalidatePath('/admin/tags')
  redirect('/admin/tags')
}

export async function deleteTagAction(id: string) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  await deleteTag(id)
  revalidatePath('/')
  revalidatePath('/admin/tags')
}
