'use client'

// ── SYSTEM MANIFEST ────────────────────────────────────────────────────────
// A machine reporting its own specs. A dense spec-sheet grid of hairline cells:
// a mono uppercase muted label over a cyan value; the single `headline` stat is
// gold and larger. Numeric values count up via requestAnimationFrame when the
// grid scrolls into view; non-numeric values just fade in. A faint scanline
// sweep crosses the grid (transform translateY) while motion is allowed.
//
// ELEVATED (animation pass): the manifest now boots like a console reporting on
// itself — a live status dot, a header hairline that DRAWS in via
// stroke-dashoffset, per-cell scan-wipe reveals on a stagger, a continuously
// breathing gold headline, sparse cell twinkles, and a tactile hover/focus lift.
// HARD CONSTRAINTS held throughout: only transform + opacity animate; every
// view-triggered loop is gated behind one IntersectionObserver and pauses
// offscreen; prefers-reduced-motion folds to the fully-composed static state
// (belt-and-suspenders with the global CSS floor).
//
// PRESENTATIONAL: receives ManifestStat[] and renders. Self-contained.

import { useCallback, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import type { ManifestStat } from './types'
import { fxManifest } from './fixtures'

const CYAN = '#5BC8FF'
const GOLD = '#E8B84B'

const COUNT_MS = 1000

// ── Reduced-motion floor (local copy so the component is self-contained) ─────
// Server renders the motion-on default; the client narrows after mount to avoid
// a hydration mismatch. Mirrors the project's shared useReducedMotion.
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

// ── In-view trigger — the grid animates only once it's scrolled to; the final
// layout box is occupied from frame 1, and reduced-motion reports in-view
// immediately so the static final state shows with no motion. ────────────────
function useInView<T extends Element>(reduced: boolean) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined' || reduced) {
      setInView(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true)
            obs.disconnect()
          }
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reduced])
  return { ref, inView }
}

// ── Offscreen-pause gate — true only while the grid is BOTH in view and the
// tab is visible. Every continuous rAF loop reads this so nothing burns frames
// scrolled-away or backgrounded. Stays false under reduced motion. ────────────
function useActive<T extends Element>(ref: React.RefObject<T | null>, reduced: boolean) {
  const [active, setActive] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return
    let onscreen = false
    const sync = () => setActive(onscreen && !document.hidden)
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) onscreen = e.isIntersecting
        sync()
      },
      { threshold: 0 },
    )
    obs.observe(el)
    document.addEventListener('visibilitychange', sync)
    return () => {
      obs.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [ref, reduced])
  return active
}

// ── Numeric parsing ──────────────────────────────────────────────────────────
// A value counts up only if it's a "clean" number with an optional prefix/suffix
// (e.g. "50", "6 months", "8m ago", "2020"). The first contiguous number is the
// animated target; surrounding text is preserved verbatim. Non-numeric values
// ("rap", "Drake") just fade in.
type Numeric = { prefix: string; target: number; decimals: number; suffix: string }

function parseNumeric(value: string): Numeric | null {
  const m = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/)
  if (!m) return null
  const raw = m[2].replace(/,/g, '')
  const target = Number(raw)
  if (!Number.isFinite(target)) return null
  const dot = raw.indexOf('.')
  return {
    prefix: m[1],
    target,
    decimals: dot === -1 ? 0 : raw.length - dot - 1,
    suffix: m[3],
  }
}

function formatNumber(n: number, decimals: number): string {
  if (decimals > 0) return n.toFixed(decimals)
  const r = Math.round(n)
  // Group only genuinely large counts — never 4-digit years (e.g. 2020).
  return r >= 10000 ? r.toLocaleString('en-US') : String(r)
}

// ── A single count-up value, driven by rAF when it enters view ───────────────
// The mono digits flicker through a brief "settle" jitter on the way up (a tiny
// transient overshoot in the easing) so the readout feels like hardware locking
// onto a value, not a CSS tween. Opacity/transform untouched — it's text swaps.
function CountUpValue({
  numeric,
  run,
  reduced,
  className,
}: {
  numeric: Numeric
  run: boolean
  reduced: boolean
  className?: string
}) {
  const [display, setDisplay] = useState(() => (reduced ? numeric.target : 0))

  useEffect(() => {
    if (!run) return
    if (reduced) {
      setDisplay(numeric.target)
      return
    }
    let raf = 0
    let start = 0
    const step = (t: number) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / COUNT_MS)
      // easeOutBack-ish: a hair of overshoot then settle — the "lock-on" feel.
      const c1 = 1.18
      const eased =
        p >= 1 ? 1 : 1 + (c1 + 1) * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2)
      setDisplay(numeric.target * eased)
      if (p < 1) raf = requestAnimationFrame(step)
      else setDisplay(numeric.target)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [run, reduced, numeric.target])

  return (
    <span className={className}>
      {numeric.prefix}
      <span className="tabular-nums">{formatNumber(display, numeric.decimals)}</span>
      {numeric.suffix}
    </span>
  )
}

// ── A single manifest cell ───────────────────────────────────────────────────
// Entrance: reveal-rise on a stagger + a one-shot cyan scan-wipe sweeping the
// cell (transform translateX of a masked band). Idle: hover/focus lifts the cell
// and brightens its readout. The headline cell additionally breathes (see below).
function ManifestCell({
  stat,
  index,
  inView,
  reduced,
  registerTick,
}: {
  stat: ManifestStat
  index: number
  inView: boolean
  reduced: boolean
  // Parent hands each cell's corner-tick element to its single shared rAF loop,
  // which writes opacity directly — no per-frame React re-render of the tree.
  registerTick: (i: number, el: HTMLSpanElement | null) => void
}) {
  const headline = stat.headline === true
  const numeric = parseNumeric(stat.value)
  const accentColor = headline ? GOLD : CYAN
  const delayMs = reduced ? 0 : 140 + index * 70

  // The one-shot entrance scan-wipe only needs `will-change` while it's running;
  // leaving it on permanently (once per cell) keeps a compositor layer alive for
  // nothing. Drop it after the wipe's duration so idle cells composite normally.
  const wipeRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (reduced || !inView) return
    const el = wipeRef.current
    if (!el) return
    el.style.willChange = 'transform'
    const total = delayMs + 60 + 900
    const id = window.setTimeout(() => {
      el.style.willChange = 'auto'
    }, total)
    return () => window.clearTimeout(id)
  }, [reduced, inView, delayMs])

  return (
    <div
      tabIndex={0}
      aria-label={`${stat.label}: ${stat.value}`}
      className={clsx(
        'group hud-brackets relative flex flex-col justify-between gap-2 overflow-hidden outline-none',
        'border border-ink-border bg-ink-surface/70 px-3 py-3',
        'transition-[transform,opacity,border-color] duration-500 ease-out',
        'hover:border-ink-border/0 focus-visible:border-ink-border/0',
        'motion-safe:hover:-translate-y-0.5 motion-safe:focus-visible:-translate-y-0.5',
        headline && 'sm:col-span-2',
        inView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
      )}
      style={{
        transitionDelay: inView ? `${delayMs}ms` : '0ms',
      }}
    >
      {/* hairline that intensifies on hover/focus — opacity only, sits on top of
          the resting border so nothing reflows. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 border opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ borderColor: `${accentColor}66` }}
      />

      {/* gold wash on the headline cell — static inset glow via gradient, not
          box-shadow spread (which is banned). Breathing handled by the parent. */}
      {headline && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 120% 90% at 50% 120%, ${GOLD}1f, transparent 70%)`,
          }}
        />
      )}

      {/* one-shot entrance scan-wipe: a thin diagonal band crosses the cell once
          as it reveals. translateX only; folded out under reduced motion. */}
      {!reduced && (
        <span
          ref={wipeRef}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2"
          style={{
            background: `linear-gradient(110deg, transparent, ${accentColor}33, transparent)`,
            transform: inView ? 'translateX(320%)' : 'translateX(0)',
            opacity: inView ? 0 : 0.9,
            transition: `transform 900ms cubic-bezier(0.16,1,0.3,1) ${delayMs + 60}ms, opacity 900ms ease-out ${delayMs + 60}ms`,
          }}
        />
      )}

      {/* a tiny live corner tick — twinkles continuously, opacity only. Driven
          imperatively by the parent's shared clock loop (no per-frame setState).
          Static fallback opacity for reduced motion / idle. */}
      <span
        ref={(el) => registerTick(index, el)}
        aria-hidden
        className="pointer-events-none absolute right-2 top-2 h-1 w-1 rounded-full"
        style={{ background: accentColor, opacity: 0.5 }}
      />

      <dt className="relative font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-ink-muted">
        {stat.label}
      </dt>
      <dd
        className={clsx(
          'relative font-mono font-semibold leading-none transition-[transform] duration-500 ease-out',
          'motion-safe:group-hover:scale-[1.04] motion-safe:group-focus-visible:scale-[1.04]',
          'origin-left',
          headline ? 'text-2xl sm:text-3xl' : 'text-lg',
        )}
        style={{
          color: accentColor,
          textShadow: `0 0 14px ${accentColor}${headline ? '55' : '33'}`,
        }}
      >
        {numeric ? (
          <CountUpValue numeric={numeric} run={inView} reduced={reduced} />
        ) : (
          <span
            className={clsx(
              'block transition-opacity duration-700 ease-out',
              inView ? 'opacity-100' : 'opacity-0',
            )}
            style={{ transitionDelay: `${delayMs}ms` }}
          >
            {stat.value}
          </span>
        )}
      </dd>
    </div>
  )
}

export default function SystemManifest({ stats }: { stats: ManifestStat[] }) {
  const reduced = useReducedMotion()
  const { ref, inView } = useInView<HTMLElement>(reduced)
  const active = useActive(ref, reduced)

  const scanRef = useRef<HTMLDivElement>(null)
  const headlineGlowRef = useRef<HTMLDivElement>(null)
  const ruleRef = useRef<SVGPathElement>(null)
  const tickEls = useRef<(HTMLSpanElement | null)[]>([])

  const registerTick = useCallback((i: number, el: HTMLSpanElement | null) => {
    tickEls.current[i] = el
  }, [])

  // ONE shared rAF loop drives every continuous flourish — scanline sweep,
  // headline breathing, AND each cell's corner-tick twinkle — entirely via
  // direct style writes on refs. Nothing here calls setState, so continuous
  // motion never re-renders the React tree. Gated on `active`, so it doesn't
  // run a single frame while scrolled-away or backgrounded; `will-change` is
  // applied on the moving scanline only while the loop is live and dropped on
  // teardown so no idle compositor layer is left behind.
  useEffect(() => {
    if (!active) return
    const scan = scanRef.current
    const glow = headlineGlowRef.current
    if (scan) scan.style.willChange = 'transform, opacity'
    let raf = 0
    let start = 0
    const SCAN_PERIOD = 5600
    const GLOW_PERIOD = 4200
    const tick = (t: number) => {
      if (!start) start = t
      const dt = t - start

      if (scan) {
        const phase = (dt % SCAN_PERIOD) / SCAN_PERIOD
        scan.style.transform = `translateY(${phase * 100}%)`
        scan.style.opacity = String(0.55 + 0.45 * Math.sin(phase * Math.PI))
      }

      if (glow) {
        const phase = (dt % GLOW_PERIOD) / GLOW_PERIOD
        glow.style.opacity = String(
          0.35 + 0.4 * (0.5 - 0.5 * Math.cos(phase * 2 * Math.PI)),
        )
      }

      // sparse per-cell twinkle — deterministic phase offset per index so the
      // ticks read as independent telemetry, not a synced blink.
      const sec = dt / 1000
      const els = tickEls.current
      for (let i = 0; i < els.length; i++) {
        const el = els[i]
        if (!el) continue
        const phase = sec * 0.8 + i * 1.7
        el.style.opacity = String(0.25 + 0.55 * (0.5 - 0.5 * Math.cos(phase)))
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      if (scan) scan.style.willChange = 'auto'
    }
  }, [active])

  // Header hairline draw-in — a one-shot stroke-dashoffset sweep that resolves
  // when the grid enters view. Pure SVG; final state = fully drawn line, which
  // is also exactly what reduced-motion / no-IO renders (offset 0 from frame 1).
  useEffect(() => {
    const el = ruleRef.current
    if (!el) return
    const len = el.getTotalLength()
    el.style.strokeDasharray = `${len}`
    if (reduced || !inView) {
      el.style.strokeDashoffset = '0'
      return
    }
    el.style.strokeDashoffset = `${len}`
    el.style.transition = 'stroke-dashoffset 1100ms cubic-bezier(0.16,1,0.3,1) 120ms'
    // next frame so the transition registers from the offset start
    const raf = requestAnimationFrame(() => {
      el.style.strokeDashoffset = '0'
    })
    return () => cancelAnimationFrame(raf)
  }, [reduced, inView])

  // When the loop stops (scrolled away, backgrounded, reduced motion), settle
  // every tick back to the static resting opacity instead of freezing whatever
  // mid-twinkle value the last frame wrote.
  useEffect(() => {
    if (active) return
    for (const el of tickEls.current) {
      if (el) el.style.opacity = '0.5'
    }
  }, [active])

  return (
    <section
      ref={ref}
      aria-label="System manifest"
      className="hud-brackets relative border border-ink-border bg-ink-bg/40 p-4 sm:p-5"
    >
      <header className="mb-4">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* live status dot — blinks via the project's online-pulse keyframe,
                steadied by the reduced-motion floor (.hud-pulse override). */}
            <span
              aria-hidden
              className="hud-pulse inline-block h-1.5 w-1.5 rounded-full animate-online-pulse"
              style={{ background: CYAN, boxShadow: `0 0 6px ${CYAN}` }}
            />
            <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-ink-text">
              System Manifest
            </h2>
          </div>
          <span
            aria-hidden
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted"
          >
            {stats.length} spec{stats.length === 1 ? '' : 's'} · online
          </span>
        </div>

        {/* header hairline that draws itself in left→right on reveal */}
        <svg
          aria-hidden
          className="mt-3 h-px w-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 1"
        >
          <line x1="0" y1="0.5" x2="100" y2="0.5" stroke={`${CYAN}22`} strokeWidth="1" />
          <path
            ref={ruleRef}
            d="M0 0.5 H100"
            stroke={CYAN}
            strokeWidth="1"
            strokeOpacity="0.7"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </header>

      <div className="relative">
        {/* scanline sweep — purely decorative, lives above the grid, behind no
            interactive content (pointer-events: none) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        >
          <div
            ref={scanRef}
            className="absolute inset-x-0 -top-10 h-10"
            style={{
              background: `linear-gradient(to bottom, transparent, ${CYAN}26, transparent)`,
            }}
          />
        </div>

        <dl className="relative grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <ManifestCell
              key={`${stat.label}-${i}`}
              stat={stat}
              index={i}
              inView={inView}
              reduced={reduced}
              registerTick={registerTick}
            />
          ))}
        </dl>

        {/* the headline cell renders its own static gold wash; this section-
            level gold veil breathes on the shared loop (opacity only), pooling
            warmth around the headline's region so the most important value feels
            alive without animating that cell's own paint. */}
        {stats.some((s) => s.headline) && (
          <div
            ref={headlineGlowRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: `radial-gradient(ellipse 50% 60% at 30% 60%, ${GOLD}12, transparent 60%)`,
              opacity: reduced ? 0.35 : 0,
            }}
          />
        )}
      </div>
    </section>
  )
}

export function SystemManifestDemo() {
  return <SystemManifest stats={fxManifest} />
}
