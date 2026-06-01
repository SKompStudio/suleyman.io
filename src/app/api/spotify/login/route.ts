import { NextRequest, NextResponse } from 'next/server'
import { blendAuthorizeUrl, isTimeRange } from '@/lib/spotify'

// Starts the Blend authorization-code flow: set a CSRF `state` cookie, then
// redirect the visitor to Spotify's consent screen. No tokens here.
export async function GET(req: NextRequest) {
  const rangeParam = req.nextUrl.searchParams.get('range')
  const range = isTimeRange(rangeParam) ? rangeParam : 'medium_term'

  const nonce = crypto.randomUUID()
  // state carries both the CSRF nonce and the chosen range, dot-separated.
  const state = `${nonce}.${range}`

  const res = NextResponse.redirect(blendAuthorizeUrl(state))
  res.cookies.set('spotify_blend_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  })
  return res
}
