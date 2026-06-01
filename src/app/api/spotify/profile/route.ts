import { NextRequest, NextResponse } from 'next/server'
import { ownerProfile, isTimeRange } from '@/lib/spotify'

// Owner's genre weighting + audio-feature summary for a given time range.
export async function GET(req: NextRequest) {
  const range = req.nextUrl.searchParams.get('range')
  const time_range = isTimeRange(range) ? range : 'medium_term'
  try {
    const profile = await ownerProfile(time_range)
    return NextResponse.json(profile, {
      headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400' },
    })
  } catch (error) {
    console.error('Error fetching Spotify profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
