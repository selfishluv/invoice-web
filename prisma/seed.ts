import 'dotenv/config'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db/client'

const INITIAL_TAGS = [
  { name: '첫걸음', color: 'bg-pink-100 text-pink-800 hover:bg-pink-200' },
  { name: '첫말', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
  { name: '첫니', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
  { name: '생일', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
  { name: '병원', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
  { name: '여행', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
]

async function main() {
  const passwordHash = await hash('admin1234', 12)
  await prisma.user.upsert({
    where: { email: 'admin@aitime.app' },
    update: {},
    create: { email: 'admin@aitime.app', passwordHash },
  })
  console.log('✅ Admin user seeded: admin@aitime.app / admin1234')

  for (const tag of INITIAL_TAGS) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: { color: tag.color },
      create: tag,
    })
  }
  console.log(`✅ ${INITIAL_TAGS.length} tags seeded`)
}

main().finally(() => prisma.$disconnect())
