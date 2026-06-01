import { NextRequest, NextResponse } from 'next/server'

// Public, unauthenticated GitHub contributions calendar. No token required.
// Returns the real contribution counts for the last year, cached server-side.
const UPSTREAM_TIMEOUT_MS = 8000

type UpstreamDay = { date: string; count: number; level: number }
type UpstreamResponse = {
  total?: Record<string, number>
  contributions?: UpstreamDay[]
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username') || 'kianis4'
  const url = `https://github-contributions-api.jogruber.de/v4/${username}?y=last`

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      next: { revalidate: 3600, tags: ['github-contributions'] },
    })
    if (!response.ok) {
      return NextResponse.json({ error: 'upstream' }, { status: 502 })
    }

    const data = (await response.json()) as UpstreamResponse
    const days = data.contributions ?? []
    const total = days.reduce((sum, d) => sum + (d.count || 0), 0)

    return NextResponse.json(
      { username, total, days },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch {
    return NextResponse.json({ error: 'fetch-failed' }, { status: 502 })
  }
}
