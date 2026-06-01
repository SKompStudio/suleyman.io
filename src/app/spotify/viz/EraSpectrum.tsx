'use client'

// ── ERA SPECTRUM ───────────────────────────────────────────────────────────
// A release-year frequency analyzer for the top-tracks set. Tracks bucket by
// releaseYear (or by half-decade when the span is wide), then plot as a
// vertical-bar histogram on a mono year axis — an oscilloscope readout of the
// listening era. The tallest column cores gold with a bracketed PEAK ERA
// callout; the oldest and newest tracks pin the ends of the axis.
//
// Presentational only. All motion is transform/opacity, view-triggered by an
// IntersectionObserver, and folds to a fully-composed static state under
// prefers-reduced-motion. Choreography (in order, once in view):
//   1. bars rise via scaleY (origin bottom) with a soft overshoot, staggered
//   2. an SVG envelope traces across the bar tops via stroke-dashoffset
//   3. count caps + the header total/peak count animate up via requestAnimationFrame
//   4. end-pins resolve in with a small lift
// Continuous ambient life (in view, motion allowed): a slow cyan analyzer sweep
// glides across the field, the peak filament twinkles, and the live dot pulses.
// Hover/focus on any column lifts it, brightens its envelope node, and shows a
// mono readout — keyboard-reachable as real buttons.

import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import type { RankedTrack } from './types'
import { fxTracks } from './fixtures'

const CYAN = '#5BC8FF'
const GOLD = '#E8B84B'

// Above this many distinct years, single-year columns get noisy and sparse, so
// collapse to half-decade buckets (e.g. 2020–2024). Tuned for a typical 50-item
// top-tracks window.
const WIDE_SPAN_YEARS = 12
const HALF_DECADE = 5

// Histogram geometry in SVG user-units for the envelope trace overlay. The
// drawing is purely decorative and laid over the flex bars via an absolutely
// positioned, non-interactive SVG; the flex bars remain the source of truth.
const VB_W = 1000
const VB_H = 100

type Bucket = {
  key: string
  label: string // axis tick text (mono)
  start: number
  end: number // inclusive
  count: number
  tracks: RankedTrack[]
}

type Spectrum = {
  buckets: Bucket[]
  peakIndex: number // -1 when empty / no clear peak
  bucketed: boolean // true when collapsed to half-decades
  oldest?: RankedTrack
  newest?: RankedTrack
  total: number
}

function floorTo(year: number, step: number) {
  return Math.floor(year / step) * step
}

function computeSpectrum(tracks: RankedTrack[]): Spectrum {
  const dated = tracks.filter(
    (t): t is RankedTrack & { releaseYear: number } =>
      typeof t.releaseYear === 'number' && Number.isFinite(t.releaseYear),
  )

  if (dated.length === 0) {
    return { buckets: [], peakIndex: -1, bucketed: false, total: 0 }
  }

  let minYear = Infinity
  let maxYear = -Infinity
  let oldest = dated[0]
  let newest = dated[0]
  for (const t of dated) {
    if (t.releaseYear < minYear) minYear = t.releaseYear
    if (t.releaseYear > maxYear) maxYear = t.releaseYear
    if (t.releaseYear < oldest.releaseYear) oldest = t
    if (t.releaseYear > newest.releaseYear) newest = t
  }

  const span = maxYear - minYear + 1
  const bucketed = span > WIDE_SPAN_YEARS
  const step = bucketed ? HALF_DECADE : 1
  const startBound = floorTo(minYear, step)

  const map = new Map<number, Bucket>()
  for (let s = startBound; s <= maxYear; s += step) {
    const end = s + step - 1
    map.set(s, {
      key: String(s),
      label: bucketed ? `${s}` : String(s),
      start: s,
      end,
      count: 0,
      tracks: [],
    })
  }
  for (const t of dated) {
    const slot = floorTo(t.releaseYear, step)
    const b = map.get(slot)
    if (b) {
      b.count += 1
      b.tracks.push(t)
    }
  }

  const buckets = [...map.values()].sort((a, b) => a.start - b.start)

  let peakIndex = -1
  let peakCount = 0
  buckets.forEach((b, i) => {
    if (b.count > peakCount) {
      peakCount = b.count
      peakIndex = i
    }
  })

  return { buckets, peakIndex, bucketed, oldest, newest, total: dated.length }
}

function bucketRangeLabel(b: Bucket, bucketed: boolean) {
  if (!bucketed) return String(b.start)
  return `${b.start}–${b.end}`
}

// ── In-view trigger ────────────────────────────────────────────────────────
// Mirrors SetupClient: the layout box is occupied from frame 1; motion fires on
// scroll-in. Under reduced motion (or no IO support) the final state shows at
// once. Returns the gate flag and the resolved reduced-motion verdict so all
// downstream motion branches on a single source of truth.
function useReveal<T extends Element>() {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const el = ref.current
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(prefersReduced)

    if (!el || typeof IntersectionObserver === 'undefined' || prefersReduced) {
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
  }, [])

  return { ref, shown, reduced }
}

// ── Count-up ───────────────────────────────────────────────────────────────
// Tween an integer from 0 → target with requestAnimationFrame once `run` flips
// true. When motion is reduced (or before the gate opens with run already true)
// the final value is presented immediately — no intermediate frames.
function useCountUp(target: number, run: boolean, reduced: boolean, durationMs = 900) {
  const [value, setValue] = useState(reduced ? target : 0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (reduced) {
      setValue(target)
      return
    }
    if (!run) return

    let start: number | null = null
    const from = 0
    const tick = (now: number) => {
      if (start === null) start = now
      const t = Math.min(1, (now - start) / durationMs)
      // easeOutCubic — quick lead, gentle settle.
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(from + (target - from) * eased))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [target, run, reduced, durationMs])

  return value
}

// Smootherstep — symmetric ease used to shape the envelope sweep so the band
// eases in/out at the edges instead of hard-clipping.
function smoother(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

export default function EraSpectrum({ tracks }: { tracks: RankedTrack[] }) {
  const { ref, shown, reduced } = useReveal<HTMLDivElement>()

  const spectrum = useMemo(() => computeSpectrum(tracks), [tracks])
  const { buckets, peakIndex, bucketed, oldest, newest, total } = spectrum

  // Which column the pointer/keyboard is dwelling on (-1 = none).
  const [active, setActive] = useState(-1)

  const maxCount = useMemo(
    () => buckets.reduce((m, b) => Math.max(m, b.count), 0),
    [buckets],
  )

  // Per-bar target scale, shared by the bars and the envelope trace so they
  // agree exactly. A floor keeps empty buckets legible as axis ticks.
  const scales = useMemo(
    () =>
      buckets.map((b) =>
        b.count === 0 ? 0.012 : Math.max(0.06, maxCount > 0 ? b.count / maxCount : 0),
      ),
    [buckets, maxCount],
  )

  // Envelope polyline across the bar tops, in viewBox units. Each node sits at
  // the horizontal centre of its column and at the height of its scaled bar.
  const envelope = useMemo(() => {
    const n = scales.length
    if (n === 0) return { points: [] as { x: number; y: number }[], d: '', length: 1 }
    const slot = VB_W / n
    const points = scales.map((s, i) => ({
      x: slot * (i + 0.5),
      y: VB_H - s * VB_H,
    }))
    const d = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ')
    // Crude polyline length for the dash draw-in; exactness isn't needed since
    // the path is normalized by pathLength below.
    let length = 0
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x
      const dy = points[i].y - points[i - 1].y
      length += Math.hypot(dx, dy)
    }
    return { points, d, length: length || 1 }
  }, [scales])

  // Continuous analyzer sweep, advanced by rAF only while the section is in view
  // AND motion is allowed AND the tab is visible. Drives the cyan scan band, the
  // baseline scan dot, and the travelling envelope node-glow. To avoid a full
  // React re-render every frame (which would re-map every bucket, circle, and
  // rect at 60fps), the phase lives in a ref and the loop writes directly to the
  // relevant DOM nodes via refs. No per-frame setState; the tree never churns.
  const bandRef = useRef<SVGRectElement | null>(null)
  const dotRef = useRef<HTMLSpanElement | null>(null)
  const dotTrackRef = useRef<HTMLDivElement | null>(null)
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([])

  useEffect(() => {
    if (reduced || !shown) return

    let raf = 0
    let last = performance.now()
    let phase = 0
    const PERIOD = 5200 // ms per full left→right pass

    const paint = (sweep: number, nBuckets: number) => {
      const band = bandRef.current
      if (band) {
        band.style.opacity = String(0.5 + 0.25 * smoother(Math.abs(0.5 - sweep) * 2))
        band.style.transform = `translateX(${(sweep * 1.16 - 0.08) * VB_W}px)`
      }
      const dot = dotRef.current
      const track = dotTrackRef.current
      if (dot && track) {
        // translateX in px (compositor-friendly) across the measured track width,
        // rather than animating `left` (which triggers layout each frame). -2px
        // centres the 4px dot on its position, matching the old translate(-50%).
        dot.style.transform = `translate(${sweep * track.clientWidth - 2}px, -50%)`
      }
      const sweepCol = sweep * nBuckets
      const circles = nodeRefs.current
      for (let i = 0; i < circles.length; i++) {
        const c = circles[i]
        if (!c) continue
        const dist = Math.abs(i - sweepCol)
        const near = Math.max(0, 1 - dist / 1.4)
        const base = c.dataset.base ? Number(c.dataset.base) : 0.32
        const activeBoost = c.dataset.active === '1' ? 0.5 : 0
        c.style.opacity = String(Math.min(1, base + near * 0.6 + activeBoost))
      }
    }

    const loop = (now: number) => {
      const dt = now - last
      last = now
      if (!document.hidden) {
        phase = (phase + dt / PERIOD) % 1
        paint(phase, buckets.length)
      } else {
        // Skip advancing while hidden; resync the clock on resume so the band
        // doesn't jump after the tab returns to the foreground.
        last = now
      }
      raf = requestAnimationFrame(loop)
    }

    const onVisibility = () => {
      // Avoid counting hidden time as elapsed when we wake back up.
      last = performance.now()
    }
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced, shown, buckets.length])

  // Keep the node-ref array exactly as long as the envelope so the rAF loop
  // never paints stale, detached circle refs after the track set changes.
  if (nodeRefs.current.length !== envelope.points.length) {
    nodeRefs.current.length = envelope.points.length
  }

  const peak = peakIndex >= 0 ? buckets[peakIndex] : undefined
  const peakRange = peak ? bucketRangeLabel(peak, bucketed) : ''

  // Count-ups: total (header) and the peak bucket count (callout). The peak
  // tween lags the histogram rise so the gold value "locks" after the bars land.
  const totalCount = useCountUp(total, shown, reduced, 1000)
  const peakCountUp = useCountUp(peak?.count ?? 0, shown, reduced, 1100)

  if (buckets.length === 0) {
    return (
      <section
        ref={ref}
        aria-label="Era spectrum — release-year analyzer"
        className="hud-brackets relative overflow-hidden rounded-lg border border-ink-border bg-ink-surface/60 p-5"
      >
        <Header bucketed={false} total={0} shown reduced live={false} />
        <p className="mt-6 font-mono text-xs text-ink-muted">
          NO RELEASE-YEAR DATA IN SET
        </p>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      aria-label="Era spectrum — release-year frequency analyzer"
      className="hud-brackets relative overflow-hidden rounded-lg border border-ink-border bg-ink-surface/60 p-5"
    >
      {/* faint grid backdrop — oscilloscope field */}
      <div aria-hidden className="hud-grid pointer-events-none absolute inset-0" />

      <div className="relative">
        <Header
          bucketed={bucketed}
          total={totalCount}
          shown={shown}
          reduced={reduced}
          live={shown && !reduced}
        />

        {/* PEAK ERA callout — the single most-important value, gold + bracketed.
            Fades/lifts in after the bars rise; the count tweens up. */}
        {peak && (
          <div
            className={clsx(
              'mt-3 inline-flex items-center gap-2 font-mono text-[11px]',
              reduced
                ? ''
                : 'transition-[opacity,transform] duration-700 ease-out',
            )}
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'translateY(0)' : 'translateY(6px)',
              transitionDelay: reduced ? undefined : '620ms',
            }}
          >
            <span className="text-ink-muted">[</span>
            <span className="uppercase tracking-[0.18em] text-ink-muted">
              Peak Era
            </span>
            <span className="font-semibold text-gold tabular-nums">{peakRange}</span>
            <span className="text-ink-muted tabular-nums">
              · {peakCountUp} {(peak.count === 1) ? 'track' : 'tracks'}
            </span>
            <span className="text-ink-muted">]</span>
          </div>
        )}

        {/* ── Histogram ──────────────────────────────────────────────────── */}
        <div className="relative mt-6">
          <div
            role="img"
            aria-label={
              `Release-year histogram of ${total} tracks across ` +
              `${buckets.length} ${bucketed ? 'half-decade buckets' : 'years'}` +
              (peak ? `, peaking at ${peakRange} with ${peak.count}.` : '.')
            }
            className="relative flex h-44 items-end gap-1.5"
            onMouseLeave={() => setActive(-1)}
          >
            {buckets.map((b, i) => {
              const isPeak = i === peakIndex
              const isActive = i === active
              const targetScale = scales[i]
              return (
                <button
                  key={b.key}
                  type="button"
                  tabIndex={0}
                  aria-label={`${bucketRangeLabel(b, bucketed)}: ${b.count} ${
                    b.count === 1 ? 'track' : 'tracks'
                  }${isPeak ? ' (peak era)' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive((a) => (a === i ? -1 : a))}
                  className={clsx(
                    'group relative flex h-full min-w-0 flex-1 cursor-default flex-col justify-end',
                    'bg-transparent p-0 text-left outline-none',
                  )}
                >
                  {/* count cap — fades in with the bar, brightens on hover */}
                  <span
                    className={clsx(
                      'mb-1 text-center font-mono text-[10px] tabular-nums',
                      reduced ? '' : 'transition-opacity duration-500',
                      isPeak ? 'text-gold' : isActive ? 'text-accent' : 'text-ink-muted',
                    )}
                    style={{
                      opacity: shown && b.count > 0 ? 1 : 0,
                      transitionDelay: reduced ? undefined : `${300 + i * 55}ms`,
                    }}
                    aria-hidden
                  >
                    {b.count > 0 ? b.count : ''}
                  </span>

                  {/* the bar — scaleY from the bottom, soft overshoot on entry,
                      a small extra lift while active (transform only) */}
                  <div
                    className={clsx(
                      'w-full origin-bottom rounded-t-sm',
                      reduced ? '' : 'transition-transform duration-700',
                      isPeak
                        ? 'bg-gradient-to-t from-gold/25 to-gold/80'
                        : 'bg-gradient-to-t from-accent/15 to-accent/55',
                    )}
                    style={{
                      height: '100%',
                      // will-change only while the bar is actually moving: before
                      // the entry rise, and while hovered/focused. Dropped at idle
                      // so we don't pin a compositor layer per bar forever.
                      willChange: !reduced && (!shown || isActive) ? 'transform' : undefined,
                      transform: `scaleY(${
                        shown ? targetScale * (isActive && !reduced ? 1.045 : 1) : 0
                      })`,
                      transitionTimingFunction: shown
                        ? // overshoot on the way up, then a calm hover spring
                          'cubic-bezier(0.16, 1.18, 0.3, 1)'
                        : 'ease-out',
                      transitionDelay: reduced ? undefined : `${i * 55}ms`,
                      boxShadow: isPeak
                        ? `0 0 12px ${GOLD}55, inset 0 0 0 1px ${GOLD}66`
                        : `inset 0 0 0 1px ${CYAN}${isActive ? '66' : '33'}`,
                    }}
                  >
                    {/* peak core line — a brighter gold filament up the center
                        that twinkles continuously when motion is allowed */}
                    {isPeak && (
                      <span
                        aria-hidden
                        className={clsx(
                          'absolute inset-x-0 bottom-0 mx-auto block w-px',
                          shown && !reduced ? 'animate-online-pulse' : '',
                        )}
                        style={{
                          height: '100%',
                          background: `linear-gradient(to top, ${GOLD}, transparent)`,
                        }}
                      />
                    )}
                  </div>

                  {/* axis tick — mono year label, brightens on hover */}
                  <span
                    className={clsx(
                      'mt-2 select-none text-center font-mono text-[9px] tabular-nums tracking-tight',
                      reduced ? '' : 'transition-colors duration-200',
                      isPeak ? 'text-gold' : isActive ? 'text-accent' : 'text-ink-muted',
                    )}
                  >
                    {b.label}
                  </span>
                </button>
              )
            })}

            {/* ── Envelope trace + analyzer sweep overlay ─────────────────────
                A non-interactive SVG laid over the bars. The polyline across the
                bar tops draws in via stroke-dashoffset, then a soft cyan band
                sweeps left→right forever (in view, motion allowed). The node
                nearest the sweep glows. Pure stroke/opacity/transform. */}
            <svg
              aria-hidden
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            >
              <defs>
                <linearGradient id="era-sweep" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={CYAN} stopOpacity="0" />
                  <stop offset="50%" stopColor={CYAN} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* the envelope polyline — drawn once on reveal */}
              <path
                d={envelope.d}
                fill="none"
                stroke={CYAN}
                strokeOpacity={0.55}
                strokeWidth={1.4}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: reduced ? 0 : shown ? 0 : 1,
                  transition: reduced
                    ? undefined
                    : 'stroke-dashoffset 1100ms cubic-bezier(0.16,1,0.3,1) 200ms',
                  filter: `drop-shadow(0 0 3px ${CYAN}66)`,
                }}
              />

              {/* envelope nodes — small dots that brighten as the sweep passes.
                  The sweep-driven glow is written directly by the rAF loop via
                  nodeRefs; React only renders the at-rest/hover base so the tree
                  never re-renders per frame. data-base / data-active feed the
                  loop's per-frame opacity calc. */}
              {envelope.points.map((p, i) => {
                const isActive = i === active
                const isPeak = i === peakIndex
                const base = isPeak ? 0.9 : 0.32
                // At rest (no live sweep) show the base glow + hover boost.
                const restGlow = Math.min(1, base + (isActive ? 0.5 : 0))
                return (
                  <circle
                    key={i}
                    ref={(el) => {
                      nodeRefs.current[i] = el
                    }}
                    data-base={base}
                    data-active={isActive ? '1' : '0'}
                    cx={p.x}
                    cy={p.y}
                    r={isPeak || isActive ? 3.2 : 2.2}
                    fill={isPeak ? GOLD : CYAN}
                    style={{
                      opacity: shown ? restGlow : 0,
                      transition: reduced
                        ? undefined
                        : `opacity 200ms ease-out, r 200ms ease-out`,
                    }}
                  />
                )
              })}

              {/* the travelling analyzer band — a soft vertical gradient column
                  translated across the field. Transform/opacity only. */}
              {!reduced && shown && (
                <rect
                  ref={bandRef}
                  x={0}
                  y={0}
                  width={VB_W * 0.16}
                  height={VB_H}
                  fill="url(#era-sweep)"
                  style={{
                    opacity: 0.5,
                    transform: `translateX(${-0.08 * VB_W}px)`,
                    willChange: 'transform, opacity',
                  }}
                />
              )}
            </svg>
          </div>

          {/* baseline axis hairline — draws in left→right on reveal via scaleX */}
          <div
            ref={dotTrackRef}
            className="relative mt-[-1.35rem] h-px w-full overflow-visible"
          >
            <div
              aria-hidden
              className={clsx(
                'h-px w-full origin-left bg-ink-border',
                reduced ? '' : 'transition-transform duration-700 ease-out',
              )}
              style={{
                transform: shown ? 'scaleX(1)' : 'scaleX(0)',
                boxShadow: `0 0 6px ${CYAN}22`,
              }}
            />
            {/* a cyan scan dot that rides the baseline as the sweep advances.
                Driven by translateX (px, measured track width) from the rAF loop
                — never animates `left`, so no per-frame layout. */}
            {!reduced && shown && (
              <span
                ref={dotRef}
                aria-hidden
                className="absolute top-1/2 left-0 h-1 w-1 rounded-full bg-accent"
                style={{
                  transform: 'translate(0px, -50%)',
                  boxShadow: `0 0 6px ${CYAN}, 0 0 12px ${CYAN}88`,
                  opacity: 0.85,
                  willChange: 'transform',
                }}
              />
            )}
          </div>
        </div>

        {/* ── End-pins: oldest / newest track ─────────────────────────────── */}
        {(oldest || newest) && (
          <div className="mt-7 grid grid-cols-2 gap-3 border-t border-ink-border/60 pt-4">
            <EndPin
              label="Oldest"
              track={oldest}
              align="start"
              shown={shown}
              reduced={reduced}
              delay={780}
            />
            <EndPin
              label="Newest"
              track={newest}
              align="end"
              shown={shown}
              reduced={reduced}
              delay={860}
            />
          </div>
        )}
      </div>
    </section>
  )
}

function Header({
  bucketed,
  total,
  shown,
  reduced,
  live,
}: {
  bucketed: boolean
  total: number
  shown: boolean
  reduced: boolean
  live: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h3
        className={clsx(
          'font-mono text-xs uppercase tracking-[0.22em] text-ink-text',
          reduced ? '' : 'transition-[opacity,transform] duration-500 ease-out',
        )}
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0)' : 'translateY(4px)',
        }}
      >
        Era Spectrum
      </h3>
      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
        <span
          aria-hidden
          className={clsx(
            'inline-block h-1.5 w-1.5 rounded-full bg-accent',
            live ? 'animate-online-pulse' : '',
          )}
          style={{ boxShadow: `0 0 6px ${CYAN}` }}
        />
        <span className="tabular-nums">{total}</span> tracks ·{' '}
        {bucketed ? 'half-decade' : 'by year'}
      </span>
    </div>
  )
}

function EndPin({
  label,
  track,
  align,
  shown,
  reduced,
  delay,
}: {
  label: string
  track?: RankedTrack
  align: 'start' | 'end'
  shown: boolean
  reduced: boolean
  delay: number
}) {
  if (!track) return <div aria-hidden />
  const alignCls = align === 'end' ? 'items-end text-right' : 'items-start text-left'
  return (
    <div
      className={clsx(
        'flex min-w-0 flex-col',
        alignCls,
        reduced ? '' : 'transition-[opacity,transform] duration-700 ease-out',
      )}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown
          ? 'translateY(0)'
          : `translateY(8px) translateX(${align === 'end' ? '6px' : '-6px'})`,
        transitionDelay: reduced ? undefined : `${delay}ms`,
      }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        {label}
        {typeof track.releaseYear === 'number' && (
          <span className="ml-1.5 text-accent tabular-nums">{track.releaseYear}</span>
        )}
      </span>
      <span className="mt-1 max-w-full truncate font-sans text-sm text-ink-text">
        {track.name}
      </span>
      <span className="max-w-full truncate font-mono text-[11px] text-ink-muted">
        {track.artist}
      </span>
    </div>
  )
}

export function EraSpectrumDemo() {
  return <EraSpectrum tracks={fxTracks.medium} />
}
