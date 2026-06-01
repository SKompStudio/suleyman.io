import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/deals'],
    },
    sitemap: 'https://www.suleyman.io/sitemap.xml',
    host: 'www.suleyman.io',
  }
}
