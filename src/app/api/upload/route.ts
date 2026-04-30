import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { writeFile } from 'fs/promises'
import path from 'path'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json(
      { error: '이미지 파일만 업로드할 수 있습니다' },
      { status: 400 }
    )
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: '파일 크기는 5MB 이하여야 합니다' },
      { status: 400 }
    )
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`aitime/${Date.now()}-${file.name}`, file, {
      access: 'public',
    })
    return NextResponse.json({ url: blob.url })
  }

  // 로컬 개발 환경: public/uploads/ 에 저장
  const ext = path.extname(file.name) || '.jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(
    path.join(process.cwd(), 'public', 'uploads', filename),
    buffer
  )
  return NextResponse.json({ url: `/uploads/${filename}` })
}
