import { NextRequest, NextResponse } from 'next/server'

const UPSTREAM_TIMEOUT_MS = 8000
const MAX_ATTEMPTS = 3

async function fetchUpstream(url: string): Promise<Response> {
  let lastError: unknown
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        next: { revalidate: 300, tags: ['leetcode'] },
      })
      if (response.ok) return response
      lastError = new Error(`Upstream ${response.status}`)
    } catch (error) {
      lastError = error
    }
    if (attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, 250 * attempt))
    }
  }
  throw lastError ?? new Error('Upstream failed')
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username') || 'kianis4'
  const apiUrl = `https://leetcode-api-faisalshohag.vercel.app/${username}`

  try {
    const response = await fetchUpstream(apiUrl)
    const data = await response.json()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      },
    })
  } catch (error) {
    console.error('Error fetching leetcode data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 502 })
  }
}
