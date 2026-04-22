import { Feed } from 'feed'

import { getAllArticles } from './getAllArticles'

export interface BuiltFeed {
  xml: string
  json: string
}

export async function buildRssFeed(): Promise<BuiltFeed> {
  const articles = await getAllArticles()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://suleyman.io'
  const author = {
    name: 'Suleyman Kiani',
    email: 'suley.kiani@outlook.com',
    link: siteUrl,
  }

  const feed = new Feed({
    title: author.name,
    description: 'Suleyman Kiani - Software Engineer & Finance',
    author,
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/rss/feed.xml`,
      json: `${siteUrl}/rss/feed.json`,
    },
  })

  for (const article of articles) {
    const url = `${siteUrl}/articles/${article.slug}`
    const html = article.description || ''

    feed.addItem({
      title: article.title,
      id: url,
      link: url,
      description: article.description,
      content: html,
      author: [author],
      contributor: [author],
      date: new Date(article.date),
    })
  }

  return { xml: feed.rss2(), json: feed.json1() }
}
