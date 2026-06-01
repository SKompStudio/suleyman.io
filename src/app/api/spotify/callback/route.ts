import { NextRequest, NextResponse } from 'next/server'
import { blendFromCode, isTimeRange, SpotifyAuthError, siteBaseUrl } from '@/lib/spotify'

// Spotify redirects here after the visitor consents (or denies).
//
// Everything sensitive stays server-side: the `code` is exchanged for the
// visitor's access token HERE, used once to compute the blend, and discarded.
// Only the computed compatibility (non-sensitive: a match %, shared artist
// names, shared genres) is base64-encoded into the redirect back to /spotify.
// The visitor's token is NEVER written to a cookie, a response body, or a log.
function back(reason: string): NextResponse {
  return NextResponse.redirect(`${siteBaseUrl()}/spotify?blend_error=${reason}`)
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  const cookieState = req.cookies.get('spotify_blend_state')?.value

  // The visitor declined on Spotify's consent screen.
  if (error) return back('denied')

  // CSRF: the returned state must match the cookie we set at /login.
  if (!state || !cookieState || state !== cookieState) return back('state')
  if (!code) return back('unknown')

  const rangeFromState = state.split('.')[1]
  const range = isTimeRange(rangeFromState) ? rangeFromState : 'medium_term'

  try {
    const result = await blendFromCode(code, range)
    const payload = Buffer.from(JSON.stringify(result)).toString('base64url')
    const res = NextResponse.redirect(`${siteBaseUrl()}/spotify?blend=${payload}`)
    // The one-time state cookie has done its job.
    res.cookies.delete('spotify_blend_state')
    return res
  } catch (e) {
    const reason = e instanceof SpotifyAuthError ? e.reason : 'unknown'
    console.error('Blend callback error:', reason)
    return back(reason)
  }
}
