import { NextResponse } from 'next/server'
import { ownerNowPlaying } from '@/app/spotify/viz/data'

// Live playback state for the Now Playing telemetry strip. Always fresh; the
// client polls this. A short server-side cache window collapses concurrent
// visitors into a single upstream call (the dashboard polls every ~8s).
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await ownerNowPlaying()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 's-maxage=8, stale-while-revalidate=20' },
    })
  } catch {
    return NextResponse.json({ isPlaying: false, progressMs: 0, durationMs: 0 }, { status: 200 })
  }
}
