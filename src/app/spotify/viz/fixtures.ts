// Realistic mock data for isolated viz development + Vitest.
// Shapes match ./types.ts exactly. Reflects a real rap/drill/hip-hop profile.

import type {
  RankedArtist,
  RankedTrack,
  RankedSets,
  NowPlaying,
  RecentPlay,
  ManifestStat,
  BlendResult,
  OwnerSignature,
} from './types'

const IMG_DRAKE = 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9'
const IMG_TRACK = 'https://i.scdn.co/image/ab67616d0000b273d498d683cfc7b6207cde7206'

function artist(rank: number, name: string, genres: string[], image?: string): RankedArtist {
  // Stable id per artist (NOT rank-derived) so the same artist matches across
  // windows — mirrors real Spotify ids, which are constant across time ranges.
  return { id: `art-${name.replace(/\s+/g, '')}`, name, rank, genres, image, url: '#' }
}

export const fxArtists: RankedSets<RankedArtist> = {
  medium: [
    artist(1, 'Drake', ['rap', 'hip hop'], IMG_DRAKE),
    artist(2, 'Gunna', ['melodic rap', 'trap']),
    artist(3, 'Travis Scott', ['rap', 'trap']),
    artist(4, 'Central Cee', ['uk drill', 'uk rap']),
    artist(5, 'Lil Baby', ['rap', 'atlanta hip hop']),
    artist(6, 'Metro Boomin', ['rap']),
    artist(7, '21 Savage', ['rap', 'atlanta hip hop']),
    artist(8, 'Future', ['rap', 'trap']),
    artist(9, 'Dave', ['uk rap', 'uk hip hop']),
    artist(10, 'J. Cole', ['rap', 'conscious hip hop']),
    artist(11, 'Don Toliver', ['melodic rap']),
    artist(12, 'Pop Smoke', ['brooklyn drill']),
  ],
  short: [
    artist(1, 'Central Cee', ['uk drill', 'uk rap']),
    artist(2, 'Drake', ['rap', 'hip hop'], IMG_DRAKE),
    artist(3, 'Dave', ['uk rap', 'uk hip hop']),
    artist(4, 'Gunna', ['melodic rap', 'trap']),
    artist(5, 'Sdot Go', ['ny drill']),
    artist(6, 'Metro Boomin', ['rap']),
    artist(7, 'Travis Scott', ['rap', 'trap']),
    artist(8, 'Lil Tjay', ['melodic rap']),
    artist(9, 'Don Toliver', ['melodic rap']),
    artist(10, '21 Savage', ['rap', 'atlanta hip hop']),
  ],
  long: [
    artist(1, 'Drake', ['rap', 'hip hop'], IMG_DRAKE),
    artist(2, 'J. Cole', ['rap', 'conscious hip hop']),
    artist(3, 'Travis Scott', ['rap', 'trap']),
    artist(4, 'Future', ['rap', 'trap']),
    artist(5, 'Kendrick Lamar', ['rap', 'conscious hip hop']),
    artist(6, 'Lil Baby', ['rap', 'atlanta hip hop']),
    artist(7, 'Pop Smoke', ['brooklyn drill']),
    artist(8, 'Meek Mill', ['philly rap', 'rap']),
    artist(9, 'A Boogie wit da Hoodie', ['melodic rap']),
    artist(10, 'Gunna', ['melodic rap', 'trap']),
  ],
}

function track(rank: number, name: string, artistName: string, releaseYear: number, image?: string): RankedTrack {
  return {
    id: `trk-${name.replace(/\s+/g, '')}`,
    name,
    artist: artistName,
    rank,
    releaseYear,
    image,
    url: '#',
  }
}

export const fxTracks: RankedSets<RankedTrack> = {
  medium: [
    track(1, 'Sprinter', 'Central Cee, Dave', 2023, IMG_TRACK),
    track(2, 'fukumean', 'Gunna', 2023),
    track(3, 'FE!N', 'Travis Scott', 2023),
    track(4, 'Rich Flex', 'Drake, 21 Savage', 2022),
    track(5, 'Paid in Full', 'Sdot Go', 2023),
    track(6, 'Money Trees', 'Kendrick Lamar', 2012),
    track(7, 'Dior', 'Pop Smoke', 2019),
    track(8, 'No Role Modelz', 'J. Cole', 2014),
    track(9, 'Goosebumps', 'Travis Scott', 2016),
    track(10, 'Life Is Good', 'Future, Drake', 2020),
    track(11, 'Mask Off', 'Future', 2017),
    track(12, 'Jimmy Cooks', 'Drake, 21 Savage', 2022),
  ],
  short: [],
  long: [],
}
fxTracks.short = fxTracks.medium.slice(0, 8)
fxTracks.long = fxTracks.medium

export const fxNowPlaying: NowPlaying = {
  isPlaying: true,
  track: { name: 'Sprinter', artist: 'Central Cee, Dave', image: IMG_TRACK, url: '#' },
  progressMs: 78_000,
  durationMs: 169_000,
  device: 'iPhone 15 Pro Max',
  shuffle: true,
  repeat: 'off',
  volumePercent: 62,
}

export const fxNowPlayingIdle: NowPlaying = {
  isPlaying: false,
  progressMs: 0,
  durationMs: 0,
  lastPlayedAt: new Date(Date.now() - 1000 * 60 * 23).toISOString(),
  lastTrack: { name: 'fukumean', artist: 'Gunna', image: IMG_TRACK, url: '#' },
}

const now = Date.now()
export const fxRecentPlays: RecentPlay[] = [
  { playedAt: new Date(now - 1000 * 60 * 8).toISOString(), name: 'Sprinter', artist: 'Central Cee, Dave', image: IMG_TRACK, url: '#' },
  { playedAt: new Date(now - 1000 * 60 * 12).toISOString(), name: 'fukumean', artist: 'Gunna', url: '#' },
  { playedAt: new Date(now - 1000 * 60 * 19).toISOString(), name: 'FE!N', artist: 'Travis Scott', url: '#' },
  { playedAt: new Date(now - 1000 * 60 * 26).toISOString(), name: 'Rich Flex', artist: 'Drake, 21 Savage', url: '#' },
  { playedAt: new Date(now - 1000 * 60 * 41).toISOString(), name: 'Paid in Full', artist: 'Sdot Go', url: '#' },
  { playedAt: new Date(now - 1000 * 60 * 55).toISOString(), name: 'Dior', artist: 'Pop Smoke', url: '#' },
  { playedAt: new Date(now - 1000 * 60 * 73).toISOString(), name: 'Goosebumps', artist: 'Travis Scott', url: '#' },
  { playedAt: new Date(now - 1000 * 60 * 90).toISOString(), name: 'Life Is Good', artist: 'Future, Drake', url: '#' },
]

export const fxManifest: ManifestStat[] = [
  { label: 'ARTISTS TRACKED', value: '50' },
  { label: 'GENRES DETECTED', value: '14' },
  { label: 'DOMINANT GENRE', value: 'rap', headline: true },
  { label: 'ERA CENTROID', value: '2020' },
  { label: 'TOP ARTIST', value: 'Drake' },
  { label: 'DATA WINDOW', value: '6 months' },
  { label: 'LAST PLAY', value: '8m ago' },
  { label: 'CORE ARTISTS', value: '6' },
]

export const fxBlend: BlendResult = {
  matchPercent: 72,
  sharedArtists: [
    { name: 'Drake', coverImage: IMG_DRAKE },
    { name: 'Travis Scott' },
    { name: 'Gunna' },
    { name: '21 Savage' },
  ],
  sharedGenres: ['rap', 'trap', 'melodic rap'],
  visitorTopGenre: 'rap',
  ownerTopGenre: 'rap',
  visitorArtistCount: 50,
  sharedArtistCount: 11,
  sharedGenreCount: 3,
}

export const fxOwnerSignature: OwnerSignature = {
  topGenre: 'rap',
  topArtist: 'Drake',
  artistCount: 50,
  genreCount: 14,
}
