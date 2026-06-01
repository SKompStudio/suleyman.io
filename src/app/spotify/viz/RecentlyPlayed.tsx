'use client'

// ── RECENTLY PLAYED — activity log ───────────────────────────────────────────
// A live console manifest: each play is a log-line with a relative timestamp
// (clock + "Xm ago"), track title, artist, and a tiny album-art chip. The most
// recent line burns gold; older lines fade to muted. Lines stagger in via
// opacity + translateY on mount and whenever new entries arrive at the head.
//
// PRESENTATIONAL: receives RecentPlay[] and renders. No popularity, no audio
// features — neither exist on the prop type. image/url are optional and the
// art chip degrades to a mono initial-glyph when absent.
//
// ── ELEVATION (animation pass) ───────────────────────────────────────────────
// The whole panel is choreographed as a console "boot", but only once it
// scrolls into view (IntersectionObserver — nothing animates offscreen):
//   1. a single cyan scan-band sweeps top→bottom across the surface as it wakes
//   2. the header's hairline underline draws left→right (scaleX origin-left)
//   3. the log count counts up 0 → N via requestAnimationFrame
//   4. log-lines cascade in (opacity + translateY), staggered head-first
// Continuous ambient life: the head row carries a slow scan-shimmer and a
// breathing telemetry bar that ticks the live age of the freshest play; the
// status dot keeps its online pulse. Hover lifts a row a hair and slides a cyan
// edge cursor in. Every motion is transform/opacity ONLY (the scan-band rides a
// transform, the underline a scaleX, the shimmer a translateX). Under
// prefers-reduced-motion EVERYTHING folds to its final composed state with zero
// animation — the global CSS floor plus the JS gates below.

import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import type { RecentPlay } from './types'
import { fxRecentPlays } from './fixtures'

// Local motion floor — narrows after mount to avoid a hydration mismatch (server
// renders the motion-on default). The global CSS floor still hard-kills any
// animation under reduced motion regardless; this gates the JS stagger.
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

// View-trigger: arms the entrance choreography only once the panel is on screen
// so nothing animates offscreen. Resolves to shown=true immediately under
// reduced motion or when IntersectionObserver is unavailable (the final layout
// box is occupied from frame 1 either way). Fires once, then disconnects.
function useInView<T extends Element>(reduced: boolean) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true)
            obs.disconnect()
          }
        }
      },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reduced])
  return { ref, shown }
}

// Count-up on a small integer via requestAnimationFrame. Eases out so the final
// value lands softly. Snaps to the target instantly when not armed (reduced
// motion / pre-view) so the composed state is always correct.
function useCountUp(target: number, run: boolean, durationMs = 620): number {
  const [val, setVal] = useState(run ? 0 : target)
  useEffect(() => {
    if (!run) {
      setVal(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run, durationMs])
  return val
}

// ── relative-time formatting ─────────────────────────────────────────────────
// Two faces per line: a 24h wall-clock stamp ("14:32") and a coarse relative
// age ("8m ago"). Computed against a single "now" captured per render tick so
// the whole list is internally consistent.

function clockOf(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '--:--'
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

function agoOf(iso: string, now: number): string {
  const d = new Date(iso).getTime()
  if (Number.isNaN(d)) return ''
  const secs = Math.max(0, Math.round((now - d) / 1000))
  if (secs < 45) return 'just now'
  const mins = Math.round(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}

// Fraction-into-the-current-minute for the head row's breathing telemetry bar:
// the live "seconds since this play, mod 60" mapped to 0..1. Drives a scaleX so
// the freshest entry visibly counts time. Purely decorative; degrades to a full
// bar under reduced motion (no second-level ticking there).
function minuteFraction(iso: string, now: number): number {
  const d = new Date(iso).getTime()
  if (Number.isNaN(d)) return 1
  const secs = Math.max(0, (now - d) / 1000)
  return (secs % 60) / 60
}

// A live "now" that ticks once a minute so relative ages stay honest without
// thrashing render. Skipped entirely under reduced motion (the static snapshot
// is taken once at mount). Paused while the tab is backgrounded — a hidden tab
// has no honest "now" to show and the throttled timer just burns wakeups; on
// return to foreground it resyncs immediately so the ages never look stale.
function useNow(reduced: boolean): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (reduced) return
    let id = 0
    const start = () => {
      if (id) return
      setNow(Date.now())
      id = window.setInterval(() => setNow(Date.now()), 60_000)
    }
    const stop = () => {
      if (!id) return
      window.clearInterval(id)
      id = 0
    }
    const onVis = () => (document.hidden ? stop() : start())
    if (!document.hidden) start()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduced])
  return now
}

// A faster pulse — once a second — used ONLY by the head row's telemetry bar so
// the freshest play breathes in real time without re-rendering the whole list.
// Off under reduced motion (the bar then sits static and full). Also paused when
// offscreen (caller passes active=false out of view) and when the tab is hidden,
// so no per-second setState fires while nobody can see the bar. Resyncs on
// return to foreground.
function useSecondTick(active: boolean): number {
  const [t, setT] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    let id = 0
    const start = () => {
      if (id) return
      setT(Date.now())
      id = window.setInterval(() => setT(Date.now()), 1000)
    }
    const stop = () => {
      if (!id) return
      window.clearInterval(id)
      id = 0
    }
    const onVis = () => (document.hidden ? stop() : start())
    if (!document.hidden) start()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [active])
  return t
}

// ── album-art chip ───────────────────────────────────────────────────────────
// 28px square. Real art when present; otherwise a mono glyph from the title so
// the column never collapses (genres/art are frequently sparse).

function ArtChip({ play, head, shimmer }: { play: RecentPlay; head: boolean; shimmer: boolean }) {
  const glyph = (play.name.trim()[0] ?? '·').toUpperCase()
  return (
    <span
      aria-hidden
      className={clsx(
        'relative grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-sm border',
        'transition-transform duration-300 ease-out group-hover:scale-[1.06]',
        head ? 'border-gold/50' : 'border-ink-border',
      )}
      style={head ? { boxShadow: '0 0 8px rgba(232,184,75,0.28)' } : undefined}
    >
      {play.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote
        // CDN art (i.scdn.co); next/image config is a shared file we can't edit.
        <img
          src={play.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className={clsx(
            'font-mono text-[11px] font-semibold',
            head ? 'text-gold' : 'text-ink-muted',
          )}
        >
          {glyph}
        </span>
      )}
      {/* head-only ambient shimmer: a thin diagonal band slides across the chip,
          looping. Pure translateX on an overlay; reduced-motion floor parks it.
          Only mounted when in view so the infinite loop never composites
          offscreen. */}
      {head && shimmer && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 motion-reduce:hidden"
          style={{
            background:
              'linear-gradient(115deg, transparent 38%, rgba(232,184,75,0.5) 50%, transparent 62%)',
            animation: 'rp-chip-shimmer 3.6s ease-in-out infinite',
            willChange: 'transform',
          }}
        />
      )}
    </span>
  )
}

// ── one log-line ─────────────────────────────────────────────────────────────

function LogLine({
  play,
  head,
  now,
  reduced,
  shown,
  inView,
  delay,
  rowRef,
}: {
  play: RecentPlay
  head: boolean
  now: number
  reduced: boolean
  shown: boolean
  inView: boolean
  delay: number
  rowRef: (el: HTMLLIElement | null) => void
}) {
  const clock = clockOf(play.playedAt)
  const ago = agoOf(play.playedAt, now)

  // Head row breathes in real time: a per-second tick drives a tiny scaleX bar
  // showing progress through the current minute. Only the head subscribes, so
  // the rest of the list never re-renders on the second. Gated on inView so the
  // ticker is dormant until the panel is actually visible.
  const secTick = useSecondTick(head && !reduced && inView)
  const frac = head ? minuteFraction(play.playedAt, reduced ? now : secTick) : 0

  const Wrap = play.url ? 'a' : 'div'
  const interactiveProps = play.url
    ? { href: play.url, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <li
      ref={rowRef}
      className={clsx(
        'origin-left transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none',
        // will-change only while the entrance is in flight; dropped once the row
        // is composed so idle rows don't each hold a permanent compositor layer.
        shown ? 'translate-y-0 opacity-100' : 'translate-y-1.5 opacity-0 will-change-transform',
      )}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
    >
      <Wrap
        {...interactiveProps}
        className={clsx(
          'group relative flex items-center gap-3 rounded-sm border-l-2 py-1.5 pl-2 pr-1',
          'transition-[transform,background-color,border-color] duration-200 ease-out',
          'hover:-translate-y-px motion-reduce:hover:translate-y-0',
          head
            ? 'border-gold/70 bg-gold/[0.04]'
            : 'border-transparent hover:border-accent/40 hover:bg-white/[0.02]',
          play.url && 'cursor-pointer',
        )}
      >
        {/* hover edge-cursor: a thin cyan bar wipes in from the left on hover via
            scaleX (transform only). Skipped on the head row (it owns the gold
            edge already). */}
        {!head && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-accent/70 transition-transform duration-200 ease-out group-hover:scale-y-100 motion-reduce:transition-none"
          />
        )}

        <ArtChip play={play} head={head} shimmer={head && inView && !reduced} />

        {/* timestamp column: wall-clock over relative age, fixed width so titles
            align into a clean manifest gutter */}
        <span className="flex w-[5.5rem] shrink-0 flex-col font-mono leading-tight tabular-nums">
          <span className={clsx('text-[11px]', head ? 'text-gold' : 'text-ink-text/80')}>
            {clock}
          </span>
          <span className={clsx('text-[10px]', head ? 'text-gold/70' : 'text-ink-muted')}>
            {ago}
          </span>
        </span>

        {/* track + artist */}
        <span className="flex min-w-0 flex-1 flex-col leading-tight">
          <span
            className={clsx(
              'truncate font-mono text-[13px]',
              head ? 'text-gold' : 'text-ink-text',
            )}
          >
            {play.name}
          </span>
          <span className="truncate font-mono text-[11px] text-ink-muted">{play.artist}</span>
        </span>

        {head && (
          <span className="flex shrink-0 flex-col items-end gap-1">
            <span
              aria-hidden
              className="font-mono text-[9px] uppercase tracking-[0.18em] text-gold/80"
            >
              last
            </span>
            {/* live telemetry bar: scaleX tracks progress through the current
                minute for the freshest play. Transform-only; under reduced
                motion it parks at the snapshot fraction and never ticks. */}
            <span
              aria-hidden
              className="h-px w-9 overflow-hidden rounded-full bg-gold/15"
            >
              <span
                className="block h-full origin-left rounded-full bg-gold/70 transition-transform duration-1000 ease-linear motion-reduce:transition-none"
                style={{ transform: `scaleX(${frac})` }}
              />
            </span>
          </span>
        )}
      </Wrap>
    </li>
  )
}

// ── component ────────────────────────────────────────────────────────────────

export default function RecentlyPlayed({ plays }: { plays: RecentPlay[] }) {
  const reduced = useReducedMotion()
  const now = useNow(reduced)
  const { ref: viewRef, shown: inView } = useInView<HTMLElement>(reduced)

  // Stable identity per play so re-renders don't restage the whole list — a play
  // is keyed by its ISO timestamp (Spotify's recently-played is timestamp-unique).
  const keyed = useMemo(
    () => plays.map((p) => ({ play: p, key: `${p.playedAt}::${p.name}` })),
    [plays],
  )

  // Stagger gate. View-enter (or new entries at the head) triggers the cascade.
  // When new entries arrive at the head, the freshly-keyed rows that weren't
  // shown before replay their entrance; already-shown rows stay put. Under
  // reduced motion the gate is forced fully-shown so nothing animates.
  const seenRef = useRef<Set<string>>(new Set())
  const [shownKeys, setShownKeys] = useState<Set<string>>(() => new Set())
  const rowRefs = useRef<Map<string, HTMLLIElement | null>>(new Map())

  useEffect(() => {
    if (reduced) {
      setShownKeys(new Set(keyed.map((k) => k.key)))
      keyed.forEach((k) => seenRef.current.add(k.key))
      return
    }
    // Hold rows hidden until the panel is in view, then cascade. New head
    // insertions while already in view also flow through here.
    if (!inView) return
    const id = requestAnimationFrame(() => {
      setShownKeys(new Set(keyed.map((k) => k.key)))
      keyed.forEach((k) => seenRef.current.add(k.key))
    })
    return () => cancelAnimationFrame(id)
  }, [keyed, reduced, inView])

  // Count-up arms only once the panel is in view (so the number doesn't burn its
  // animation offscreen). reduced-motion → static final value.
  const countArmed = inView && !reduced
  const liveCount = useCountUp(keyed.length, countArmed)

  const empty = keyed.length === 0

  return (
    <section
      ref={viewRef}
      aria-label="Recently played activity log"
      className="hud-brackets relative overflow-hidden rounded-md border border-ink-border bg-black/30 p-3 sm:p-4"
    >
      {/* one-shot boot scan-band: a thin cyan gradient sweeps top→bottom across
          the surface the first time the panel enters view. translateY only,
          runs once, then idle. Hidden under reduced motion. */}
      {inView && !reduced && (
        <span
          key="rp-scan"
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/3"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(91,200,255,0.16) 50%, transparent 100%)',
            animation: 'rp-boot-scan 1.1s ease-out 1 both',
            willChange: 'transform, opacity',
          }}
        />
      )}

      <header className="relative mb-3 flex items-baseline justify-between gap-3 pb-2">
        {/* drawn underline: a hairline that scales in from the left as the panel
            wakes (scaleX, origin-left). Replaces a static border-b so it can
            animate. Snaps full under reduced motion. */}
        <span
          aria-hidden
          className={clsx(
            'absolute inset-x-0 bottom-0 h-px origin-left bg-ink-border/60 transition-transform duration-700 ease-out motion-reduce:transition-none',
            inView ? 'scale-x-100' : 'scale-x-0',
          )}
        />
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className={clsx(
              'h-1.5 w-1.5 rounded-full bg-accent',
              !reduced && 'animate-online-pulse',
            )}
          />
          <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-text">
            Recently Played
          </h2>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted tabular-nums">
          {empty ? 'no signal' : `${liveCount} log${keyed.length === 1 ? '' : 's'}`}
        </span>
      </header>

      {empty ? (
        <p className="py-6 text-center font-mono text-[11px] text-ink-muted">
          no recent plays on record
        </p>
      ) : (
        <ol className="relative flex flex-col">
          {keyed.map(({ play, key }, i) => {
            // Only first-time-seen rows get a staggered delay; previously-shown
            // rows snap so head-insertions don't restage the tail.
            const isNew = !seenRef.current.has(key)
            const delay = isNew ? Math.min(i, 10) * 55 : 0
            return (
              <LogLine
                key={key}
                play={play}
                head={i === 0}
                now={now}
                reduced={reduced}
                shown={shownKeys.has(key)}
                inView={inView}
                delay={delay}
                rowRef={(el) => {
                  if (el) rowRefs.current.set(key, el)
                  else rowRefs.current.delete(key)
                }}
              />
            )
          })}
        </ol>
      )}

      {/* Component-scoped keyframes. transform/opacity only. The global
          prefers-reduced-motion floor (animation:none !important) neutralizes
          every one of these; the JS gates above also never mount the looping
          overlays under reduced motion. */}
      <style>{`
        @keyframes rp-boot-scan {
          0%   { transform: translateY(-110%); opacity: 0; }
          18%  { opacity: 1; }
          82%  { opacity: 1; }
          100% { transform: translateY(330%); opacity: 0; }
        }
        @keyframes rp-chip-shimmer {
          0%, 100% { transform: translateX(-120%); }
          55%      { transform: translateX(120%); }
        }
      `}</style>
    </section>
  )
}

// ── isolated demo (type-checked preview) ─────────────────────────────────────

export function RecentlyPlayedDemo() {
  return (
    <div className="mx-auto max-w-md bg-ink-bg p-6">
      <RecentlyPlayed plays={fxRecentPlays} />
    </div>
  )
}
