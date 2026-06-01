'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import type { BlendResult } from '@/lib/spotify'
import type { TimeRange } from '@/lib/spotify'

// Human copy for each graceful-degradation reason the callback can return.
const ERROR_COPY: Record<string, { title: string; body: string }> = {
  not_whitelisted: {
    title: 'account not on the allow-list',
    body:
      "Spotify is in development mode, so only a handful of manually-approved accounts can run the blend. Your account isn't on the list yet — nothing broke, the app just needs Spotify's extended-quota approval (or your email added) to open this to everyone.",
  },
  denied: {
    title: 'authorization cancelled',
    body: 'You declined the Spotify permission prompt. No data was read. Reconnect any time to run the blend.',
  },
  scope: {
    title: 'no listening data',
    body: 'Spotify returned no top-artist data for this account (a brand-new or very quiet account). Listen a little, then try again.',
  },
  token: {
    title: 'sign-in expired',
    body: 'That sign-in link expired before it could be used. Reconnect to try again.',
  },
  state: {
    title: 'session mismatch',
    body: 'The sign-in session did not validate (possibly a stale tab). Start the connect flow again.',
  },
  unknown: {
    title: 'could not complete the blend',
    body: 'Something went wrong talking to Spotify. This is a real error state, not fabricated data — try reconnecting.',
  },
}

function MatchRing({ percent }: { percent: number }) {
  const r = 52
  const len = 2 * Math.PI * r
  const target = len * (1 - percent / 100)
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#1A2330" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="#5BC8FF"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={len}
          className="animate-ring-draw motion-reduce:[animation:none]"
          style={
            {
              '--ring-len': `${len}`,
              '--ring-target': `${target}`,
              strokeDashoffset: target,
              filter: 'drop-shadow(0 0 6px rgba(91,200,255,0.6))',
            } as React.CSSProperties
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
        <span className="text-3xl font-semibold text-ink-text">{percent}%</span>
        <span className="text-[0.65rem] tracking-widest text-accent/70">MATCH</span>
      </div>
    </div>
  )
}

function BlendReveal({ result }: { result: BlendResult }) {
  const [revealed, setRevealed] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reduced-motion: skip the scan, show final state immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true)
      return
    }
    const id = window.setTimeout(() => setRevealed(true), 650)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div
      ref={ref}
      className="hud-brackets relative overflow-hidden rounded-xl border border-accent/30 bg-ink-surface/50 p-6 sm:p-8"
    >
      <div className="hud-glow pointer-events-none absolute inset-0" aria-hidden />

      {/* One-shot scan band that sweeps down as the vault unlocks. */}
      {!revealed && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 animate-blend-scan bg-gradient-to-b from-accent/0 via-accent/40 to-accent/0"
        />
      )}

      <div className="relative font-mono text-xs text-accent/70">
        <span className="text-accent">~/blend</span> · taste compatibility
      </div>

      <div
        className={clsx(
          'relative mt-6 motion-safe:animate-blend-unlock',
          !revealed && 'motion-safe:opacity-0'
        )}
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
          <MatchRing percent={result.matchPercent} />
          <div className="text-center sm:text-left">
            <p className="font-sans text-lg text-ink-text">
              {result.matchPercent >= 60
                ? 'Strong overlap — we listen on the same wavelength.'
                : result.matchPercent >= 30
                  ? 'Some real common ground in here.'
                  : 'Different lanes, but a few shared threads.'}
            </p>
            <p className="mt-2 font-mono text-xs text-ink-muted">
              {result.sharedArtistCount} shared {result.sharedArtistCount === 1 ? 'artist' : 'artists'} ·{' '}
              {result.sharedGenreCount} shared {result.sharedGenreCount === 1 ? 'genre' : 'genres'}
            </p>
            {result.visitorTopGenre && (
              <p className="mt-1 font-mono text-xs text-ink-muted">
                your top genre: <span className="text-accent/80">{result.visitorTopGenre}</span>
                {result.ownerTopGenre && (
                  <>
                    {' '}· mine: <span className="text-accent/80">{result.ownerTopGenre}</span>
                  </>
                )}
              </p>
            )}
          </div>
        </div>

        {result.sharedArtists.length > 0 && (
          <div className="mt-8">
            <h3 className="font-mono text-xs uppercase tracking-widest text-accent/70">
              shared artists
            </h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {result.sharedArtists.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 py-1 pl-1 pr-3"
                >
                  {a.coverImage ? (
                    <Image
                      src={a.coverImage}
                      alt={a.name}
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="h-7 w-7 rounded-full bg-ink-border" />
                  )}
                  <span className="font-sans text-sm text-ink-text">{a.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.sharedGenres.length > 0 && (
          <div className="mt-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-accent/70">
              shared genres
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.sharedGenres.map((g) => (
                <span
                  key={g}
                  className="rounded border border-accent/20 bg-accent/5 px-2 py-1 font-mono text-xs text-accent/80"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ConnectCta({ range }: { range: TimeRange }) {
  return (
    <a
      href={`/api/spotify/login?range=${range}`}
      className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-5 py-2.5 font-mono text-sm text-accent transition-colors hover:bg-accent/20"
    >
      <span aria-hidden className="hud-pulse animate-online-pulse">
        ●
      </span>
      connect your spotify
    </a>
  )
}

export function SpotifyBlend({
  range,
  blendPayload,
  blendError,
}: {
  range: TimeRange
  blendPayload?: string
  blendError?: string
}) {
  let result: BlendResult | null = null
  if (blendPayload) {
    try {
      result = JSON.parse(decodeBase64Url(blendPayload)) as BlendResult
    } catch {
      result = null
    }
  }

  return (
    <section className="mt-16 w-full">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-accent/80">
          // blend
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" />
      </div>
      <p className="mb-6 max-w-2xl font-sans text-base text-zinc-400">
        Connect your Spotify and I&apos;ll compute how closely our taste lines up — shared
        artists, overlapping genres, and a weighted match score. Your token is exchanged
        server-side and never stored; only the computed result comes back.
      </p>

      {result ? (
        <>
          <BlendReveal result={result} />
          <div className="mt-4">
            <ConnectCta range={range} />
            <span className="ml-3 font-mono text-xs text-ink-muted">run it again</span>
          </div>
        </>
      ) : blendError ? (
        <div className="rounded-xl border border-gold/30 bg-gold/5 p-6">
          <p className="font-mono text-sm text-gold">
            {(ERROR_COPY[blendError] ?? ERROR_COPY.unknown).title}
          </p>
          <p className="mt-2 max-w-2xl font-sans text-sm text-zinc-400">
            {(ERROR_COPY[blendError] ?? ERROR_COPY.unknown).body}
          </p>
          <div className="mt-4">
            <ConnectCta range={range} />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-ink-border bg-ink-surface/40 p-6">
          <ConnectCta range={range} />
          <p className="mt-4 max-w-2xl font-mono text-xs text-ink-muted">
            note: this Spotify app is in development mode. Until it&apos;s granted extended
            quota, only allow-listed accounts can complete the connect — others get a clean
            explainer, not a crash.
          </p>
        </div>
      )}
    </section>
  )
}

function decodeBase64Url(s: string): string {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  return decodeURIComponent(
    atob(b64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
}
