import { NextResponse } from 'next/server'

import { fetchRecentCommits } from '@/lib/github'

// Recent public commits for the terminal `git log` command. Real PushEvent data
// flattened to { sha7, message, repo, ageRelative }, CDN-cached.
export const revalidate = 900

export async function GET() {
  try {
    const commits = await fetchRecentCommits(8)
    return NextResponse.json(
      { commits },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=900, stale-while-revalidate=3600',
        },
      }
    )
  } catch (error) {
    console.error('[git-log]', error)
    return NextResponse.json({ commits: [] }, { status: 502 })
  }
}
