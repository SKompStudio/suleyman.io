import { buildRssFeed } from '@/lib/generateRssFeed'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { xml } = await buildRssFeed()
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
    },
  })
}
