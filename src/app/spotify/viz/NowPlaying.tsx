'use client'

// ── NOW PLAYING telemetry strip ───────────────────────────────────────────────
// A thin command-center status bar for the /spotify viz suite. PRESENTATIONAL:
// it receives a NowPlaying shape (see ./types) and renders. No data fetching,
// no popularity, no audio-features — only the fields the prop type carries.
//
// PLAYING:  online-pulse dot · live equalizer · album thumb · marquee title/artist
//           · OUTPUT/SHUFFLE/VOL readout · mm:ss / mm:ss timecode · hairline cyan
//           progress bar that advances in real time. Elapsed is recomputed
//           client-side via rAF from progressMs toward durationMs; the fill is a
//           transform: scaleX() only (never width), with a leading glow node
//           riding the fill edge. A faint cyan scan sweeps the strip ambiently.
// IDLE:     gold idle ring · "OFFLINE // LAST SEEN <track> at <relative time>".
//
// MOTION DESIGN (the elevation):
//  - Entrance choreography is IntersectionObserver-gated so nothing animates
//    offscreen. On first reveal the parts stagger in (opacity + translateY),
//    the total-duration timecode COUNTS UP via rAF, and the progress fill
//    DRAWS IN from scaleX(0) to the live ratio before handing off to live
//    tracking. All transform/opacity — never width/height/top/left.
//  - Ambient life while playing: the online-pulse dot, a 3-bar equalizer, a
//    leading-edge glow twinkle, and a slow scan band crossing the strip.
//  - Hover feedback: the thumb lifts + brightens (transform/opacity only).
//  - Reduced-motion floor: the strip shows its fully-composed final state with
//    NO motion — marquee truncates, fill sits at the live ratio, count-up jumps
//    to final, every loop is stilled. Enforced both per-component and by the
//    global CSS floor (animation/transition: none !important).

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import type { NowPlaying as NowPlayingData } from './types'
import { fxNowPlaying } from './fixtures'

const CYAN = '#5BC8FF'
const GOLD = '#E8B84B'

// Local motion-floor hook — server renders motion-on, client narrows after mount
// (mirrors the terminal's useReducedMotion; kept inline so this file is
// self-contained and can be type-checked in isolation).
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

// ── In-view gate ──────────────────────────────────────────────────────────────
// Entrance motion fires once the strip first reaches the viewport, and the live
// loop is paused whenever the strip leaves it again. `entered` latches true on
// the first reveal (drives the one-shot entrance choreography); `onScreen`
// tracks current visibility so the per-frame elapsed loop can idle offscreen.
// Under reduced motion (or no IO support) both resolve true immediately so the
// final composed state is present from frame 1 with no animation.
function useInView<T extends Element>(reduced: boolean) {
  const ref = useRef<T | null>(null)
  const [entered, setEntered] = useState(false)
  const onScreenRef = useRef(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setEntered(true)
      onScreenRef.current = true
      return
    }
    onScreenRef.current = false
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          onScreenRef.current = e.isIntersecting
          if (e.isIntersecting) setEntered(true)
        }
      },
      { threshold: 0.35 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reduced])
  return { ref, entered, onScreenRef }
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n))
}

function formatClock(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return 'recently'
  const secs = Math.max(0, Math.round((Date.now() - then) / 1000))
  if (secs < 45) return 'moments ago'
  const mins = Math.round(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}

// easeOutCubic — used for the one-shot count-up and progress draw-in so they
// decelerate into their resting value rather than landing linearly.
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// ── Count-up: animate a number from 0 → target once, when triggered ──────────
// Drives the total-duration timecode on first reveal by writing textContent
// directly to a ref'd node — no per-frame React state, so the tree never
// re-renders during the count. Reduced motion (or untriggered) writes the final
// value immediately with no rAF.
function useCountUp(
  nodeRef: React.RefObject<HTMLSpanElement | null>,
  target: number,
  run: boolean,
  reduced: boolean,
  ms = 900,
) {
  useEffect(() => {
    const node = nodeRef.current
    if (!node) return
    if (reduced || !run) {
      node.textContent = formatClock(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = clamp((now - start) / ms, 0, 1)
      node.textContent = formatClock(Math.round(easeOutCubic(t) * target))
      if (t < 1) raf = requestAnimationFrame(tick)
      else node.textContent = formatClock(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [nodeRef, target, run, reduced, ms])
}

// ── Album-art thumb with a graceful fallback when no image is present ─────────
// Hover lifts + brightens via transform/opacity only. A faint corner reticle
// twinkles when motion is allowed, selling "live feed" without re-layout.
function Thumb({
  src,
  alt,
  ring,
  reduced,
  twinkle,
}: {
  src?: string
  alt: string
  ring: string
  reduced: boolean
  twinkle: boolean
}) {
  const [failed, setFailed] = useState(false)
  const show = src && !failed
  return (
    <div
      className={clsx(
        'group/thumb np-thumb relative h-10 w-10 shrink-0 overflow-hidden rounded-sm border border-ink-border bg-black/50',
        'transition-transform duration-300 ease-out hover:scale-[1.06] motion-reduce:transition-none motion-reduce:hover:scale-100',
      )}
      style={{ boxShadow: `0 0 10px ${ring}33` }}
    >
      {show ? (
        // Plain <img>: arbitrary scdn.co art needs no next/image domain config,
        // and a 40px thumb gains nothing from the optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-[filter] duration-300 group-hover/thumb:brightness-110 motion-reduce:transition-none"
        />
      ) : (
        <span
          aria-hidden
          className="flex h-full w-full items-center justify-center font-mono text-[9px] uppercase tracking-widest text-ink-muted"
        >
          ♪
        </span>
      )}
      {/* Corner reticle — opacity twinkle only; static under reduced motion. */}
      {twinkle && !reduced && (
        <span
          aria-hidden
          className="np-twinkle pointer-events-none absolute right-0.5 top-0.5 h-1 w-1 rounded-full"
          style={{ backgroundColor: ring, boxShadow: `0 0 4px ${ring}` }}
        />
      )}
      {/* Hover sheen — a soft inner cyan edge that fades in on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 group-hover/thumb:opacity-100 motion-reduce:transition-none"
        style={{ boxShadow: `inset 0 0 0 1px ${ring}55` }}
      />
    </div>
  )
}

// ── Scrolling title/artist marquee ────────────────────────────────────────────
// Scrolls via translateX only, and ONLY when the text actually overflows its
// track AND motion is allowed. Otherwise it truncates. The duplicate copy makes
// the loop seamless; aria-hidden on the clone keeps screen readers clean.
function Marquee({
  text,
  reduced,
  nodeRef,
}: {
  text: string
  reduced: boolean
  nodeRef: React.RefObject<HTMLDivElement | null>
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const measureRef = useRef<HTMLSpanElement | null>(null)
  const [overflow, setOverflow] = useState(false)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    if (reduced) {
      setOverflow(false)
      return
    }
    const measure = () => {
      const vp = viewportRef.current
      const span = measureRef.current
      if (!vp || !span) return
      const over = span.scrollWidth - vp.clientWidth
      setOverflow(over > 4)
      setDistance(over > 4 ? span.scrollWidth + 32 : 0)
    }
    measure()
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    if (ro && viewportRef.current) ro.observe(viewportRef.current)
    return () => ro?.disconnect()
  }, [text, reduced])

  // Constant ~38px/s pace, floored so short overflows don't whip past.
  const duration = Math.max(6, distance / 38)

  return (
    <div ref={viewportRef} className="relative overflow-hidden">
      {/* Edge fades so the scrolling text dissolves rather than hard-clipping. */}
      {overflow && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4"
            style={{ background: 'linear-gradient(90deg, var(--np-fade), transparent)' }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4"
            style={{ background: 'linear-gradient(270deg, var(--np-fade), transparent)' }}
          />
        </>
      )}
      {overflow ? (
        <div
          ref={nodeRef}
          className="flex w-max whitespace-nowrap will-change-transform"
          style={{
            animation: `np-marquee ${duration}s linear infinite`,
          }}
        >
          <span className="pr-8">{text}</span>
          <span className="pr-8" aria-hidden>
            {text}
          </span>
        </div>
      ) : (
        <div className="truncate">{text}</div>
      )}
      {/* Off-screen measurer: natural intrinsic width of one copy. */}
      <span
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap"
      >
        {text}
      </span>
    </div>
  )
}

// ── Live equalizer — three bars breathing on scaleY only ──────────────────────
// Pure ambience: signals "audio is flowing" beside the online dot. Transform
// only (scaleY), origin-bottom, staggered. Frozen mid-height under reduced
// motion so it reads as a static glyph, never a flat line.
function Equalizer({ reduced }: { reduced: boolean }) {
  const bars = [0, 1, 2]
  return (
    <span
      aria-hidden
      className="flex h-3 w-3 shrink-0 items-end justify-center gap-[2px]"
    >
      {bars.map((i) => (
        <span
          key={i}
          className={clsx('w-[2px] origin-bottom rounded-full', !reduced && 'np-eq')}
          style={{
            height: '100%',
            backgroundColor: CYAN,
            boxShadow: `0 0 3px ${CYAN}aa`,
            transform: reduced ? `scaleY(${0.4 + i * 0.2})` : undefined,
            // Stagger + de-sync each bar so the trio never pulses in lockstep.
            animationDelay: `${i * 0.18}s`,
            animationDuration: `${0.9 + i * 0.22}s`,
          }}
        />
      ))}
    </span>
  )
}

export default function NowPlaying(props: NowPlayingData) {
  const reduced = useReducedMotion()
  const { ref: sectionRef, entered, onScreenRef } = useInView<HTMLElement>(reduced)

  const {
    isPlaying,
    track,
    progressMs,
    durationMs,
    device,
    shuffle,
    volumePercent,
    lastPlayedAt,
    lastTrack,
  } = props

  // Direct-write targets. The fill scaleX, glow translate, and elapsed timecode
  // are driven imperatively from a single rAF loop — NO per-frame React state,
  // so the tree never re-renders during playback. `elapsed` state below exists
  // only for the accessible aria-valuenow / initial paint, updated ~1×/sec.
  const fillRef = useRef<HTMLDivElement | null>(null)
  const glowRef = useRef<HTMLDivElement | null>(null)
  const elapsedNodeRef = useRef<HTMLSpanElement | null>(null)
  const countNodeRef = useRef<HTMLSpanElement | null>(null)
  const progressBarRef = useRef<HTMLDivElement | null>(null)
  const titleNodeRef = useRef<HTMLDivElement | null>(null)

  // Coarse elapsed for aria + reduced-motion/initial composed state only. Never
  // written every frame; the imperative loop owns the smooth visuals.
  const [elapsed, setElapsed] = useState(progressMs)
  useEffect(() => {
    setElapsed(clamp(progressMs, 0, durationMs || progressMs))
  }, [progressMs, durationMs])

  // The single live loop: one-shot draw-in (scaleX 0 → live ratio over ~700ms,
  // first reveal only) handing off to continuous elapsed tracking. Writes
  // transforms + textContent directly. Paused when the strip is offscreen or the
  // tab is hidden; fully skipped under reduced motion (final state painted once).
  useEffect(() => {
    if (!isPlaying || durationMs <= 0) return

    const fill = fillRef.current
    const glow = glowRef.current
    const elNode = elapsedNodeRef.current
    const bar = progressBarRef.current

    const paint = (ms: number, draw: number) => {
      const live = clamp(ms / durationMs, 0, 1)
      const ratio = live * draw
      if (fill) fill.style.transform = `scaleX(${ratio})`
      if (glow && bar) {
        const w = bar.clientWidth
        glow.style.transform = `translate(${ratio * w}px, -50%) translate(-50%, 0)`
      }
      if (elNode) elNode.textContent = formatClock(ms)
    }

    if (reduced) {
      paint(clamp(progressMs, 0, durationMs), 1)
      return
    }

    let raf = 0
    let drawStart = 0
    const base = progressMs
    let origin = 0
    let lastAriaSec = -1

    const tick = (now: number) => {
      // Pause cheaply while offscreen / hidden: keep the loop alive but skip all
      // writes so no compositing or layout work happens until we're visible.
      if (!onScreenRef.current || document.hidden) {
        raf = requestAnimationFrame(tick)
        return
      }
      if (origin === 0) {
        origin = now
        drawStart = now
      }
      const ms = clamp(base + (now - origin), 0, durationMs)
      const draw = easeOutCubic(clamp((now - drawStart) / 700, 0, 1))
      paint(ms, draw)

      // Push aria-valuenow / elapsed state at most ~1×/sec for assistive tech,
      // without churning the React tree every frame.
      const sec = Math.floor(ms / 1000)
      if (sec !== lastAriaSec) {
        lastAriaSec = sec
        setElapsed(ms)
      }
      if (ms < durationMs) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isPlaying, reduced, progressMs, durationMs, onScreenRef])

  // Total-duration timecode counts up once on reveal (playing only), written
  // imperatively into countNodeRef — no per-frame state.
  useCountUp(countNodeRef, durationMs, entered && isPlaying, reduced)

  // ── IDLE / OFFLINE ──────────────────────────────────────────────────────────
  if (!isPlaying) {
    const seen = lastTrack
      ? `${lastTrack.name} — ${lastTrack.artist}`
      : 'unknown track'
    const when = lastPlayedAt ? relativeTime(lastPlayedAt) : 'a while ago'
    return (
      <section
        ref={sectionRef}
        aria-label="Spotify now playing: offline"
        data-in={entered ? 'true' : 'false'}
        style={{ ['--np-fade' as string]: 'rgba(12,16,22,0.95)' }}
        className={clsx(
          'np-root np-idle hud-brackets flex items-center gap-3 rounded-md border border-ink-border bg-ink-surface/80 px-3 py-2.5 font-mono text-ink-text',
          'transition-colors duration-300 hover:border-gold/40 motion-reduce:transition-none',
        )}
      >
        {/* Gold idle ring — a slow concentric ping radiates out and fades. */}
        <span className="np-stagger relative flex h-3 w-3 shrink-0 items-center justify-center">
          <span
            aria-hidden
            className="np-idle-ping absolute inset-0 rounded-full border"
            style={{ borderColor: GOLD }}
          />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: GOLD, boxShadow: `0 0 6px ${GOLD}66` }}
          />
          <span
            aria-hidden
            className="h-1 w-1 rounded-full"
            style={{ backgroundColor: GOLD }}
          />
        </span>

        <span className="np-stagger" style={{ ['--np-i' as string]: 1 }}>
          <Thumb src={lastTrack?.image} alt="" ring={GOLD} reduced={reduced} twinkle={false} />
        </span>

        <div
          className="np-stagger min-w-0 flex-1 leading-tight"
          style={{ ['--np-i' as string]: 2 }}
        >
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold">
            offline
          </div>
          <div className="truncate text-xs text-ink-muted">
            <span className="text-ink-muted">{'// '}LAST SEEN </span>
            <span className="text-ink-text">{seen}</span>
            <span className="text-ink-muted"> at </span>
            <span className="text-ink-text">{when}</span>
          </div>
        </div>

        <span
          className="np-stagger hidden shrink-0 text-[10px] uppercase tracking-[0.2em] text-ink-muted sm:inline"
          style={{ ['--np-i' as string]: 3 }}
        >
          STREAM IDLE
        </span>

        <StripStyles />
      </section>
    )
  }

  // ── PLAYING ─────────────────────────────────────────────────────────────────
  // Seed ratio for SSR / first paint / reduced motion; the rAF loop overwrites
  // the fill + glow transforms imperatively thereafter (no re-render).
  const seedRatio = durationMs > 0 ? clamp(elapsed / durationMs, 0, 1) : 0
  const title = track?.name ?? 'Unknown track'
  const artist = track?.artist ?? 'Unknown artist'
  const marqueeText = `${title} — ${artist}`

  return (
    <section
      ref={sectionRef}
      aria-label={`Spotify now playing: ${title} by ${artist}`}
      data-in={entered ? 'true' : 'false'}
      style={{ ['--np-fade' as string]: 'rgba(12,16,22,0.95)' }}
      className={clsx(
        'np-root group relative flex items-center gap-3 overflow-hidden rounded-md border border-ink-border bg-ink-surface/80 px-3 py-2.5 font-mono text-ink-text hud-brackets',
        'transition-colors duration-300 hover:border-accent/45 motion-reduce:transition-none',
      )}
    >
      {/* Ambient scan band — a faint cyan column sweeps the strip on a long, slow
          loop. Pure transform(translateX)/opacity; killed under reduced motion. */}
      {!reduced && (
        <span
          aria-hidden
          className="np-scan pointer-events-none absolute inset-y-0 left-0 w-1/3"
          style={{
            background: `linear-gradient(90deg, transparent, ${CYAN}14, transparent)`,
          }}
        />
      )}

      {/* Live cyan online-pulse dot + equalizer */}
      <span
        className="np-stagger relative flex shrink-0 items-center gap-1.5"
        style={{ ['--np-i' as string]: 0 }}
      >
        <span
          className="relative flex h-3 w-3 items-center justify-center"
          aria-hidden
        >
          <span
            className="absolute inset-0 rounded-full animate-online-pulse"
            style={{ backgroundColor: `${CYAN}33`, boxShadow: `0 0 8px ${CYAN}88` }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: CYAN, boxShadow: `0 0 6px ${CYAN}` }}
          />
        </span>
        <Equalizer reduced={reduced} />
      </span>

      <span className="np-stagger" style={{ ['--np-i' as string]: 1 }}>
        <Thumb
          src={track?.image}
          alt={`Album art for ${title}`}
          ring={CYAN}
          reduced={reduced}
          twinkle
        />
      </span>

      {/* Title/artist marquee + telemetry readout + progress bar */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div
          className="np-stagger flex min-w-0 items-baseline gap-3"
          style={{ ['--np-i' as string]: 2 }}
        >
          <div className="min-w-0 flex-1 text-xs text-ink-text">
            <Marquee text={marqueeText} reduced={reduced} nodeRef={titleNodeRef} />
          </div>
          <span
            className="shrink-0 text-[11px] tabular-nums text-ink-muted"
            aria-label={`${formatClock(elapsed)} of ${formatClock(durationMs)}`}
          >
            <span ref={elapsedNodeRef} style={{ color: CYAN }}>
              {formatClock(elapsed)}
            </span>
            <span> / </span>
            <span ref={countNodeRef} aria-hidden>
              {formatClock(durationMs)}
            </span>
          </span>
        </div>

        {/* OUTPUT / SHUFFLE / VOL readout — mono uppercase, hairline separators */}
        <div
          className="np-stagger flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] uppercase tracking-[0.16em] text-ink-muted"
          style={{ ['--np-i' as string]: 3 }}
        >
          {device && (
            <span className="truncate">
              OUTPUT: <span className="text-ink-text">{device}</span>
            </span>
          )}
          <span aria-hidden className="text-ink-border">
            |
          </span>
          <span>
            SHUFFLE{' '}
            <span style={{ color: shuffle ? CYAN : undefined }}>
              {shuffle ? 'ON' : 'OFF'}
            </span>
          </span>
          {typeof volumePercent === 'number' && (
            <>
              <span aria-hidden className="text-ink-border">
                |
              </span>
              <span>
                VOL{' '}
                <span className="tabular-nums text-ink-text">
                  {clamp(Math.round(volumePercent), 0, 100)}%
                </span>
              </span>
            </>
          )}
        </div>

        {/* Hairline cyan progress bar — fill via transform: scaleX() ONLY. The
            leading glow node rides the fill edge by translateX(ratio * width). */}
        <div
          ref={progressBarRef}
          role="progressbar"
          aria-label="Track progress"
          aria-valuemin={0}
          aria-valuemax={Math.round(durationMs / 1000)}
          aria-valuenow={Math.round(elapsed / 1000)}
          className="np-stagger relative h-px w-full overflow-visible bg-ink-border"
          style={{ ['--np-i' as string]: 4 }}
        >
          <div
            ref={fillRef}
            className="absolute inset-y-0 left-0 w-full origin-left will-change-transform"
            style={{
              transform: `scaleX(${seedRatio})`,
              backgroundColor: CYAN,
              boxShadow: `0 0 6px ${CYAN}aa`,
            }}
          />
          {/* Leading glow node riding the fill edge — translate (px from the bar
              width) only, never left. A pulsing halo sells the live cursor. */}
          <div
            ref={glowRef}
            aria-hidden
            className="absolute left-0 top-1/2 h-2 w-2 will-change-transform"
            style={{ transform: `translate(-50%, -50%)` }}
          >
            <span
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: CYAN,
                boxShadow: `0 0 8px ${CYAN}, 0 0 14px ${CYAN}88`,
              }}
            />
            {!reduced && (
              <span
                className="np-cursor-halo absolute inset-0 rounded-full"
                style={{ boxShadow: `0 0 0 1px ${CYAN}` }}
              />
            )}
          </div>
        </div>
      </div>

      <StripStyles />
    </section>
  )
}

// ── Scoped keyframes ──────────────────────────────────────────────────────────
// All transform/opacity. The global CSS reduced-motion floor
// (animation:none !important) also kills every loop; per-element guards keep the
// final composed state correct on first paint.
function StripStyles() {
  return (
    <style>{`
      /* Entrance: parts stagger up + fade once the section reports in-view. The
         final box is occupied from frame 1 (translateY only, no layout shift). */
      .np-stagger {
        opacity: 0;
        transform: translateY(6px);
      }
      .np-root[data-in='true'] .np-stagger {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1);
        transition-delay: calc(var(--np-i, 0) * 70ms);
      }

      /* Promote the thumb to its own layer ONLY while hovered, so an idle strip
         keeps no extra compositor layer alive. */
      .np-thumb:hover { will-change: transform; }

      @keyframes np-marquee {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }

      /* Equalizer bars — scaleY breathing, each desynced via inline delay/dur. */
      @keyframes np-eq {
        0%, 100% { transform: scaleY(0.28); }
        50%      { transform: scaleY(1); }
      }
      .np-eq {
        animation-name: np-eq;
        animation-timing-function: cubic-bezier(0.45,0,0.55,1);
        animation-iteration-count: infinite;
      }

      /* Album reticle twinkle — opacity only. */
      @keyframes np-twinkle {
        0%, 100% { opacity: 0.25; }
        50%      { opacity: 1; }
      }
      .np-twinkle { animation: np-twinkle 2.2s ease-in-out infinite; }

      /* Ambient scan band sweeping the playing strip — translateX + opacity. */
      @keyframes np-scan {
        0%   { transform: translateX(-120%); opacity: 0; }
        12%  { opacity: 1; }
        88%  { opacity: 1; }
        100% { transform: translateX(420%); opacity: 0; }
      }
      .np-scan {
        animation: np-scan 7.5s cubic-bezier(0.4,0,0.2,1) infinite;
        will-change: transform, opacity;
      }

      /* Live-cursor halo — a thin ring that expands + fades off the glow node. */
      @keyframes np-cursor-halo {
        0%   { transform: scale(1);   opacity: 0.85; }
        100% { transform: scale(3.2); opacity: 0; }
      }
      .np-cursor-halo {
        animation: np-cursor-halo 1.8s ease-out infinite;
        will-change: transform, opacity;
      }

      /* Idle ring concentric ping (gold) — transform + opacity only. */
      @keyframes np-idle-ping {
        0%   { transform: scale(1);   opacity: 0.7; }
        100% { transform: scale(2.4); opacity: 0; }
      }
      .np-idle-ping {
        animation: np-idle-ping 2.8s ease-out infinite;
        will-change: transform, opacity;
      }

      @media (prefers-reduced-motion: reduce) {
        .np-stagger {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }
        [style*="np-marquee"],
        .np-eq, .np-twinkle, .np-scan, .np-cursor-halo, .np-idle-ping {
          animation: none !important;
        }
      }
    `}</style>
  )
}

// Zero-arg demo for isolated preview + type-checking against the fixture.
export function NowPlayingDemo() {
  return <NowPlaying {...fxNowPlaying} />
}
