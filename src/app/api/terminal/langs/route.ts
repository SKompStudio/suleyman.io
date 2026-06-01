import { NextResponse } from 'next/server'

import { getLanguageStats } from '@/lib/github'

// GitHub language footprint for the terminal `langs` / `stack` commands.
// getLanguageStats already 6h fetch-caches internally; cache the route too.
export const revalidate = 21600

export async function GET() {
  try {
    const langs = await getLanguageStats({ topN: 8 })
    const totalRepos = langs.reduce((m, l) => Math.max(m, l.repoCount), 0)
    return NextResponse.json(
      { langs, totalRepos },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=21600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('[terminal/langs]', error)
    return NextResponse.json({ langs: [], totalRepos: 0 }, { status: 502 })
  }
}
