import { buildRssFeed } from '@/lib/generateRssFeed'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { json } = await buildRssFeed()
  return new Response(json, {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
    },
  })
}
