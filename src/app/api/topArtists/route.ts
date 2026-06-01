import { NextRequest, NextResponse } from 'next/server'
import { ownerTopArtists, isTimeRange } from '@/lib/spotify'

export async function GET(req: NextRequest) {
  const range = req.nextUrl.searchParams.get('range')
  const time_range = isTimeRange(range) ? range : 'medium_term'
  try {
    const artists = await ownerTopArtists(time_range)
    return NextResponse.json(artists, {
      headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400' },
    })
  } catch (error) {
    console.error('Error fetching top artists:', error)
    return NextResponse.json({ error: 'Failed to fetch top artists' }, { status: 500 })
  }
}
