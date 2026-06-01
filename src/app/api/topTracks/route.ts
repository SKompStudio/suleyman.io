import { NextRequest, NextResponse } from 'next/server'
import { ownerTopTracks, isTimeRange } from '@/lib/spotify'

export async function GET(req: NextRequest) {
  const range = req.nextUrl.searchParams.get('range')
  const time_range = isTimeRange(range) ? range : 'medium_term'
  try {
    const tracks = await ownerTopTracks(time_range)
    return NextResponse.json(tracks, {
      headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400' },
    })
  } catch (error) {
    console.error('Error fetching top tracks:', error)
    return NextResponse.json({ error: 'Failed to fetch top tracks' }, { status: 500 })
  }
}
