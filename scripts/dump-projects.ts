import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
  const all = await prisma.projectEntry.findMany({
    select: { slug: true, name: true, source: true, featured: true, priority: true, visible: true, tech: true, badges: true },
    orderBy: [{ featured: 'desc' }, { priority: 'asc' }],
  })
  console.log(JSON.stringify(all, null, 2))
}

main().then(async () => { await prisma.$disconnect(); process.exit(0) })
