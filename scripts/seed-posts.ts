import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { prisma } from '../src/lib/prisma'
import { parseMdxArticle } from '../src/lib/mdxToPost'

const ARTICLES_DIR = path.resolve(process.cwd(), 'src/content/articles')

async function main() {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'))

  let seeded = 0
  for (const file of files) {
    const filepath = path.join(ARTICLES_DIR, file)
    const source = fs.readFileSync(filepath, 'utf8')
    const base = file.replace(/\.mdx$/, '')
    const parsed = parseMdxArticle(source, base)

    await prisma.post.upsert({
      where: { slug: parsed.slug },
      update: {
        title: parsed.title,
        description: parsed.description,
        body: parsed.body,
        author: parsed.author,
        status: 'PUBLISHED',
        publishedAt: new Date(parsed.date),
      },
      create: {
        slug: parsed.slug,
        title: parsed.title,
        description: parsed.description,
        body: parsed.body,
        author: parsed.author,
        status: 'PUBLISHED',
        publishedAt: new Date(parsed.date),
      },
    })

    seeded++
    console.log(`  ✓ ${parsed.slug}`)
  }

  console.log(`\n✓ Seeded ${seeded} posts from ${ARTICLES_DIR}`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
