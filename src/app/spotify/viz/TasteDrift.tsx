'use client'

// ── TASTE DRIFT ──────────────────────────────────────────────────────────────
// A slope-graph of how the operator's top artists move across three listening
// windows: 4W (short) · 6M (medium) · ALL (long). Each artist present in 2+
// windows draws a polyline connecting its rank position across the axes; lower
// rank (1 = top) sits higher on the axis. Lines classify by trajectory:
//   RISING  — new to the short window (cyan glow)
//   CORE    — present in all three windows (gold, the load-bearing taste)
//   FADING  — in the long window but absent from short (muted gray)
//
// MOTION (transform / opacity / stroke-dashoffset only — the established HUD
// idiom; see SetupClient + the data-pulse / ring-draw keyframes):
//   • Entrance choreography, view-triggered via IntersectionObserver:
//       axis verticals draw down → headers fade in → lines draw in (staggered,
//       muted FADING first, GOLD core last) → node dots pop → legend counts
//       count up via requestAnimationFrame.
//   • Continuous ambient life: a faint cyan scan band drifts left→right across
//       the field; the CORE (gold) nodes twinkle on a slow offset cadence.
//   • Hover/focus: the line brightens + thickens, a bright pulse travels along
//       it (dash march), its label fades in, and every other line dims.
// Reduced motion folds to the fully-composed final state — everything drawn,
// counts final, scan + twinkle stilled — enforced here AND by the global CSS
// floor. Presentational + prop-driven; never references removed signals.

import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import type { RankedArtist, RankedSets, RangeKey } from './types'
import { fxArtists } from './fixtures'

const CYAN = '#5BC8FF'
const GOLD = '#E8B84B'
const GRAY = '#7C8896'

// ── Geometry ─────────────────────────────────────────────────────────────────
const W = 680
const H = 460
const PAD_X = 96 // room for axis end-labels (artist names) on left + right
const PAD_TOP = 64 // axis headers
const PAD_BOTTOM = 36
const PLOT_TOP = PAD_TOP
const PLOT_BOTTOM = H - PAD_BOTTOM

// The three axes, left→right, mapped to the RankedSets keys.
const AXES: { key: RangeKey; label: string; sub: string }[] = [
  { key: 'short', label: '4W', sub: 'last 4 weeks' },
  { key: 'medium', label: '6M', sub: 'last 6 months' },
  { key: 'long', label: 'ALL', sub: 'all time' },
]

type Status = 'rising' | 'core' | 'fading'

type DriftLine = {
  id: string
  name: string
  status: Status
  // One point per axis the artist appears in (sparse axes skipped).
  points: { axis: number; rank: number; x: number; y: number }[]
}

const STATUS_META: Record<Status, { label: string; color: string; legend: string }> = {
  rising: { label: 'RISING', color: CYAN, legend: 'new to 4W' },
  core: { label: 'CORE', color: GOLD, legend: 'in all three' },
  fading: { label: 'FADING', color: GRAY, legend: 'fell out of 4W' },
}
const LEGEND_ORDER: Status[] = ['rising', 'core', 'fading']

function axisX(axis: number): number {
  return PAD_X + (axis * (W - 2 * PAD_X)) / (AXES.length - 1)
}

// Map a 1-based rank to a y position. We scale against the deepest rank seen
// across all windows so the whole field uses the full vertical plot. Rank 1
// pins to the top; the worst rank to the bottom.
function makeRankY(maxRank: number) {
  const span = Math.max(1, maxRank - 1)
  return (rank: number) => PLOT_TOP + ((rank - 1) / span) * (PLOT_BOTTOM - PLOT_TOP)
}

function classify(inShort: boolean, inMedium: boolean, inLong: boolean): Status {
  if (inShort && inMedium && inLong) return 'core'
  if (inShort && !inLong) return 'rising' // new arrival, not in the all-time set
  if (inShort) return 'rising' // present now, surfacing — treat as rising
  // not in short:
  return 'fading' // in long (and/or medium) but gone from the current 4W
}

// Build the drift lines from the three ranked sets. Only artists present in 2+
// windows draw a polyline (a single-window dot has no slope to show).
function buildLines(sets: RankedSets<RankedArtist>): { lines: DriftLine[]; maxRank: number } {
  const byAxis = AXES.map((a) => sets[a.key] ?? [])
  const rankAt: Record<string, number>[] = byAxis.map((list) => {
    const m: Record<string, number> = {}
    for (const a of list) m[a.id] = a.rank
    return m
  })

  const maxRank = Math.max(
    1,
    ...byAxis.flatMap((list) => list.map((a) => a.rank)),
  )
  const rankY = makeRankY(maxRank)

  // Stable identity + display name across windows (first occurrence wins).
  const meta = new Map<string, string>()
  for (const list of byAxis) for (const a of list) if (!meta.has(a.id)) meta.set(a.id, a.name)

  const lines: DriftLine[] = []
  for (const [id, name] of meta) {
    const present = rankAt.map((m) => id in m)
    const count = present.filter(Boolean).length
    if (count < 2) continue

    const status = classify(present[0], present[1], present[2])
    const points = AXES.map((_, axis) => {
      if (!present[axis]) return null
      const rank = rankAt[axis][id]
      return { axis, rank, x: axisX(axis), y: rankY(rank) }
    }).filter((p): p is NonNullable<typeof p> => p !== null)

    lines.push({ id, name, status, points })
  }

  // Draw fading first, then rising, then core last so the gold core lines and
  // the bright cyan sit on top of the muted ones.
  const z: Record<Status, number> = { fading: 0, rising: 1, core: 2 }
  lines.sort((a, b) => z[a.status] - z[b.status])
  return { lines, maxRank }
}

function pathFor(points: DriftLine['points']): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ')
}

// Approximate polyline length for the dash draw-in (straight segments).
function pathLength(points: DriftLine['points']): number {
  let len = 0
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    len += Math.hypot(dx, dy)
  }
  return Math.max(1, len)
}

// Self-contained motion floor (server renders motion-on; client narrows after
// mount). The global CSS floor also hard-kills animation under reduced motion.
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

// In-view trigger: the lines draw when the chart scrolls into frame. Reduced
// motion (or no IntersectionObserver) shows the final state immediately.
// `shown` latches once (entrance plays a single time); `inView` is the live
// visibility flag that gates the continuous ambient loop so it pauses when the
// chart scrolls offscreen. The observer is kept connected (not disconnected on
// first hit) so it can resume/pause ambient motion across scrolls.
function useInView<T extends Element>(reduced: boolean) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)
  const inViewRef = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      inViewRef.current = true
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          inViewRef.current = e.isIntersecting
          if (e.isIntersecting) setShown(true)
        }
      },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reduced])
  return { ref, shown, inViewRef }
}

// requestAnimationFrame count-up. Returns the live value, eased, climbing to
// `target` once `run` flips true. Reduced motion lands on `target` immediately.
// Pure transform-free numeric tween — drives text content, not layout.
function useCountUp(target: number, run: boolean, reduced: boolean, durationMs = 720, delayMs = 0): number {
  const [val, setVal] = useState(reduced ? target : 0)
  useEffect(() => {
    if (reduced) {
      setVal(target)
      return
    }
    if (!run) {
      setVal(0)
      return
    }
    let raf = 0
    let start = 0
    const ease = (t: number) => 1 - Math.pow(1 - t, 3) // easeOutCubic
    const tick = (now: number) => {
      if (!start) start = now
      const elapsed = now - start - delayMs
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick)
        return
      }
      const t = Math.min(1, elapsed / durationMs)
      setVal(Math.round(ease(t) * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run, reduced, durationMs, delayMs])
  return val
}

// Continuous ambient driver. A SINGLE shared rAF loop owns the frame clock and
// fans it out to subscribers that write directly to element styles via refs —
// NO per-frame React state, so the component tree never re-renders during
// ambient motion. The loop only runs when `enabled` (drawn, in view, motion-on)
// AND the tab is visible; it pauses on `document.hidden` and when the chart
// scrolls offscreen. On every stop it flushes one final still frame so the
// composed pose is correct (and reduced-motion never starts it at all).
type AmbientTick = (t: number) => void

function useAmbientDriver(
  enabled: boolean,
  inViewRef: React.RefObject<boolean>,
) {
  const subs = useRef(new Set<AmbientTick>())
  const subscribe = useRef((fn: AmbientTick): (() => void) => {
    subs.current.add(fn)
    fn(enabledRef.current ? lastT.current : -1) // paint current pose immediately
    return () => {
      subs.current.delete(fn)
    }
  }).current

  // Keep the latest values reachable from the rAF closure without re-binding it.
  const enabledRef = useRef(enabled)
  const lastT = useRef(0)
  enabledRef.current = enabled

  useEffect(() => {
    const live = () => enabledRef.current && inViewRef.current && !document.hidden
    const flush = (t: number) => {
      lastT.current = t
      for (const fn of subs.current) fn(t)
    }

    if (!enabled) {
      flush(-1) // still pose: ambient effects fold to their resting state
      return
    }

    let raf = 0
    let start = 0
    let running = false
    const tick = (now: number) => {
      if (!start) start = now
      flush((now - start) / 1000)
      raf = requestAnimationFrame(tick)
    }
    const startLoop = () => {
      if (running || !live()) return
      running = true
      start = 0
      raf = requestAnimationFrame(tick)
    }
    const stopLoop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
      flush(-1) // settle to the still pose while paused
    }
    const onVisibility = () => (document.hidden ? stopLoop() : startLoop())

    // Poll the IntersectionObserver-backed flag cheaply on the rAF clock by
    // re-checking liveness each frame; here we just (re)start when conditions
    // allow, and rely on the visibility listener + per-frame liveness for stops.
    const gate = () => {
      if (live()) startLoop()
      else stopLoop()
    }
    const gateId = window.setInterval(gate, 250) // lightweight visibility re-check
    document.addEventListener('visibilitychange', onVisibility)
    startLoop()

    return () => {
      window.clearInterval(gateId)
      document.removeEventListener('visibilitychange', onVisibility)
      cancelAnimationFrame(raf)
      flush(-1)
    }
  }, [enabled, inViewRef])

  return subscribe
}

// Entrance timing — the choreography spine. A line's draw-in delay is grouped
// by status so the muted FADING field lays down first and the GOLD core lands
// last, then its node dots pop a beat after the stroke completes.
const AXIS_DRAW_MS = 520
const HEADERS_AT_MS = 360
const LINES_START_MS = 540
const LINE_DRAW_MS = 820
const LINE_STAGGER_MS = 70
const STATUS_PHASE: Record<Status, number> = { fading: 0, rising: 1, core: 2 }

export type TasteDriftProps = {
  artists: RankedSets<RankedArtist>
}

export default function TasteDrift({ artists }: TasteDriftProps) {
  const reduced = useReducedMotion()
  const { ref, shown, inViewRef } = useInView<HTMLDivElement>(reduced)

  const { lines } = useMemo(() => buildLines(artists), [artists])

  const [active, setActive] = useState<string | null>(null)

  const counts = useMemo(() => {
    const c: Record<Status, number> = { rising: 0, core: 0, fading: 0 }
    for (const l of lines) c[l.status]++
    return c
  }, [lines])

  const empty = lines.length === 0

  // Per-line entrance order: index within its status phase, so the stagger
  // reads as three clean waves rather than one blurry cascade.
  const orderIndex = useMemo(() => {
    const seen: Record<Status, number> = { fading: 0, rising: 0, core: 0 }
    const m: Record<string, number> = {}
    for (const l of lines) m[l.id] = seen[l.status]++
    return m
  }, [lines])

  const lineDelay = (line: DriftLine) =>
    LINES_START_MS +
    STATUS_PHASE[line.status] * LINE_STAGGER_MS * 4 +
    orderIndex[line.id] * LINE_STAGGER_MS

  // Ambient motion is live only once drawn, motion is allowed, and there's
  // something to animate. Live in/out-of-view + tab-visibility gating lives in
  // the driver. `ambientOn` is the static "this build can animate" flag used
  // for conditional rendering of the ambient layers (scan band, pulse).
  const ambientOn = shown && !reduced && !empty
  const subscribe = useAmbientDriver(ambientOn, inViewRef)

  // Scan band: a faint cyan vertical sweeps across the plot on a slow loop.
  // Pure translateX; sits behind the lines, never intercepts pointer events.
  // Driven by the shared rAF via a ref write — never through React state.
  const SCAN_PERIOD = 7.5
  const plotLeft = axisX(0)
  const plotRight = axisX(AXES.length - 1)
  const scanSpan = plotRight - plotLeft
  const scanGroupRef = useRef<SVGGElement | null>(null)
  const scanLineARef = useRef<SVGLineElement | null>(null)
  const scanLineBRef = useRef<SVGLineElement | null>(null)

  useEffect(() => {
    if (!ambientOn) return
    const g = scanGroupRef.current
    const a = scanLineARef.current
    const b = scanLineBRef.current
    if (!g) return
    const unsub = subscribe((t) => {
      if (t < 0) {
        // Still pose: park the band off the left edge, fully transparent, and
        // drop the compositor hint so an idle/offscreen band costs nothing.
        g.style.transform = 'translateX(0px)'
        g.style.willChange = 'auto'
        if (a) a.style.opacity = '0'
        if (b) b.style.opacity = '0'
        return
      }
      const phase = (t % SCAN_PERIOD) / SCAN_PERIOD
      const opacity = Math.sin(phase * Math.PI) * 0.5
      g.style.willChange = 'transform'
      g.style.transform = `translateX(${phase * scanSpan}px)`
      if (a) a.style.opacity = String(opacity)
      if (b) b.style.opacity = String(opacity * 0.4)
    })
    return unsub
  }, [ambientOn, subscribe, scanSpan])

  const counted = shown // gate count-ups on the same in-view signal

  return (
    <div
      ref={ref}
      className="relative w-full rounded-lg border border-ink-border bg-ink-surface/60 p-4 hud-brackets"
    >
      {/* Header row: title + legend chips */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono">
          <div className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">
            Taste Drift
          </div>
          <div className="text-xs text-ink-muted/80">
            rank movement across listening windows
          </div>
        </div>

        <ul className="flex flex-wrap items-center gap-2" aria-label="Legend">
          {LEGEND_ORDER.map((s, i) => (
            <LegendChip
              key={s}
              status={s}
              count={counts[s]}
              dim={active !== null}
              run={counted}
              reduced={reduced}
              delayMs={i * 110}
            />
          ))}
        </ul>
      </div>

      {empty ? (
        <p className="py-12 text-center font-mono text-xs text-ink-muted">
          not enough cross-window overlap to chart drift
        </p>
      ) : (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full select-none"
          role="img"
          aria-label={`Slope graph of taste drift across three listening windows (4 weeks, 6 months, all time). ${counts.rising} rising artists new to the recent window, ${counts.core} core artists present in all three, and ${counts.fading} fading artists that fell out of the recent window.`}
          onMouseLeave={() => setActive(null)}
        >
          {/* Ambient scan band — a faint cyan vertical drifting across the plot.
              translateX only; behind everything; inert to the pointer. */}
          {ambientOn && (
            <g
              ref={scanGroupRef}
              aria-hidden
              pointerEvents="none"
              style={{ transform: 'translateX(0px)', willChange: 'auto' }}
            >
              <line
                ref={scanLineARef}
                x1={plotLeft}
                y1={PLOT_TOP - 6}
                x2={plotLeft}
                y2={PLOT_BOTTOM + 6}
                stroke={CYAN}
                strokeWidth={1.5}
                style={{ opacity: 0 }}
              />
              <line
                ref={scanLineBRef}
                x1={plotLeft + 6}
                y1={PLOT_TOP - 6}
                x2={plotLeft + 6}
                y2={PLOT_BOTTOM + 6}
                stroke={CYAN}
                strokeWidth={1}
                style={{ opacity: 0 }}
              />
            </g>
          )}

          {/* Axis verticals + headers. Each vertical draws DOWN via dashoffset;
              the header text fades up shortly after. */}
          {AXES.map((a, i) => {
            const x = axisX(i)
            const axisLen = PLOT_BOTTOM - PLOT_TOP + 16
            const drawn = shown || reduced
            return (
              <g key={a.key}>
                <line
                  x1={x}
                  y1={PLOT_TOP - 8}
                  x2={x}
                  y2={PLOT_BOTTOM + 8}
                  stroke={CYAN}
                  strokeOpacity={0.18}
                  strokeWidth={1}
                  strokeDasharray={axisLen}
                  strokeDashoffset={drawn ? 0 : axisLen}
                  style={{
                    transition: reduced
                      ? 'none'
                      : `stroke-dashoffset ${AXIS_DRAW_MS}ms cubic-bezier(0.16,1,0.3,1)`,
                    transitionDelay: `${i * 90}ms`,
                  }}
                />
                <g
                  style={{
                    opacity: drawn ? 1 : 0,
                    transform: drawn ? 'translateY(0)' : 'translateY(6px)',
                    transition: reduced
                      ? 'none'
                      : 'opacity 360ms ease-out, transform 360ms cubic-bezier(0.16,1,0.3,1)',
                    transitionDelay: `${HEADERS_AT_MS + i * 90}ms`,
                  }}
                >
                  <text
                    x={x}
                    y={PAD_TOP - 34}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize={16}
                    fontWeight={600}
                    fill="#E8EDF2"
                    letterSpacing="2"
                  >
                    {a.label}
                  </text>
                  <text
                    x={x}
                    y={PAD_TOP - 18}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize={10}
                    fill={CYAN}
                    fillOpacity={0.55}
                  >
                    {a.sub}
                  </text>
                </g>
              </g>
            )
          })}

          {/* "higher = ranked better" hint, top-left of the plot */}
          <text
            x={PAD_X - 8}
            y={PLOT_TOP - 6}
            textAnchor="end"
            className="font-mono"
            fontSize={9}
            fill={GRAY}
            fillOpacity={0.7}
          >
            #1
          </text>

          {/* Drift polylines */}
          {lines.map((line) => (
            <DriftPolyline
              key={line.id}
              line={line}
              shown={shown}
              reduced={reduced}
              active={active}
              delayMs={lineDelay(line)}
              subscribe={subscribe}
              ambientOn={ambientOn}
              onEnter={() => setActive(line.id)}
              onLeaveLine={() => setActive(null)}
            />
          ))}
        </svg>
      )}
    </div>
  )
}

// ── Legend chip ────────────────────────────────────────────────────────────
// Reveals on a small stagger (opacity + lift), then its tally counts up.
function LegendChip({
  status,
  count,
  dim,
  run,
  reduced,
  delayMs,
}: {
  status: Status
  count: number
  dim: boolean
  run: boolean
  reduced: boolean
  delayMs: number
}) {
  const meta = STATUS_META[status]
  const shown = run || reduced
  const value = useCountUp(count, run, reduced, 720, delayMs + 120)
  return (
    <li
      className="flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-wider"
      style={{
        borderColor: `${meta.color}55`,
        opacity: shown ? (dim ? 0.6 : 1) : 0,
        transform: shown ? 'translateY(0)' : 'translateY(6px)',
        transition: reduced
          ? 'none'
          : 'opacity 220ms ease-out, transform 360ms cubic-bezier(0.16,1,0.3,1)',
        transitionDelay: shown && !dim ? `${delayMs}ms` : '0ms',
      }}
    >
      <span
        aria-hidden
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: meta.color, boxShadow: `0 0 6px ${meta.color}aa` }}
      />
      <span style={{ color: meta.color }}>{meta.label}</span>
      <span className="text-ink-muted tabular-nums">{value}</span>
    </li>
  )
}

// ── A single drift polyline ─────────────────────────────────────────────────
// Owns its own draw-in, node-pop, hover-pulse and (for CORE lines) the gold
// twinkle. Pulled into its own component so each line can hold per-line refs
// and timing without a giant inline IIFE. Animates stroke-dashoffset, opacity,
// and transform only.
function DriftPolyline({
  line,
  shown,
  reduced,
  active,
  delayMs,
  subscribe,
  ambientOn,
  onEnter,
  onLeaveLine,
}: {
  line: DriftLine
  shown: boolean
  reduced: boolean
  active: string | null
  delayMs: number
  subscribe: (fn: AmbientTick) => () => void
  ambientOn: boolean
  onEnter: () => void
  onLeaveLine: () => void
}) {
  const meta = STATUS_META[line.status]
  const d = pathFor(line.points)
  const len = pathLength(line.points)
  const isActive = active === line.id
  const faded = active !== null && !isActive
  const drawn = shown || reduced
  const isCore = line.status === 'core'

  // Marching highlight pulse on the active line: a short bright dash sweeps
  // along the polyline (offset shift only — never width/length). Driven by the
  // shared rAF straight onto the dashoffset attribute via a ref, so the sweep
  // never triggers a React re-render.
  const pulseDash = `14 ${Math.max(1, len)}`
  const pulseRef = useRef<SVGPathElement | null>(null)

  // Gold core twinkle node refs — opacity written directly by the shared rAF.
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([])

  // Subscribe the per-line ambient writers (pulse march + core twinkle). Only
  // the active line needs the pulse; only core lines need the twinkle. Resting
  // pose (t < 0) restores the static values so a paused/offscreen line is clean.
  useEffect(() => {
    if (!ambientOn) return
    if (!isActive && !isCore) return
    const unsub = subscribe((t) => {
      const pulse = pulseRef.current
      if (pulse) {
        pulse.style.strokeDashoffset =
          t < 0 ? '0' : String(-((t * 90) % (len + 14)))
      }
      if (isCore) {
        for (let i = 0; i < line.points.length; i++) {
          const node = nodeRefs.current[i]
          if (!node || faded) continue
          const axis = line.points[i].axis
          node.style.opacity =
            t < 0 ? '1' : String(0.78 + 0.22 * Math.sin(t * 1.6 + axis * 1.9))
        }
      }
    })
    return unsub
  }, [ambientOn, isActive, isCore, faded, subscribe, len, line.points])

  return (
    <g
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onBlur={onLeaveLine}
      tabIndex={0}
      role="button"
      aria-label={`${line.name}: ${meta.label}`}
      style={{ outline: 'none', cursor: 'pointer' }}
    >
      {/* Wide invisible hit area for easy hover/touch + keyboard focus */}
      <path d={d} stroke="transparent" strokeWidth={18} fill="none" />

      <path
        d={d}
        fill="none"
        stroke={meta.color}
        strokeWidth={isActive ? 3 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={drawn ? 0 : len}
        style={{
          opacity: faded ? 0.16 : line.status === 'fading' ? 0.7 : 0.95,
          transition: reduced
            ? 'none'
            : `stroke-dashoffset ${LINE_DRAW_MS}ms cubic-bezier(0.16,1,0.3,1), opacity 220ms ease, stroke-width 120ms ease`,
          transitionDelay: drawn && !reduced ? `${delayMs}ms` : '0ms',
          filter:
            line.status === 'fading'
              ? 'none'
              : `drop-shadow(0 0 ${isActive ? 6 : 3}px ${meta.color}${isActive ? 'cc' : '88'})`,
        }}
      />

      {/* Active-line marching pulse — a single bright dash sweeping the path.
          Rendered only while active + motion-on; offset shift exclusively. */}
      {isActive && ambientOn && (
        <path
          ref={pulseRef}
          aria-hidden
          d={d}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pulseDash}
          strokeDashoffset={0}
          style={{ opacity: 0.85, filter: `drop-shadow(0 0 4px ${meta.color})`, willChange: 'stroke-dashoffset' }}
          pointerEvents="none"
        />
      )}

      {/* Node dots at each present axis — pop in just after the stroke lands. */}
      {line.points.map((p, idx) => (
        <circle
          key={p.axis}
          ref={(el) => {
            nodeRefs.current[idx] = el
          }}
          cx={p.x}
          cy={p.y}
          r={isActive ? 4 : 2.6}
          fill="#06080B"
          stroke={meta.color}
          strokeWidth={1.6}
          style={{
            opacity: faded ? 0.2 : 1,
            transformBox: 'fill-box',
            transformOrigin: 'center',
            transform: drawn ? 'scale(1)' : 'scale(0)',
            transition: reduced
              ? 'none'
              : 'transform 320ms cubic-bezier(0.34,1.56,0.64,1), opacity 220ms ease, r 120ms ease',
            transitionDelay:
              drawn && !reduced ? `${delayMs + LINE_DRAW_MS * 0.55 + idx * 60}ms` : '0ms',
          }}
        />
      ))}

      {/* End label: artist name at the line's outermost endpoints. Fades in on
          hover/focus (opacity + slide), anchored to the first + last axis. */}
      {(() => {
        const first = line.points[0]
        const last = line.points[line.points.length - 1]
        const ends = first.axis === last.axis ? [first] : [first, last]
        return (
          <g aria-hidden>
            {ends.map((p, idx) => {
              const onLeft = p.axis === 0
              const onRight = p.axis === AXES.length - 1
              const anchor = onLeft ? 'end' : onRight ? 'start' : 'middle'
              const dx = onLeft ? -10 : onRight ? 10 : 0
              return (
                <text
                  key={idx}
                  x={p.x + dx}
                  y={p.y + 3.5}
                  textAnchor={anchor}
                  className="font-mono"
                  fontSize={11}
                  fontWeight={600}
                  fill={meta.color}
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive
                      ? 'translateX(0)'
                      : `translateX(${onLeft ? 4 : onRight ? -4 : 0}px)`,
                    transition: reduced
                      ? 'none'
                      : 'opacity 160ms ease-out, transform 200ms cubic-bezier(0.16,1,0.3,1)',
                    pointerEvents: 'none',
                  }}
                >
                  {line.name}
                </text>
              )
            })}
          </g>
        )
      })()}
    </g>
  )
}

export function TasteDriftDemo() {
  return <TasteDrift artists={fxArtists} />
}
