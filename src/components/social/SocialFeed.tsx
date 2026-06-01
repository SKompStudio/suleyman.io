'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSwipeable } from 'react-swipeable'
import { FaInstagram, FaSpotify, FaGithub } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import {
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiPause,
} from 'react-icons/fi'

import type { IgPost } from '@/lib/fetchInstagram'

const display = (p: IgPost) =>
  p.media_type === 'VIDEO' ? p.thumbnail_url || p.media_url : p.media_url

// Circular offset of card `i` from the active card, wrapped to [-n/2, n/2].
function offsetOf(i: number, active: number, n: number) {
  let o = i - active
  if (o > n / 2) o -= n
  if (o < -n / 2) o += n
  return o
}

function cardTransform(offset: number): React.CSSProperties {
  const abs = Math.abs(offset)
  if (abs > 2) {
    return { opacity: 0, pointerEvents: 'none', transform: 'translateX(0) scale(0.5)' }
  }
  const sign = Math.sign(offset)
  const translateX = offset * 232
  const rotateY = -sign * Math.min(abs, 2) * 30
  const scale = abs === 0 ? 1.06 : abs === 1 ? 0.82 : 0.64
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.6 : 0.24
  return {
    transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity,
    zIndex: 30 - abs * 10,
    pointerEvents: abs === 0 ? 'auto' : 'none',
  }
}

const INTEGRATIONS = [
  { label: 'instagram', icon: FaInstagram, href: '#', live: true },
  { label: 'spotify', icon: FaSpotify, href: '/spotify', live: true },
  { label: 'leetcode', icon: SiLeetcode, href: '/leetcode', live: true },
  { label: 'github', icon: FaGithub, href: 'https://github.com/kianis4', live: true },
]

function Eyebrow({ children }: { children: string }) {
  return <p className="font-mono text-sm text-accent">{children}</p>
}

function IntegrationRail() {
  return (
    <div className="mt-12 rounded-xl border border-ink-border bg-ink-surface/30 p-4">
      <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
        connected integrations
      </div>
      <div className="flex flex-wrap gap-2">
        {INTEGRATIONS.map(({ label, icon: Icon, href, live }) => {
          const inner = (
            <span className="inline-flex items-center gap-2 rounded-md border border-ink-border bg-ink-bg/60 px-3 py-1.5 font-mono text-xs text-ink-muted transition-colors hover:border-accent/40 hover:text-accent">
              <Icon className="h-3.5 w-3.5" />
              {label}
              {live && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
            </span>
          )
          return href.startsWith('http') ? (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer">
              {inner}
            </a>
          ) : href === '#' ? (
            <span key={label} className="cursor-default">
              {inner}
            </span>
          ) : (
            <Link key={label} href={href}>
              {inner}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function OfflinePanel() {
  return (
    <div className="mx-auto mt-10 max-w-xl rounded-xl border border-ink-border bg-ink-surface/30 p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/5">
        <FaInstagram className="h-6 w-6 text-gold" />
      </div>
      <p className="font-mono text-sm text-ink-text">
        <span className="text-gold">○ feed offline</span> — access token missing or expired
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">
        The feed pulls live from the Instagram Graph API. Set a valid{' '}
        <span className="font-mono text-accent">INSTAGRAM_ACCESS_TOKEN</span> and it
        reconnects automatically.
      </p>
      <IntegrationRail />
    </div>
  )
}

export function SocialFeed({
  posts,
  status,
}: {
  posts: IgPost[]
  status: 'ok' | 'offline'
}) {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const n = posts.length

  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + n) % n),
    [n]
  )

  // Autoplay — paused on hover/focus via the wrapper handlers below.
  const hovering = useRef(false)
  useEffect(() => {
    if (!playing || n < 2) return
    const id = window.setInterval(() => {
      if (!hovering.current) setActive((i) => (i + 1) % n)
    }, 4500)
    return () => window.clearInterval(id)
  }, [playing, n])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const swipe = useSwipeable({
    onSwipedLeft: () => go(1),
    onSwipedRight: () => go(-1),
    trackMouse: true,
  })

  const current = posts[active]

  return (
    <div>
      {/* Header strip */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>~/social</Eyebrow>
          <h1 className="mt-3 text-4xl font-normal tracking-tight text-ink-text sm:text-5xl">
            Social.
          </h1>
          <p className="mt-3 max-w-xl text-base text-zinc-400">
            A live feed off the Instagram Graph API, plus the other services this
            site speaks to. Real integrations, not screenshots.
          </p>
        </div>
        <div className="font-mono text-xs text-ink-muted">
          {status === 'ok' && n > 0 ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> feed online ·{' '}
              <span className="text-ink-text">{n}</span> posts
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> feed offline
            </span>
          )}
        </div>
      </div>

      {status !== 'ok' || n === 0 ? (
        <OfflinePanel />
      ) : (
        <>
          {/* Stage */}
          <div
            {...swipe}
            onMouseEnter={() => (hovering.current = true)}
            onMouseLeave={() => (hovering.current = false)}
            className="hud-brackets relative mt-10 overflow-hidden rounded-2xl border border-ink-border bg-ink-bg"
          >
            {/* Ambient: active image blurred + HUD grid + cyan glow */}
            <div className="pointer-events-none absolute inset-0 -z-0">
              <div
                key={current?.id}
                className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl transition-all duration-1000"
                style={{ backgroundImage: current ? `url(${display(current)})` : undefined }}
              />
              <div className="hud-grid absolute inset-0 opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-bg via-ink-bg/40 to-ink-bg" />
            </div>

            {/* Coverflow */}
            <div
              className="relative flex h-[460px] items-center justify-center"
              style={{ perspective: '1400px' }}
            >
              {posts.map((p, i) => {
                const offset = offsetOf(i, active, n)
                if (Math.abs(offset) > 2) return null
                return (
                  <button
                    key={p.id}
                    onClick={() => (offset === 0 ? undefined : go(offset > 0 ? 1 : -1))}
                    aria-label={offset === 0 ? 'Current post' : 'Go to post'}
                    className="absolute h-[380px] w-[300px] transition-all duration-500 ease-out [transform-style:preserve-3d]"
                    style={cardTransform(offset)}
                  >
                    <span
                      className={`block h-full w-full overflow-hidden rounded-xl border ${
                        offset === 0
                          ? 'border-accent/60 shadow-[0_0_40px_-8px_rgba(91,200,255,0.55)]'
                          : 'border-ink-border'
                      }`}
                    >
                      {/* IG CDN URLs are signed/expiring with rotating hostnames —
                          a plain img is the robust choice over next/image here. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={display(p)}
                        alt={p.caption?.slice(0, 80) || 'Instagram post'}
                        loading={Math.abs(offset) <= 1 ? 'eager' : 'lazy'}
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Controls */}
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full border border-ink-border bg-ink-bg/70 p-3 text-ink-text backdrop-blur transition-colors hover:border-accent/50 hover:text-accent"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full border border-ink-border bg-ink-bg/70 p-3 text-ink-text backdrop-blur transition-colors hover:border-accent/50 hover:text-accent"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>

            {/* Meta bar */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-t border-ink-border bg-ink-bg/70 px-5 py-3 backdrop-blur">
              <div className="flex items-center gap-3 font-mono text-xs text-ink-muted">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="inline-flex items-center gap-1.5 text-ink-text transition-colors hover:text-accent"
                  aria-label={playing ? 'Pause autoplay' : 'Play autoplay'}
                >
                  {playing ? <FiPause className="h-3.5 w-3.5" /> : <FiPlay className="h-3.5 w-3.5" />}
                </button>
                <span className="text-accent">{String(active + 1).padStart(2, '0')}</span>
                <span className="text-ink-border">/</span>
                <span>{String(n).padStart(2, '0')}</span>
                {current?.timestamp && (
                  <>
                    <span className="text-ink-border">·</span>
                    <span>{new Date(current.timestamp).toLocaleDateString()}</span>
                  </>
                )}
              </div>
              {current?.permalink && (
                <a
                  href={current.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-accent underline-offset-4 hover:underline"
                >
                  view on instagram <FiArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Caption */}
          {current?.caption && (
            <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-zinc-400">
              {current.caption.length > 220
                ? `${current.caption.slice(0, 220)}…`
                : current.caption}
            </p>
          )}

          {/* Dots */}
          {n > 1 && (
            <div className="mt-5 flex flex-wrap justify-center gap-1.5">
              {posts.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActive(i)}
                  aria-label={`Go to post ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? 'w-5 bg-accent' : 'w-1.5 bg-ink-border hover:bg-accent/40'
                  }`}
                />
              ))}
            </div>
          )}

          <IntegrationRail />
        </>
      )}
    </div>
  )
}
