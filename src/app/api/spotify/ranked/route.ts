import { NextResponse } from 'next/server'
import { ownerDashboardData } from '@/app/spotify/viz/data'

// Owner top artists/tracks across all three windows + computed manifest +
// signature, in one token exchange. Feeds the analyzers (Drift, Era, Manifest,
// Constellation). On failure returns empty sets so the page shows an honest
// offline state, not a crash.
export async function GET() {
  try {
    const data = await ownerDashboardData()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      {
        artists: { short: [], medium: [], long: [] },
        tracks: { short: [], medium: [], long: [] },
        manifest: [],
        signature: { artistCount: 0, genreCount: 0 },
      },
      { status: 200 }
    )
  }
}
