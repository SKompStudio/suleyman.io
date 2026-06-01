import { NextResponse } from 'next/server'
import { ownerRecentlyPlayed } from '@/app/spotify/viz/data'

// The owner's recently-played feed (the only endpoint with real play
// timestamps). Powers the activity log. Empty array on failure = offline state.
export async function GET() {
  try {
    const plays = await ownerRecentlyPlayed(30)
    return NextResponse.json(plays, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' },
    })
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
