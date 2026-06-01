'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import clsx from 'clsx'
import type { BlendResult } from '@/lib/spotify'
import type {
  RangeKey,
  RankedSets,
  RankedArtist,
  RankedTrack,
  ManifestStat,
  OwnerSignature,
  NowPlaying as NowPlayingData,
  RecentPlay,
  BlendView,
} from './viz/types'
import NowPlaying from './viz/NowPlaying'
import RecentlyPlayed from './viz/RecentlyPlayed'
import TasteDrift from './viz/TasteDrift'
import EraSpectrum from './viz/EraSpectrum'
import SystemManifest from './viz/SystemManifest'
import TasteConstellation from './viz/TasteConstellation'
import BlendRadar from './viz/BlendRadar'

type View = 'artists' | 'tracks'

const RANGES: { value: RangeKey; label: string; sub: string }[] = [
  { value: 'short', label: '4 weeks', sub: 'short_term' },
  { value: 'medium', label: '6 months', sub: 'medium_term' },
  { value: 'long', label: 'all time', sub: 'long_term' },
]

type RankedData = {
  artists: RankedSets<RankedArtist>
  tracks: RankedSets<RankedTrack>
  manifest: ManifestStat[]
  signature: OwnerSignature
}

const EMPTY: RankedData = {
  artists: { short: [], medium: [], long: [] },
  tracks: { short: [], medium: [], long: [] },
  manifest: [],
  signature: { artistCount: 0, genreCount: 0 },
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-accent/80">// {label}</h2>
      <div className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" />
    </div>
  )
}

function MediaCard({
  index,
  coverImage,
  title,
  subtitle,
  url,
}: {
  index: number
  coverImage?: string
  title: string
  subtitle?: string
  url?: string
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-lg border border-ink-border bg-ink-surface/40 transition-[transform,border-color] duration-300 hover:border-accent/40 motion-safe:hover:-translate-y-0.5"
    >
      <div className="relative aspect-square w-full bg-black/40">
        {coverImage && (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-opacity duration-300"
            priority={index < 5}
          />
        )}
        <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[0.65rem] text-accent">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="truncate font-sans text-sm font-medium text-ink-text">{title}</h3>
        {subtitle && <p className="mt-0.5 truncate font-mono text-xs text-ink-muted">{subtitle}</p>}
      </div>
    </a>
  )
}

// Decode the base64url blend payload (UTF-8 safe — artist names carry unicode).
function decodeBlend(payload: string): BlendResult | null {
  try {
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const bin = atob(b64)
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes)) as BlendResult
  } catch {
    return null
  }
}

function blendViewFrom(payload?: string, error?: string): BlendView {
  if (payload) {
    const result = decodeBlend(payload)
    if (result) return { state: 'locked', result }
  }
  if (error) {
    if (error === 'not_whitelisted' || error === 'scope')
      return { state: 'restricted', reason: error }
    return { state: 'restricted', reason: error }
  }
  return { state: 'idle' }
}

export function SpotifyDashboard() {
  const params = useSearchParams()
  const blendPayload = params.get('blend') ?? undefined
  const blendError = params.get('blend_error') ?? undefined
  const rangeParam = params.get('range')

  const initialRange: RangeKey =
    rangeParam === 'short' || rangeParam === 'medium' || rangeParam === 'long'
      ? rangeParam
      : 'medium'

  const [range, setRange] = useState<RangeKey>(initialRange)
  const [view, setView] = useState<View>('artists')
  const [data, setData] = useState<RankedData>(EMPTY)
  const [now, setNow] = useState<NowPlayingData | null>(null)
  const [recent, setRecent] = useState<RecentPlay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ── One ranked fetch feeds every analyzer; range switches are instant. ──
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [rRes, recRes] = await Promise.all([
        fetch('/api/spotify/ranked'),
        fetch('/api/spotify/recent'),
      ])
      if (!rRes.ok) throw new Error('fetch failed')
      setData(await rRes.json())
      setRecent(recRes.ok ? await recRes.json() : [])
    } catch {
      setError('Could not reach the Spotify API. This is a live error state. Try again shortly.')
      setData(EMPTY)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // ── Now Playing: poll every 8s, pause when the tab is hidden. ──
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    let alive = true
    const tick = async () => {
      if (document.hidden) return
      try {
        const res = await fetch('/api/spotify/nowplaying', { cache: 'no-store' })
        if (alive && res.ok) setNow(await res.json())
      } catch {
        /* leave last-known state */
      }
    }
    tick()
    pollRef.current = setInterval(tick, 8000)
    const onVis = () => {
      if (!document.hidden) tick()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      alive = false
      if (pollRef.current) clearInterval(pollRef.current)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const artistsForRange = data.artists[range] ?? []
  const tracksForRange = data.tracks[range] ?? []
  const isEmpty = !loading && !error && artistsForRange.length === 0 && tracksForRange.length === 0
  const isLive = !loading && !error && !isEmpty

  const rangeLabel = RANGES.find((r) => r.value === range)?.label.toUpperCase() ?? ''
  const blendView = blendViewFrom(blendPayload, blendError)

  const connect = useCallback(() => {
    window.location.href = `/api/spotify/login?range=${RANGES.find((r) => r.value === range)?.sub ?? 'medium_term'}`
  }, [range])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Header / HUD frame */}
      <header className="hud-brackets relative overflow-hidden rounded-xl border border-accent/25 bg-ink-surface/40 p-6 sm:p-8">
        <div className="hud-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-sm">
            <span className="text-accent">~/spotify</span>
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-accent">
                <span aria-hidden className="hud-pulse animate-online-pulse">
                  ●
                </span>
                live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                <span aria-hidden style={{ color: '#E8B84B' }}>
                  ○
                </span>
                {error ? 'error' : isEmpty ? 'offline' : 'connecting'}
              </span>
            )}
          </div>
          <h1 className="mt-4 font-sans text-3xl font-semibold text-ink-text sm:text-4xl">
            Listening telemetry
          </h1>
          <p className="mt-2 max-w-2xl font-sans text-base text-zinc-400">
            A live command center for my taste, pulled straight from the Spotify API: what
            I&apos;m playing now, how my rotation drifts over time, the eras and constellations
            it maps to, and a signal-lock blend you can run against your own.
          </p>
        </div>
      </header>

      {/* Now Playing telemetry strip */}
      {now && (
        <div className="mt-6">
          <NowPlaying {...now} />
        </div>
      )}

      {loading ? (
        <div className="mt-8 grid gap-8" aria-busy>
          <div className="h-32 animate-pulse rounded-xl border border-ink-border bg-ink-surface/40" />
          <div className="h-[440px] animate-pulse rounded-xl border border-ink-border bg-ink-surface/40" />
        </div>
      ) : error ? (
        <div className="mt-8 rounded-xl border border-gold/30 bg-gold/5 p-6">
          <p className="font-mono text-sm text-gold">api unreachable</p>
          <p className="mt-2 font-sans text-sm text-zinc-400">{error}</p>
          <button
            onClick={load}
            className="mt-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-xs text-accent hover:bg-accent/20"
          >
            retry
          </button>
        </div>
      ) : isEmpty ? (
        <div className="mt-8 rounded-xl border border-gold/30 bg-gold/5 p-6">
          <p className="font-mono text-sm text-gold">listening data offline</p>
          <p className="mt-2 font-sans text-sm text-zinc-400">
            The Spotify connection isn&apos;t returning data right now (the owner token is missing
            or expired). This is a real state, not a placeholder.
          </p>
          <button
            onClick={load}
            className="mt-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-xs text-accent hover:bg-accent/20"
          >
            retry
          </button>
        </div>
      ) : (
        <>
          {/* System manifest spec-sheet */}
          {data.manifest.length > 0 && (
            <section className="mt-8">
              <SystemManifest stats={data.manifest} />
            </section>
          )}

          {/* Controls */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex rounded-lg border border-ink-border bg-ink-surface/40 p-1 font-mono text-xs">
              {RANGES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRange(r.value)}
                  className={clsx(
                    'rounded px-3 py-1.5 transition-colors',
                    range === r.value ? 'bg-accent/15 text-accent' : 'text-ink-muted hover:text-ink-text'
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className="inline-flex rounded-lg border border-ink-border bg-ink-surface/40 p-1 font-mono text-xs">
              {(['artists', 'tracks'] as View[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={clsx(
                    'rounded px-3 py-1.5 transition-colors',
                    view === v ? 'bg-accent/15 text-accent' : 'text-ink-muted hover:text-ink-text'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Hero: Taste Constellation */}
          <section className="mt-8">
            <SectionHeading label="taste constellation" />
            <TasteConstellation artists={artistsForRange} windowLabel={rangeLabel} />
          </section>

          {/* Analyzers: drift + era */}
          <section className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeading label="taste drift" />
              <TasteDrift artists={data.artists} />
            </div>
            <div>
              <SectionHeading label="era spectrum" />
              <EraSpectrum tracks={tracksForRange} />
            </div>
          </section>

          {/* Top lists + recently played */}
          <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
            <div>
              <SectionHeading label={view === 'artists' ? 'top artists' : 'top tracks'} />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {view === 'artists'
                  ? artistsForRange.slice(0, 12).map((a, i) => (
                      <MediaCard
                        key={a.id || i}
                        index={i}
                        coverImage={a.image}
                        title={a.name}
                        subtitle={a.genres[0]}
                        url={a.url}
                      />
                    ))
                  : tracksForRange.slice(0, 12).map((t, i) => (
                      <MediaCard
                        key={t.id || i}
                        index={i}
                        coverImage={t.image}
                        title={t.name}
                        subtitle={t.artist}
                        url={t.url}
                      />
                    ))}
              </div>
            </div>
            <div>
              <SectionHeading label="recently played" />
              {recent.length > 0 ? (
                <RecentlyPlayed plays={recent} />
              ) : (
                <p className="font-mono text-xs text-ink-muted">
                  recently-played feed offline (owner token needs the player scope).
                </p>
              )}
            </div>
          </section>
        </>
      )}

      {/* Headline interactive feature: Signal-Lock Blend */}
      <section className="mt-12">
        <SectionHeading label="signal-lock blend" />
        <BlendRadar view={blendView} owner={data.signature} onConnect={connect} />
      </section>
    </div>
  )
}
