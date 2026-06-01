// Server-side data layer for the /spotify viz suite.
//
// Maps raw Spotify Web API JSON (owner flow) into the typed shapes the viz
// components consume. Every endpoint here is confirmed LIVE for a dev-mode app
// in 2026. No popularity, no audio-features, no recommendations.

import { getOwnerAccessToken, ownerApi, aggregateGenres } from '@/lib/spotify'
import type { TimeRange } from '@/lib/spotify'
import type {
  RankedArtist,
  RankedTrack,
  RankedSets,
  RangeKey,
  NowPlaying,
  RecentPlay,
  ManifestStat,
  OwnerSignature,
} from './types'

const RANGE_BY_KEY: Record<RangeKey, TimeRange> = {
  short: 'short_term',
  medium: 'medium_term',
  long: 'long_term',
}

function releaseYear(album: any): number | undefined {
  const d: string | undefined = album?.release_date
  if (!d) return undefined
  const y = parseInt(d.slice(0, 4), 10)
  return Number.isFinite(y) ? y : undefined
}

function toRankedArtist(a: any, i: number): RankedArtist {
  return {
    id: a.id,
    name: a.name,
    rank: i + 1,
    genres: a.genres ?? [],
    image: a.images?.[a.images.length - 1]?.url ?? a.images?.[0]?.url,
    url: a.external_urls?.spotify,
  }
}

function toRankedTrack(t: any, i: number): RankedTrack {
  return {
    id: t.id,
    name: t.name,
    artist: (t.artists ?? []).map((x: any) => x.name).join(', '),
    rank: i + 1,
    releaseYear: releaseYear(t.album),
    image: t.album?.images?.[t.album.images.length - 1]?.url ?? t.album?.images?.[0]?.url,
    url: t.external_urls?.spotify,
  }
}

export type DashboardData = {
  artists: RankedSets<RankedArtist>
  tracks: RankedSets<RankedTrack>
  manifest: ManifestStat[]
  signature: OwnerSignature
}

// One token exchange, all six top-lists + last-play in parallel.
export async function ownerDashboardData(): Promise<DashboardData> {
  const token = await getOwnerAccessToken()
  const keys: RangeKey[] = ['short', 'medium', 'long']

  const [artistRes, trackRes, lastRes] = await Promise.all([
    Promise.all(
      keys.map((k) =>
        ownerApi<{ items: any[] }>(
          `/me/top/artists?time_range=${RANGE_BY_KEY[k]}&limit=50`,
          { revalidate: 1800 },
          token
        )
      )
    ),
    Promise.all(
      keys.map((k) =>
        ownerApi<{ items: any[] }>(
          `/me/top/tracks?time_range=${RANGE_BY_KEY[k]}&limit=50`,
          { revalidate: 1800 },
          token
        )
      )
    ),
    ownerApi<{ items: any[] }>(`/me/player/recently-played?limit=1`, { revalidate: 300 }, token),
  ])

  const artists = {} as RankedSets<RankedArtist>
  const tracks = {} as RankedSets<RankedTrack>
  keys.forEach((k, idx) => {
    artists[k] = (artistRes[idx].data?.items ?? []).map(toRankedArtist)
    tracks[k] = (trackRes[idx].data?.items ?? []).map(toRankedTrack)
  })

  const lastPlayedAt = lastRes.data?.items?.[0]?.played_at as string | undefined

  return {
    artists,
    tracks,
    manifest: computeManifest(artists, tracks, lastPlayedAt),
    signature: ownerSignature(artists.medium),
  }
}

// Pure — deterministic, unit-testable without network.
export function computeManifest(
  artists: RankedSets<RankedArtist>,
  tracks: RankedSets<RankedTrack>,
  lastPlayedAt?: string
): ManifestStat[] {
  const med = artists.medium ?? []
  const genreSet = new Set<string>()
  med.forEach((a) => a.genres.forEach((g) => genreSet.add(g)))
  const dominant = aggregateGenres(med)[0]?.genre

  const years = (tracks.medium ?? [])
    .map((t) => t.releaseYear)
    .filter((y): y is number => typeof y === 'number')
    .sort((a, b) => a - b)
  const eraCentroid = years.length ? String(years[Math.floor(years.length / 2)]) : '—'

  // Core = present in all three windows (by name).
  const names = (k: RangeKey) => new Set((artists[k] ?? []).map((a) => a.name))
  const s = names('short')
  const l = names('long')
  const core = (artists.medium ?? []).filter((a) => s.has(a.name) && l.has(a.name)).length

  const stats: ManifestStat[] = [
    { label: 'ARTISTS TRACKED', value: String(med.length) },
    { label: 'GENRES DETECTED', value: String(genreSet.size) },
    { label: 'DOMINANT GENRE', value: dominant ?? '—', headline: true },
    { label: 'ERA CENTROID', value: eraCentroid },
    { label: 'TOP ARTIST', value: med[0]?.name ?? '—' },
    { label: 'CORE ARTISTS', value: String(core) },
    { label: 'DATA WINDOW', value: '6 months' },
    { label: 'LAST PLAY', value: lastPlayedAt ? relTime(lastPlayedAt) : '—' },
  ]
  return stats
}

function relTime(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m ago`
  const h = Math.round(mins / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}

export function ownerSignature(mediumArtists: RankedArtist[]): OwnerSignature {
  const genreSet = new Set<string>()
  mediumArtists.forEach((a) => a.genres.forEach((g) => genreSet.add(g)))
  return {
    topGenre: aggregateGenres(mediumArtists)[0]?.genre,
    topArtist: mediumArtists[0]?.name,
    artistCount: mediumArtists.length,
    genreCount: genreSet.size,
  }
}

// ── Live telemetry (needs player + recently-played scopes on the owner token) ─
export async function ownerNowPlaying(): Promise<NowPlaying> {
  const token = await getOwnerAccessToken()
  const player = await ownerApi<any>('/me/player', { noStore: true }, token)

  if (player.ok && player.data?.item) {
    const d = player.data
    const t = d.item
    return {
      isPlaying: Boolean(d.is_playing),
      track: {
        name: t.name,
        artist: (t.artists ?? []).map((x: any) => x.name).join(', '),
        image: t.album?.images?.[0]?.url,
        url: t.external_urls?.spotify,
      },
      progressMs: d.progress_ms ?? 0,
      durationMs: t.duration_ms ?? 0,
      device: d.device?.name,
      shuffle: Boolean(d.shuffle_state),
      repeat: (d.repeat_state ?? 'off') as 'off' | 'track' | 'context',
      volumePercent: d.device?.volume_percent ?? undefined,
    }
  }

  // Nothing playing (204 / no active device): fall back to the last play.
  const recent = await ownerApi<{ items: any[] }>(
    '/me/player/recently-played?limit=1',
    { noStore: true },
    token
  )
  const last = recent.data?.items?.[0]
  return {
    isPlaying: false,
    progressMs: 0,
    durationMs: 0,
    lastPlayedAt: last?.played_at,
    lastTrack: last
      ? {
          name: last.track?.name,
          artist: (last.track?.artists ?? []).map((x: any) => x.name).join(', '),
          image: last.track?.album?.images?.[0]?.url,
          url: last.track?.external_urls?.spotify,
        }
      : undefined,
  }
}

export async function ownerRecentlyPlayed(limit = 30): Promise<RecentPlay[]> {
  const res = await ownerApi<{ items: any[] }>(
    `/me/player/recently-played?limit=${limit}`,
    { revalidate: 60 }
  )
  return (res.data?.items ?? []).map((p: any) => ({
    playedAt: p.played_at,
    name: p.track?.name,
    artist: (p.track?.artists ?? []).map((x: any) => x.name).join(', '),
    image: p.track?.album?.images?.[p.track.album.images.length - 1]?.url ?? p.track?.album?.images?.[0]?.url,
    url: p.track?.external_urls?.spotify,
  }))
}
