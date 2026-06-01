'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import clsx from 'clsx'
import {
  TIME_RANGES,
  isTimeRange,
  type TimeRange,
  type ArtistCard,
  type TrackCard,
  type GenreWeight,
  type AudioSummary,
} from '@/lib/spotify'
import { SpotifyBlend } from './SpotifyBlend'

type View = 'artists' | 'tracks'

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-accent/80">// {label}</h2>
      <div className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" />
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-ink-border bg-ink-surface/40">
          <div className="aspect-square w-full animate-pulse bg-ink-border/40" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-1/3 animate-pulse rounded bg-ink-border/40" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-ink-border/40" />
          </div>
        </div>
      ))}
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

function GenrePanel({ genres }: { genres: GenreWeight[] }) {
  if (genres.length === 0) return null
  const max = genres[0]?.count ?? 1
  const top = genres.slice(0, 10)
  return (
    <div className="rounded-xl border border-ink-border bg-ink-surface/40 p-5">
      <SectionHeading label="genres" />
      <ul className="space-y-2.5">
        {top.map((g) => (
          <li key={g.genre} className="flex items-center gap-3">
            <span className="w-40 shrink-0 truncate font-mono text-xs text-ink-muted">{g.genre}</span>
            <span className="relative h-2 flex-1 overflow-hidden rounded bg-ink-border/40">
              <span
                className="absolute inset-y-0 left-0 rounded bg-accent/60"
                style={{ width: `${Math.max(6, (g.count / max) * 100)}%` }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function AudioPanel({ audio }: { audio: AudioSummary }) {
  const metrics: { k: string; v: number }[] = [
    { k: 'energy', v: audio.energy },
    { k: 'danceability', v: audio.danceability },
    { k: 'valence', v: audio.valence },
    { k: 'acousticness', v: audio.acousticness },
  ]
  return (
    <div className="rounded-xl border border-ink-border bg-ink-surface/40 p-5">
      <SectionHeading label="audio profile" />
      {audio.available ? (
        <dl className="space-y-3">
          {metrics.map((m) => (
            <div key={m.k}>
              <div className="flex items-baseline justify-between font-mono text-xs">
                <dt className="text-ink-muted">{m.k}</dt>
                <dd className="text-accent/80">{Math.round(m.v * 100)}</dd>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded bg-ink-border/40">
                <div className="h-full rounded bg-accent/50" style={{ width: `${m.v * 100}%` }} />
              </div>
            </div>
          ))}
        </dl>
      ) : (
        <p className="font-mono text-xs text-ink-muted">
          audio-features unavailable for this app — Spotify deprecated the endpoint for newly
          registered apps. (Real state, not a placeholder.)
        </p>
      )}
    </div>
  )
}

export function SpotifyDashboard() {
  const params = useSearchParams()
  const blendPayload = params.get('blend') ?? undefined
  const blendError = params.get('blend_error') ?? undefined
  const rangeParam = params.get('range')

  const [range, setRange] = useState<TimeRange>(
    isTimeRange(rangeParam) ? rangeParam : 'medium_term'
  )
  const [view, setView] = useState<View>('artists')
  const [artists, setArtists] = useState<ArtistCard[]>([])
  const [tracks, setTracks] = useState<TrackCard[]>([])
  const [genres, setGenres] = useState<GenreWeight[]>([])
  const [audio, setAudio] = useState<AudioSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [aRes, tRes, pRes] = await Promise.all([
        fetch(`/api/topArtists?range=${range}`),
        fetch(`/api/topTracks?range=${range}`),
        fetch(`/api/spotify/profile?range=${range}`),
      ])
      if (!aRes.ok || !tRes.ok) throw new Error('fetch failed')
      setArtists(await aRes.json())
      setTracks(await tRes.json())
      if (pRes.ok) {
        const profile = await pRes.json()
        setGenres(profile.genres ?? [])
        setAudio(profile.audio ?? null)
      } else {
        setGenres([])
        setAudio(null)
      }
    } catch {
      setError('Could not reach the Spotify API. This is a live error state — try again shortly.')
    } finally {
      setLoading(false)
    }
  }, [range])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Header / HUD frame */}
      <header className="hud-brackets relative overflow-hidden rounded-xl border border-accent/25 bg-ink-surface/40 p-6 sm:p-8">
        <div className="hud-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-sm">
            <span className="text-accent">~/spotify</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-accent">
              <span aria-hidden className="hud-pulse animate-online-pulse">
                ●
              </span>
              live
            </span>
          </div>
          <h1 className="mt-4 font-sans text-3xl font-semibold text-ink-text sm:text-4xl">
            Listening readout
          </h1>
          <p className="mt-2 max-w-2xl font-sans text-base text-zinc-400">
            A live window into what I&apos;m playing — top artists, tracks, genres, and an audio-feature
            summary, pulled from the Spotify API. Then connect your own to run a taste blend.
          </p>
        </div>
      </header>

      {/* Controls: time-range + view toggle */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-lg border border-ink-border bg-ink-surface/40 p-1 font-mono text-xs">
          {TIME_RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={clsx(
                'rounded px-3 py-1.5 transition-colors',
                range === r.value
                  ? 'bg-accent/15 text-accent'
                  : 'text-ink-muted hover:text-ink-text'
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

      {/* Main grid: cards + side panels */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <section>
          <SectionHeading label={view === 'artists' ? 'top artists' : 'top tracks'} />
          {error ? (
            <div className="rounded-xl border border-gold/30 bg-gold/5 p-6">
              <p className="font-mono text-sm text-gold">api unreachable</p>
              <p className="mt-2 font-sans text-sm text-zinc-400">{error}</p>
              <button
                onClick={load}
                className="mt-4 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-xs text-accent hover:bg-accent/20"
              >
                retry
              </button>
            </div>
          ) : loading ? (
            <CardSkeleton />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {view === 'artists'
                ? artists.map((a, i) => (
                    <MediaCard
                      key={a.id || i}
                      index={i}
                      coverImage={a.coverImage}
                      title={a.title}
                      subtitle={a.genres[0]}
                      url={a.url}
                    />
                  ))
                : tracks.map((t, i) => (
                    <MediaCard
                      key={t.id || i}
                      index={i}
                      coverImage={t.coverImage}
                      title={t.title}
                      subtitle={t.artist}
                      url={t.url}
                    />
                  ))}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          {!loading && !error && <GenrePanel genres={genres} />}
          {!loading && !error && audio && <AudioPanel audio={audio} />}
        </aside>
      </div>

      {/* The headline feature */}
      <SpotifyBlend range={range} blendPayload={blendPayload} blendError={blendError} />
    </div>
  )
}
