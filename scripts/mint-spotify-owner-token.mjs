#!/usr/bin/env node
// One-time owner refresh-token minter.
//
// The /spotify live-telemetry features (Now Playing, Recently Played) need the
// OWNER token to carry player + recently-played read scopes. The token currently
// in Vercel was minted with user-top-read only, so it cannot read playback.
//
// Run this ONCE on your Mac (it has the client creds + a browser), approve the
// consent screen, and paste the printed SPOTIFY_REFRESH_TOKEN into Vercel.
//
// PREREQUISITE: add this redirect URI to the Spotify app (Dashboard -> Edit
// Settings -> Redirect URIs), then Save:
//
//     http://127.0.0.1:8888/callback
//
// USAGE (from the repo root, with .env.local holding SPOTIFY_CLIENT_ID/SECRET,
// or pass them inline):
//
//     node scripts/mint-spotify-owner-token.mjs
//
import http from 'node:http'
import { readFileSync } from 'node:fs'

const SCOPES = [
  'user-top-read',
  'user-read-recently-played',
  'user-read-currently-playing',
  'user-read-playback-state',
].join(' ')

const REDIRECT_URI = 'http://127.0.0.1:8888/callback'
const PORT = 8888

// Pull creds from env, falling back to a .env.local in cwd.
function loadEnv() {
  const out = { ...process.env }
  try {
    const raw = readFileSync('.env.local', 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && out[m[1]] === undefined) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {}
  return out
}

const env = loadEnv()
const CLIENT_ID = env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    '\n  Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET.\n' +
      '  Put them in .env.local or run:\n' +
      '    SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/mint-spotify-owner-token.mjs\n'
  )
  process.exit(1)
}

const authorizeUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    show_dialog: 'true',
  }).toString()

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`)
  if (url.pathname !== '/callback') {
    res.writeHead(404).end('not found')
    return
  }
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  if (error || !code) {
    res.writeHead(400).end(`Authorization failed: ${error || 'no code'}`)
    server.close()
    process.exit(1)
  }

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  })
  const data = await tokenRes.json()
  if (!tokenRes.ok) {
    res.writeHead(500).end(`Token exchange failed: ${JSON.stringify(data)}`)
    server.close()
    process.exit(1)
  }

  res
    .writeHead(200, { 'Content-Type': 'text/html' })
    .end(
      '<body style="font-family:monospace;background:#06080B;color:#5BC8FF;padding:40px">' +
        '<h2>Token minted.</h2><p>Return to your terminal, copy the refresh token, and paste it into Vercel as SPOTIFY_REFRESH_TOKEN. You can close this tab.</p></body>'
    )

  console.log('\n  ====================  OWNER REFRESH TOKEN  ====================\n')
  console.log('  SPOTIFY_REFRESH_TOKEN=' + data.refresh_token)
  console.log('\n  Scopes granted: ' + (data.scope || SCOPES))
  console.log('\n  Next: set this as SPOTIFY_REFRESH_TOKEN in Vercel (Production)')
  console.log('  for the suley-fitness-portfolio-fnv6 project, then redeploy.\n')
  server.close()
  process.exit(0)
})

server.listen(PORT, '127.0.0.1', () => {
  console.log('\n  Open this URL in your browser to authorize:\n')
  console.log('  ' + authorizeUrl + '\n')
  console.log('  Waiting for the Spotify redirect on ' + REDIRECT_URI + ' ...\n')
})
