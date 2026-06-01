import type { MetadataRoute } from 'next'

import { getAllArticles } from '@/lib/getAllArticles'

const BASE = 'https://www.suleyman.io'

const STATIC_ROUTES = [
  '/',
  '/about',
  '/projects',
  '/architecture',
  '/resume',
  '/articles',
  '/spotify',
  '/insta',
  '/leetcode',
  '/uses',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
  }))

  let articleEntries: MetadataRoute.Sitemap = []
  try {
    const articles = await getAllArticles()
    articleEntries = articles.map((a) => ({
      url: `${BASE}/articles/${a.slug}`,
      lastModified: a.date ? new Date(a.date) : now,
    }))
  } catch {
    articleEntries = []
  }

  return [...staticEntries, ...articleEntries]
}
