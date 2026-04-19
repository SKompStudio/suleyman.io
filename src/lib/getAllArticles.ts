import { prisma } from '@/lib/prisma'

export interface ArticleMeta {
  title: string
  description: string
  date: string
  slug: string
  author: string
  coverImage: string | null
  tags: string[]
  body?: string
  isRssFeed?: boolean
}

function toIsoDate(value: Date | string | null): string {
  if (!value) return new Date().toISOString().slice(0, 10)
  if (typeof value === 'string') return value.slice(0, 10)
  return value.toISOString().slice(0, 10)
}

export async function getAllArticles(): Promise<ArticleMeta[]> {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
  })

  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: toIsoDate(p.publishedAt),
    author: p.author,
    coverImage: p.coverImage,
    tags: p.tags,
    body: p.body,
  }))
}

export async function getArticle(slug: string): Promise<ArticleMeta | null> {
  const p = await prisma.post.findFirst({
    where: { slug, status: 'PUBLISHED' },
  })
  if (!p) return null
  return {
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: toIsoDate(p.publishedAt),
    author: p.author,
    coverImage: p.coverImage,
    tags: p.tags,
    body: p.body,
  }
}
