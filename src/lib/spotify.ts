// Spotify integration.
//
// Two distinct auth modes share the same registered app credentials:
//
//  1. OWNER mode (Suleyman's own listening data) — a long-lived
//     SPOTIFY_REFRESH_TOKEN minted once, exchanged for a short-lived access
//     token on each request. Powers the "my top" sections.
//
//  2. VISITOR mode (the Blend feature) — the Authorization Code flow. A visitor
//     authorizes with the `user-top-read` scope; we exchange their `code` for an
//     access token SERVER-SIDE and immediately use it to read their top
//     artists/tracks. The visitor's token never reaches the browser and is not
//     persisted — it lives only for the duration of the callback request.
//
// Env (reused, do NOT invent new secret names):
//   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET  — the registered app
//   SPOTIFY_REFRESH_TOKEN                      — owner's offline token
//   SPOTIFY_USER_NAME                          — owner's Spotify user id (display)
//   NEXT_PUBLIC_SITE_URL                       — base URL, for the redirect URI

export type TimeRange = 'short_term' | 'medium_term' | 'long_term'

export const TIME_RANGES: { value: TimeRange; label: string; sub: string }[] = [
  { value: 'short_term', label: '4 weeks', sub: 'short_term' },
  { value: 'medium_term', label: '6 months', sub: 'medium_term' },
  { value: 'long_term', label: 'all time', sub: 'long_term' },
]

export function isTimeRange(v: string | null | undefined): v is TimeRange {
  return v === 'short_term' || v === 'medium_term' || v === 'long_term'
}

// ── Shapes the UI consumes ───────────────────────────────────────────────────

export type ArtistCard = {
  id: string
  title: string
  coverImage?: string
  url?: string
  genres: string[]
}

export type TrackCard = {
  id: string
  title: string
  artist: string
  coverImage?: string
  url?: string
}

export type GenreWeight = { genre: string; count: number }

export type AudioSummary = {
  energy: number
  danceability: number
  valence: number
  acousticness: number
  available: boolean
}

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const AUTH_URL = 'https://accounts.spotify.com/authorize'
const API = 'https://api.spotify.com/v1'

// Scopes the Blend needs. recently-played is requested too — harmless if unused,
// and lets us fall back to recent listening if top-read returns sparse data.
export const BLEND_SCOPES = 'user-top-read user-read-recently-played'

function basicAuthHeader(): string {
  const id = process.env.SPOTIFY_CLIENT_ID
  const secret = process.env.SPOTIFY_CLIENT_SECRET
  if (!id || !secret) throw new Error('Missing Spotify client credentials')
  return `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`
}

export function siteBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://suleyman.io').replace(/\/$/, '')
}

export function blendRedirectUri(): string {
  return `${siteBaseUrl()}/api/spotify/callback`
}

// ── OWNER (refresh-token) flow ───────────────────────────────────────────────

export async function getOwnerAccessToken(): Promise<string> {
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN
  if (!refresh_token) throw new Error('Missing Spotify environment variables')

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token }),
    // Owner data changes slowly; cache the token exchange briefly at the edge.
    next: { revalidate: 1800, tags: ['spotify-owner'] },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Spotify token error: ${data.error || 'unknown'}`)
  return data.access_token as string
}

// Reusable owner GET against the Web API. Returns a discriminated result so
// callers can treat 204 (nothing playing) as a normal state, not an error.
export async function ownerApi<T>(
  path: string,
  opts?: { revalidate?: number; noStore?: boolean },
  token?: string
): Promise<{ ok: boolean; status: number; data: T | null }> {
  const access = token ?? (await getOwnerAccessToken())
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${access}` },
    ...(opts?.noStore
      ? { cache: 'no-store' }
      : { next: { revalidate: opts?.revalidate ?? 1800, tags: ['spotify-owner'] } }),
  })
  if (res.status === 204) return { ok: true, status: 204, data: null }
  if (!res.ok) return { ok: false, status: res.status, data: null }
  return { ok: true, status: res.status, data: (await res.json()) as T }
}

async function ownerTop(
  kind: 'artists' | 'tracks',
  range: TimeRange,
  token?: string
): Promise<any[]> {
  const access = token ?? (await getOwnerAccessToken())
  const res = await fetch(
    `${API}/me/top/${kind}?time_range=${range}&limit=50`,
    {
      headers: { Authorization: `Bearer ${access}` },
      next: { revalidate: 1800, tags: ['spotify-owner'] },
    }
  )
  if (!res.ok) throw new Error(`Spotify ${kind} error: ${res.status}`)
  const { items } = await res.json()
  return items ?? []
}

export async function ownerTopArtists(range: TimeRange): Promise<ArtistCard[]> {
  const items = await ownerTop('artists', range)
  return items.map(toArtistCard)
}

export async function ownerTopTracks(range: TimeRange): Promise<TrackCard[]> {
  const items = await ownerTop('tracks', range)
  return items.map(toTrackCard)
}

// Genres + audio-feature summary for the owner, derived in one token exchange.
export async function ownerProfile(range: TimeRange): Promise<{
  genres: GenreWeight[]
  audio: AudioSummary
}> {
  const token = await getOwnerAccessToken()
  const [artists, tracks] = await Promise.all([
    ownerTop('artists', range, token),
    ownerTop('tracks', range, token),
  ])
  const genres = aggregateGenres(artists)
  const audio = await audioSummary(
    tracks.map((t: any) => t.id).filter(Boolean),
    token
  )
  return { genres, audio }
}

// ── VISITOR (authorization-code) flow ────────────────────────────────────────

export function blendAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID ?? '',
    scope: BLEND_SCOPES,
    redirect_uri: blendRedirectUri(),
    state,
    show_dialog: 'false',
  })
  return `${AUTH_URL}?${params.toString()}`
}

export class SpotifyAuthError extends Error {
  constructor(
    public reason: 'not_whitelisted' | 'denied' | 'token' | 'scope' | 'unknown',
    message: string
  ) {
    super(message)
    this.name = 'SpotifyAuthError'
  }
}

async function exchangeCode(code: string): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: blendRedirectUri(),
    }),
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) {
    // Spotify returns invalid_grant for a stale/replayed code; 403-style
    // restrictions surface as a generic error in dev mode.
    throw new SpotifyAuthError('token', data.error_description || data.error || 'token exchange failed')
  }
  return data.access_token as string
}

async function visitorTop(
  kind: 'artists' | 'tracks',
  range: TimeRange,
  token: string
): Promise<any[]> {
  const res = await fetch(`${API}/me/top/${kind}?time_range=${range}&limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (res.status === 403) {
    // The single most common dev-mode failure: the user authorized but isn't on
    // the app's allow-list, so the API refuses to return their data.
    throw new SpotifyAuthError(
      'not_whitelisted',
      'This Spotify account is not authorized for this app (development mode allow-list).'
    )
  }
  if (!res.ok) throw new SpotifyAuthError('unknown', `Spotify ${kind} error: ${res.status}`)
  const { items } = await res.json()
  return items ?? []
}

// ── The Blend: compute compatibility between visitor and owner ────────────────

export type BlendResult = {
  matchPercent: number
  sharedArtists: { name: string; coverImage?: string }[]
  sharedGenres: string[]
  visitorTopGenre?: string
  ownerTopGenre?: string
  visitorArtistCount: number
  sharedArtistCount: number
  sharedGenreCount: number
}

export function aggregateGenres(artists: any[]): GenreWeight[] {
  const counts = new Map<string, number>()
  artists.forEach((a, i) => {
    // Weight by rank: a top artist's genres count for more than a #40 artist.
    const w = Math.max(1, 50 - i)
    for (const g of a.genres ?? []) counts.set(g, (counts.get(g) ?? 0) + w)
  })
  return [...counts.entries()]
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
}

async function audioSummary(trackIds: string[], token: string): Promise<AudioSummary> {
  const empty: AudioSummary = {
    energy: 0,
    danceability: 0,
    valence: 0,
    acousticness: 0,
    available: false,
  }
  if (trackIds.length === 0) return empty
  const res = await fetch(`${API}/audio-features?ids=${trackIds.slice(0, 100).join(',')}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 1800, tags: ['spotify-owner'] },
  })
  // audio-features is deprecated for some new apps; degrade silently if 403/404.
  if (!res.ok) return empty
  const { audio_features } = await res.json()
  const feats = (audio_features ?? []).filter(Boolean)
  if (feats.length === 0) return empty
  const avg = (k: string) =>
    feats.reduce((s: number, f: any) => s + (f[k] ?? 0), 0) / feats.length
  return {
    energy: avg('energy'),
    danceability: avg('danceability'),
    valence: avg('valence'),
    acousticness: avg('acousticness'),
    available: true,
  }
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0
  let inter = 0
  for (const x of a) if (b.has(x)) inter++
  const union = a.size + b.size - inter
  return union === 0 ? 0 : inter / union
}

// Pure compatibility math — separated so it's deterministic and unit-testable
// without any network. `visitorArtists` / `ownerArtists` are raw Spotify artist
// objects ({ name, genres, images }).
export function scoreBlend(visitorArtists: any[], ownerArtists: any[]): BlendResult {
  const vArtistNames = new Set<string>(visitorArtists.map((a: any) => a.name))
  const oArtistByName = new Map<string, any>(ownerArtists.map((a: any) => [a.name, a]))
  const oArtistNames = new Set<string>(oArtistByName.keys())

  const sharedArtistNames = [...vArtistNames].filter((n) => oArtistNames.has(n))
  const sharedArtists = sharedArtistNames.slice(0, 12).map((name) => ({
    name,
    coverImage: oArtistByName.get(name)?.images?.[0]?.url as string | undefined,
  }))

  const vGenres = aggregateGenres(visitorArtists)
  const oGenres = aggregateGenres(ownerArtists)
  const vGenreSet = new Set(vGenres.map((g) => g.genre))
  const oGenreSet = new Set(oGenres.map((g) => g.genre))
  const sharedGenres = [...vGenreSet].filter((g) => oGenreSet.has(g))

  // Weighted match: genre overlap (Jaccard) dominates — it captures taste even
  // when exact artists differ — with a direct shared-artist bonus on top.
  const genreScore = jaccard(vGenreSet, oGenreSet)
  const artistScore = jaccard(vArtistNames, oArtistNames)
  const matchPercent = Math.round(Math.min(100, (genreScore * 0.65 + artistScore * 0.35) * 100 * 2.2))

  return {
    matchPercent,
    sharedArtists,
    sharedGenres: sharedGenres.slice(0, 16),
    visitorTopGenre: vGenres[0]?.genre,
    ownerTopGenre: oGenres[0]?.genre,
    visitorArtistCount: visitorArtists.length,
    sharedArtistCount: sharedArtistNames.length,
    sharedGenreCount: sharedGenres.length,
  }
}

// Compute the blend from a visitor's authorized token against the owner's taste.
export async function computeBlend(visitorToken: string, range: TimeRange): Promise<BlendResult> {
  const [vArtists, vTracks, ownerArtists] = await Promise.all([
    visitorTop('artists', range, visitorToken),
    visitorTop('tracks', range, visitorToken).catch(() => [] as any[]),
    ownerTop('artists', range),
  ])

  if (vArtists.length === 0 && vTracks.length === 0) {
    throw new SpotifyAuthError('scope', 'No listening data returned for this account.')
  }

  return scoreBlend(vArtists, ownerArtists)
}

// Full visitor blend from an authorization code: exchange then compute.
export async function blendFromCode(code: string, range: TimeRange): Promise<BlendResult> {
  const token = await exchangeCode(code)
  return computeBlend(token, range)
}

// ── mappers ──────────────────────────────────────────────────────────────────

function toArtistCard(a: any): ArtistCard {
  return {
    id: a.id,
    title: a.name,
    coverImage: a.images?.[0]?.url,
    url: a.external_urls?.spotify,
    genres: a.genres ?? [],
  }
}

function toTrackCard(t: any): TrackCard {
  return {
    id: t.id,
    title: t.name,
    artist: (t.artists ?? []).map((x: any) => x.name).join(', '),
    coverImage: t.album?.images?.[0]?.url,
    url: t.external_urls?.spotify,
  }
}
