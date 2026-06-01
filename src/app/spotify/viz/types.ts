// Data contract for the /spotify visualization suite.
//
// Every viz component is PRESENTATIONAL: it receives one of these typed shapes as
// props and renders. The data plumbing (lib + API routes) produces these shapes;
// fixtures.ts provides realistic mock instances for isolated development.
//
// All of these are derivable from endpoints that are LIVE for a dev-mode app in
// 2026. No popularity, no audio-features, no recommendations (all removed).

export type RangeKey = 'short' | 'medium' | 'long'
export type RankedSets<T> = Record<RangeKey, T[]>

export type RankedArtist = {
  id: string
  name: string
  rank: number // 1-based
  genres: string[] // frequently sparse/empty since Mar 2025 — degrade gracefully
  image?: string
  url?: string
}

export type RankedTrack = {
  id: string
  name: string
  artist: string
  rank: number // 1-based
  releaseYear?: number
  image?: string
  url?: string
}

// ── Now Playing telemetry ────────────────────────────────────────────────────
export type NowPlaying = {
  isPlaying: boolean
  track?: { name: string; artist: string; image?: string; url?: string }
  progressMs: number
  durationMs: number
  device?: string
  shuffle?: boolean
  repeat?: 'off' | 'track' | 'context'
  volumePercent?: number
  // When nothing is playing (Spotify 204), the honest fallback:
  lastPlayedAt?: string // ISO timestamp
  lastTrack?: { name: string; artist: string; image?: string; url?: string }
}

// ── Recently played activity log ─────────────────────────────────────────────
export type RecentPlay = {
  playedAt: string // ISO timestamp
  name: string
  artist: string
  image?: string
  url?: string
}

// ── System manifest (precomputed spec sheet) ─────────────────────────────────
export type ManifestStat = {
  label: string // e.g. "ARTISTS TRACKED"
  value: string // e.g. "50"
  headline?: boolean // exactly one is the gold headline
}

// ── Taste drift (rank movement across windows) ───────────────────────────────
// Components receive RankedSets and derive status; this type documents the
// derivation for any precompute helper.
export type DriftStatus = 'rising' | 'fading' | 'core' | 'new'

// ── Blend radar view-state (reuses lib BlendResult) ──────────────────────────
import type { BlendResult } from '@/lib/spotify'
export type { BlendResult }

export type BlendView =
  | { state: 'idle' } // no scan run yet — show owner baseline signature
  | { state: 'scanning' }
  | { state: 'locked'; result: BlendResult }
  | { state: 'restricted'; reason?: string } // non-allowlisted visitor (the common case)

// Owner baseline signature shown behind/around the radar regardless of state.
export type OwnerSignature = {
  topGenre?: string
  topArtist?: string
  artistCount: number
  genreCount: number
}
