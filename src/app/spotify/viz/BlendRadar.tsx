'use client'

// ── SIGNAL-LOCK BLEND radar ───────────────────────────────────────────────────
// Presentational only. Receives a BlendView (the scan state machine) plus an
// always-on OwnerSignature baseline. It draws a circular radar scope on a radial
// hud-grid with a single rotating sweep line, places shared-artist blips as the
// PRIMARY signal (shared genres are usually thin), counts the SIGNAL % up via
// rAF, and degrades to a static, fully-composed scope under reduced motion.
//
// It performs NO OAuth — onConnect?: () => void wires the connect button.
//
// MOTION CONTRACT (hard constraints honored throughout):
//   • animate ONLY transform + opacity (and SVG stroke-dashoffset for draw-ins).
//     Never width/height/top/left, never box-shadow spread.
//   • view-triggered choreography starts on IntersectionObserver — nothing
//     animates while offscreen.
//   • prefers-reduced-motion → fully composed static final state, zero motion:
//     rings drawn, all blips pinged + placed, count-up resolved, sweep frozen.

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
import type { BlendView, OwnerSignature } from './types'
import { fxBlend, fxOwnerSignature } from './fixtures'

const CYAN = '#5BC8FF'
const GOLD = '#E8B84B'

// Geometry of the scope, in SVG user units (square viewBox).
const SIZE = 320
const C = SIZE / 2
const R_OUTER = 148
const RINGS = [0.34, 0.62, 0.9] // baseline signature rings (fractions of R_OUTER)

// ── motion floor ──────────────────────────────────────────────────────────────
// Local copy of the shared hook's pattern: SSR renders motion-on, the client
// narrows after mount. The CSS global floor hard-kills CSS animation regardless;
// this gates the JS-driven sweep + rAF count-up + entrance choreography.
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

// ── view-trigger gate ───────────────────────────────────────────────────────
// Entrance choreography fires the first time the scope scrolls into view, so a
// scope mounted below the fold doesn't burn its reveal offscreen. Reduced motion
// (or missing IO) snaps straight to the composed state. The layout box is fully
// occupied from frame 1 — only opacity/transform/dashoffset are withheld.
//
// `shown` latches true on first reveal (the entrance plays once). `visible`
// tracks live on-screen state so the continuous sweep loop can PAUSE when the
// scope scrolls back out of view, then resume — no wasted rAF offscreen.
function useInView<T extends Element>(reduced: boolean) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          setVisible(e.isIntersecting)
          if (e.isIntersecting) setShown(true)
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reduced])
  return { ref, shown, visible }
}

// Deterministic blip placement: golden-angle spread for even, organic coverage;
// radius pulled outward by rank so the strongest shared artists sit closer to
// the high-confidence core of the scope.
function blipPosition(index: number, total: number) {
  const golden = 137.508 * (Math.PI / 180)
  const angle = index * golden - Math.PI / 2
  const t = total <= 1 ? 0.5 : index / (total - 1)
  const radius = (0.32 + t * 0.5) * R_OUTER
  return {
    x: C + Math.cos(angle) * radius,
    y: C + Math.sin(angle) * radius,
    angleDeg: ((angle * 180) / Math.PI + 360) % 360,
  }
}

// ── rAF count-up for the big SIGNAL % ──────────────────────────────────────────
// Held at 0 until `run` (lock + in-view) so the count-up is part of the reveal,
// not something that already finished while the scope was below the fold.
function useCountUp(target: number, run: boolean, reduced: boolean) {
  const [value, setValue] = useState(reduced ? target : 0)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (reduced) {
      setValue(target)
      return
    }
    if (!run) {
      setValue(0)
      return
    }
    const start = performance.now()
    const DURATION = 1200
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION)
      // easeOutExpo — fast lock, decisive settle
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setValue(Math.round(eased * target))
      if (p < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current)
    }
  }, [target, run, reduced])

  return value
}

// Trailing-heat ramp in [0,1]: 1 at the beam, fading to 0 across a ~46° window
// behind it. A continuous warm/cool, not a binary flip.
const PING_WINDOW = 46
function heatFor(beamAngle: number, blipAngle: number): number {
  const trailing = (beamAngle - blipAngle + 360) % 360
  if (trailing > PING_WINDOW) return 0
  return 1 - trailing / PING_WINDOW
}

type BlipRefs = {
  angleDeg: number
  dot: SVGCircleElement | null
  ring: SVGCircleElement | null
}

// ── continuously rotating sweep (single rotate transform) ───────────────────────
// ONE rAF loop drives EVERYTHING imperatively — zero React re-renders per frame:
//   • the SVG sweep rotation (written to the <g> transform attribute), and
//   • each shared-artist blip's gold cross-flash (fill / glow / ping-ring),
//     written straight to per-blip refs as the beam crosses.
// Previously this pumped React state ~24×/s, reconciling the whole SVG tree
// (rings, 36 rim ticks, every blip) each tick. Now the tree is static while the
// beam spins; only two attribute writes per blip per frame touch the DOM.
//
// The loop is fully gated: it never starts under reduced motion, pauses when the
// scope scrolls offscreen (`active`), and pauses when the tab is hidden
// (visibilitychange) so a backgrounded tab burns nothing.
function useSweep(
  active: boolean,
  reduced: boolean,
  gRef: React.RefObject<SVGGElement | null>,
  blipRefs: React.RefObject<BlipRefs[]>,
) {
  useEffect(() => {
    if (!active || reduced) return

    // will-change only while the sweep is genuinely animating; removed on cleanup
    // so an idle/parked scope doesn't hold a compositor layer hint forever.
    const g = gRef.current
    if (g) g.style.willChange = 'transform'

    let raf = 0
    let last = performance.now()
    let angle = 0
    let running = true

    const paint = () => {
      g?.setAttribute('transform', `rotate(${angle} ${C} ${C})`)
      const refs = blipRefs.current
      if (refs) {
        for (const r of refs) {
          if (!r) continue
          const heat = heatFor(angle, r.angleDeg)
          const warm = heat > 0.5
          const color = warm ? GOLD : CYAN
          if (r.dot) {
            r.dot.setAttribute('fill', color)
            r.dot.style.filter = `drop-shadow(0 0 ${3 + heat * 5}px ${color})`
          }
          if (r.ring) {
            if (heat > 0) {
              r.ring.style.opacity = String(heat * 0.6)
              r.ring.style.transform = `scale(${1 + (1 - heat) * 1.7})`
            } else {
              r.ring.style.opacity = '0'
            }
          }
        }
      }
    }

    const tick = (now: number) => {
      if (!running) return
      const dt = now - last
      last = now
      angle = (angle + dt * (360 / 2600)) % 360 // ~2.6s per revolution
      paint()
      raf = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibility)
      if (g) g.style.willChange = ''
      // Restore blips to their at-rest cyan baseline so none stay frozen gold
      // (with a stranded ping ring) if the beam stopped mid-pass.
      const refs = blipRefs.current
      if (refs) {
        for (const r of refs) {
          if (r?.dot) {
            r.dot.setAttribute('fill', CYAN)
            r.dot.style.filter = `drop-shadow(0 0 3px ${CYAN})`
          }
          if (r?.ring) r.ring.style.opacity = '0'
        }
      }
    }
  }, [active, reduced, gRef, blipRefs])
}

type BlipDatum = {
  name: string
  x: number
  y: number
  angleDeg: number
}

export default function BlendRadar({
  view,
  owner,
  onConnect,
}: {
  view: BlendView
  owner: OwnerSignature
  onConnect?: () => void
}) {
  const reduced = useReducedMotion()
  const gradId = useId().replace(/:/g, '')
  const sweepRef = useRef<SVGGElement | null>(null)
  const blipRefs = useRef<BlipRefs[]>([])
  const { ref: scopeRef, shown, visible } = useInView<HTMLDivElement>(reduced)

  const isScanning = view.state === 'scanning'
  const isLocked = view.state === 'locked'
  const isRestricted = view.state === 'restricted'
  const isIdle = view.state === 'idle'

  // The sweep spins during scanning and lock; idle/restricted hold a static
  // baseline scope. Under reduced motion it never moves. Gated on `visible` so
  // the rAF loop runs ONLY while the scope is actually on-screen — it pauses
  // when scrolled away and resumes on return.
  const sweepActive = (isScanning || isLocked) && !reduced && visible
  useSweep(sweepActive, reduced, sweepRef, blipRefs)

  const result = isLocked ? view.result : null
  const target = result?.matchPercent ?? 0
  // Count-up belongs to the reveal: only runs once locked AND scrolled into view.
  const signal = useCountUp(target, isLocked && shown, reduced)

  const blips: BlipDatum[] = useMemo(() => {
    if (!result) return []
    const arr = result.sharedArtists
    return arr.map((a, i) => {
      const p = blipPosition(i, arr.length)
      return { name: a.name, x: p.x, y: p.y, angleDeg: p.angleDeg }
    })
  }, [result])

  const sharedGenres = result?.sharedGenres ?? []

  // Hovered / focused blip index for interaction feedback (label + emphasis).
  // Discrete pointer/keyboard events only — never per-frame — so driving this
  // via React state is correct and cheap.
  const [activeBlip, setActiveBlip] = useState<number | null>(null)

  // Per-blip imperative handles for the sweep loop. Rebuilt whenever the blip
  // set changes so stale element refs never linger.
  blipRefs.current = blips.map((b, i) => {
    const prev = blipRefs.current[i]
    return {
      angleDeg: b.angleDeg,
      dot: prev?.dot ?? null,
      ring: prev?.ring ?? null,
    }
  })

  const headline = (() => {
    if (isLocked) return `${signal}%`
    if (isScanning) return 'SCANNING'
    if (isRestricted) return 'NO LOCK'
    return 'STANDBY'
  })()

  return (
    <section
      className="relative mx-auto w-full max-w-md font-mono"
      aria-label="Signal-lock blend radar"
    >
      {/* status header */}
      <header className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-ink-muted">
        <span className="flex items-center gap-2">
          <span
            className={clsx(
              'inline-block h-1.5 w-1.5 rounded-full',
              isLocked && 'bg-gold animate-online-pulse',
              isScanning && 'bg-accent animate-online-pulse',
              isRestricted && 'bg-gold/70',
              isIdle && 'bg-accent/50',
            )}
            aria-hidden
          />
          blend radar
        </span>
        <span className={clsx(isRestricted ? 'text-gold' : 'text-accent')}>
          {isLocked
            ? 'SIGNAL LOCKED'
            : isScanning
              ? 'ACQUIRING'
              : isRestricted
                ? 'RESTRICTED'
                : 'AWAITING SCAN'}
        </span>
      </header>

      {/* scope — entrance choreography is gated on this element entering view */}
      <div
        ref={scopeRef}
        data-shown={shown}
        className={clsx(
          'blend-scope relative isolate aspect-square w-full overflow-hidden rounded-full border border-ink-border bg-ink-bg hud-brackets',
          // The whole scope eases up + fades in as a unit on first view; the
          // inner elements then stagger their own reveals on top.
          'transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none',
          shown ? 'opacity-100' : 'opacity-0',
        )}
        style={{ transform: shown ? 'scale(1)' : 'scale(0.965)' }}
      >
        {/* radial hud field */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(91,200,255,0.10) 0%, rgba(91,200,255,0.03) 42%, transparent 70%)`,
          }}
        />

        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={
            isLocked
              ? `Signal lock at ${target} percent. ${blips.length} shared artists detected${sharedGenres.length ? `; shared genres: ${sharedGenres.join(', ')}` : ''}.`
              : isScanning
                ? 'Scanning for a signal lock against the operator baseline.'
                : isRestricted
                  ? 'No signal lock. Access restricted; operator baseline shown.'
                  : 'Radar idle. Operator baseline signature awaiting a scan.'
          }
        >
          <defs>
            {/* sweep wedge gradient — trails behind the leading edge */}
            <linearGradient id={`sweep-${gradId}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={CYAN} stopOpacity="0" />
              <stop offset="100%" stopColor={CYAN} stopOpacity="0.35" />
            </linearGradient>
            <radialGradient id={`core-${gradId}`}>
              <stop offset="0%" stopColor={CYAN} stopOpacity="0.55" />
              <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── baseline scope group: fades in as a unit, then rings draw on top ── */}
          <g
            className="blend-baseline"
            style={{
              opacity: shown ? 1 : 0,
              transition: reduced ? undefined : 'opacity 500ms ease-out',
            }}
          >
            {/* concentric baseline signature rings — drawn in via stroke-dashoffset
                (transform/opacity-equivalent: paints the stroke around the
                circumference). Staggered outward-in so the scope assembles. */}
            {RINGS.map((f, i) => {
              const r = R_OUTER * f
              const circ = 2 * Math.PI * r
              return (
                <circle
                  key={f}
                  cx={C}
                  cy={C}
                  r={r}
                  fill="none"
                  stroke={CYAN}
                  strokeOpacity={isRestricted ? 0.14 : 0.2 - i * 0.03}
                  strokeWidth={1}
                  className="blend-ring"
                  style={{
                    strokeDasharray: circ,
                    strokeDashoffset: shown || reduced ? 0 : circ,
                    transition: reduced
                      ? undefined
                      : `stroke-dashoffset 900ms cubic-bezier(0.65,0,0.35,1) ${120 + i * 110}ms`,
                  }}
                />
              )
            })}
            {(() => {
              const circ = 2 * Math.PI * R_OUTER
              return (
                <circle
                  cx={C}
                  cy={C}
                  r={R_OUTER}
                  fill="none"
                  stroke={CYAN}
                  strokeOpacity={0.28}
                  strokeWidth={1.2}
                  style={{
                    strokeDasharray: circ,
                    strokeDashoffset: shown || reduced ? 0 : circ,
                    transition: reduced
                      ? undefined
                      : 'stroke-dashoffset 1000ms cubic-bezier(0.65,0,0.35,1) 60ms',
                  }}
                />
              )
            })()}

            {/* cross hairs — fade in last, subtle */}
            <g
              style={{
                opacity: shown || reduced ? 1 : 0,
                transition: reduced ? undefined : 'opacity 600ms ease-out 520ms',
              }}
            >
              <line x1={C} y1={C - R_OUTER} x2={C} y2={C + R_OUTER} stroke={CYAN} strokeOpacity={0.12} strokeWidth={1} />
              <line x1={C - R_OUTER} y1={C} x2={C + R_OUTER} y2={C} stroke={CYAN} strokeOpacity={0.12} strokeWidth={1} />
            </g>

            {/* owner baseline tick marks around the rim (the always-on signature).
                A faint continuous shimmer keeps the scope feeling alive at idle —
                opacity-only, paused by the global reduced-motion floor. */}
            <g className={clsx(!reduced && shown && 'blend-rim-shimmer')}>
              {Array.from({ length: 36 }).map((_, i) => {
                const a = (i / 36) * Math.PI * 2
                const major = i % 3 === 0
                const r1 = R_OUTER - (major ? 9 : 5)
                return (
                  <line
                    key={i}
                    x1={C + Math.cos(a) * r1}
                    y1={C + Math.sin(a) * r1}
                    x2={C + Math.cos(a) * R_OUTER}
                    y2={C + Math.sin(a) * R_OUTER}
                    stroke={CYAN}
                    strokeOpacity={major ? 0.32 : 0.16}
                    strokeWidth={1}
                    style={{
                      opacity: shown || reduced ? 1 : 0,
                      transition: reduced
                        ? undefined
                        : `opacity 420ms ease-out ${300 + (i % 12) * 22}ms`,
                    }}
                  />
                )
              })}
            </g>
          </g>

          {/* rotating sweep — ONE rotate transform, written imperatively by the
              rAF loop. Reduced motion: a static beam frozen at a fixed bearing so
              the composed state still reads as a scope, not a broken ring. Only
              revealed once the scope is in view (opacity, not display). */}
          <g
            ref={sweepRef}
            transform={`rotate(${reduced ? -42 : 0} ${C} ${C})`}
            style={{
              // will-change is set by the sweep loop ONLY while spinning and
              // cleared on cleanup, so a parked/idle scope holds no layer hint.
              opacity: shown || reduced ? (isRestricted || isIdle ? 0.55 : 1) : 0,
              transition: reduced ? undefined : 'opacity 600ms ease-out 700ms',
            }}
          >
            {/* trailing wedge */}
            <path
              d={`M ${C} ${C} L ${C} ${C - R_OUTER} A ${R_OUTER} ${R_OUTER} 0 0 0 ${C - R_OUTER * Math.sin(0.9)} ${C - R_OUTER * Math.cos(0.9)} Z`}
              fill={`url(#sweep-${gradId})`}
              opacity={isRestricted ? 0.4 : 1}
            />
            {/* leading edge */}
            <line
              x1={C}
              y1={C}
              x2={C}
              y2={C - R_OUTER}
              stroke={CYAN}
              strokeWidth={1.5}
              strokeOpacity={isRestricted ? 0.45 : 0.9}
              style={{ filter: `drop-shadow(0 0 4px ${CYAN})` }}
            />
          </g>

          {/* shared-artist blips — the PRIMARY signal. Cyan, warming to gold as
              the beam crosses (continuous heat ramp), with an expanding ping ring
              at the moment of crossing. Staggered pop-in on first lock; hover /
              keyboard focus lifts and labels them. */}
          {isLocked &&
            blips.map((b, i) => {
              const active = activeBlip === i
              // Static composed state. Under reduced motion every blip reads as
              // fully pinged (gold). With motion, the sweep loop overwrites
              // fill / glow / ping-ring imperatively each pass — these values
              // are just the at-rest baseline the loop paints over.
              const restFill = reduced ? GOLD : CYAN
              const restGlow = reduced ? 8 : 3
              return (
                <g
                  key={`${b.name}-${i}`}
                  tabIndex={0}
                  role="img"
                  aria-label={`Shared artist: ${b.name}`}
                  className="blend-blip"
                  onMouseEnter={() => setActiveBlip(i)}
                  onMouseLeave={() => setActiveBlip((c) => (c === i ? null : c))}
                  onFocus={() => setActiveBlip(i)}
                  onBlur={() => setActiveBlip((c) => (c === i ? null : c))}
                  style={{
                    // Staggered reveal: each blip pops from the core outward.
                    transformOrigin: `${b.x}px ${b.y}px`,
                    transform:
                      shown || reduced
                        ? active
                          ? 'scale(1.18)'
                          : 'scale(1)'
                        : 'scale(0)',
                    opacity: shown || reduced ? 1 : 0,
                    transition: reduced
                      ? undefined
                      : `transform 480ms cubic-bezier(0.34,1.56,0.64,1) ${900 + i * 110}ms, opacity 360ms ease-out ${900 + i * 110}ms`,
                    cursor: 'default',
                    outline: 'none',
                  }}
                >
                  {/* expanding ping ring at the moment the beam crosses — pure
                      scale + opacity, driven imperatively by the sweep loop.
                      Hidden at rest (opacity 0) unless reduced motion shows the
                      composed at-crossing state. */}
                  <circle
                    ref={(el) => {
                      if (blipRefs.current[i]) blipRefs.current[i].ring = el
                    }}
                    cx={b.x}
                    cy={b.y}
                    r={6}
                    fill="none"
                    stroke={GOLD}
                    strokeWidth={1}
                    style={{
                      transformOrigin: `${b.x}px ${b.y}px`,
                      opacity: reduced ? 0.5 : 0,
                    }}
                  />
                  {/* focus/hover halo */}
                  {active && (
                    <circle
                      cx={b.x}
                      cy={b.y}
                      r={11}
                      fill="none"
                      stroke={reduced ? GOLD : CYAN}
                      strokeOpacity={0.6}
                      strokeWidth={1}
                    />
                  )}
                  <circle
                    ref={(el) => {
                      if (blipRefs.current[i]) blipRefs.current[i].dot = el
                    }}
                    cx={b.x}
                    cy={b.y}
                    r={4}
                    fill={restFill}
                    style={{
                      filter: `drop-shadow(0 0 ${restGlow}px ${restFill})`,
                      transition: reduced ? undefined : 'fill 200ms ease-out',
                    }}
                  />
                  {/* on-scope label for the active blip — mono, gold-tinted */}
                  {active && (
                    <text
                      x={b.x}
                      y={b.y - 14}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize={10}
                      fill={GOLD}
                      style={{ filter: `drop-shadow(0 0 4px rgba(0,0,0,0.9))` }}
                    >
                      {b.name}
                    </text>
                  )}
                </g>
              )
            })}

          {/* glowing core — gentle twinkle keeps the center alive (opacity-only,
              paused under the reduced-motion floor). */}
          <circle
            cx={C}
            cy={C}
            r={26}
            fill={`url(#core-${gradId})`}
            aria-hidden
            className={clsx(!reduced && shown && 'blend-core-twinkle')}
          />
          <circle
            cx={C}
            cy={C}
            r={3.5}
            fill={isLocked ? GOLD : CYAN}
            style={{ filter: `drop-shadow(0 0 5px ${isLocked ? GOLD : CYAN})` }}
          />
        </svg>

        {/* centered telemetry readout */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[9px] uppercase tracking-[0.3em] text-ink-muted">
            signal
          </span>
          <span
            className={clsx(
              'tabular-nums leading-none',
              isLocked ? 'text-gold' : 'text-ink-text',
              headline.length > 5 ? 'text-2xl' : 'text-4xl',
              // The headline rises into place with the count-up on first lock.
              !reduced && 'transition-[opacity,transform] duration-500 ease-out',
            )}
            style={{
              opacity: shown || reduced ? 1 : 0,
              transform: shown || reduced ? 'translateY(0)' : 'translateY(6px)',
              transitionDelay: reduced ? undefined : '760ms',
              textShadow: isLocked ? `0 0 14px rgba(232,184,75,0.45)` : undefined,
            }}
          >
            {headline}
          </span>
          {isLocked && (
            <span
              className="mt-1 text-[9px] uppercase tracking-[0.25em] text-accent"
              style={{
                opacity: shown || reduced ? 1 : 0,
                transition: reduced ? undefined : 'opacity 500ms ease-out 1000ms',
              }}
            >
              {blips.length} shared {blips.length === 1 ? 'artist' : 'artists'}
            </span>
          )}
        </div>

        {/* RESTRICTED banner — gold, bracketed; baseline still drawn behind it.
            The COMMON case for non-allowlisted visitors: must read intentional.
            Eases up into place rather than hard-cutting. */}
        {isRestricted && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-6">
            <div
              className="hud-brackets border border-gold/40 bg-ink-bg/80 px-3 py-1.5 text-center backdrop-blur-sm"
              style={{
                opacity: shown || reduced ? 1 : 0,
                transform: shown || reduced ? 'translateY(0)' : 'translateY(8px)',
                transition: reduced
                  ? undefined
                  : 'opacity 600ms ease-out 600ms, transform 600ms cubic-bezier(0.34,1.56,0.64,1) 600ms',
              }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                NO LOCK // ACCESS RESTRICTED
              </p>
              {view.reason && (
                <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-ink-muted">
                  {view.reason}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* baseline + shared-genre strip below the scope. The stat cards stagger up
          on first view to extend the entrance past the scope edge. */}
      <footer className="mt-4 space-y-3">
        <dl className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.14em]">
          {[
            { dt: 'baseline genre', dd: owner.topGenre ?? '—', tone: 'text-ink-text', title: owner.topGenre },
            { dt: 'baseline artist', dd: owner.topArtist ?? '—', tone: 'text-ink-text', title: owner.topArtist },
            { dt: 'artists indexed', dd: String(owner.artistCount), tone: 'text-accent tabular-nums' },
            { dt: 'genres indexed', dd: String(owner.genreCount), tone: 'text-accent tabular-nums' },
          ].map((cell, i) => (
            <div
              key={cell.dt}
              className="rounded border border-ink-border bg-ink-surface/60 px-2.5 py-2"
              style={{
                opacity: shown || reduced ? 1 : 0,
                transform: shown || reduced ? 'translateY(0)' : 'translateY(8px)',
                transition: reduced
                  ? undefined
                  : `opacity 460ms ease-out ${500 + i * 90}ms, transform 460ms ease-out ${500 + i * 90}ms`,
              }}
            >
              <dt className="text-ink-muted">{cell.dt}</dt>
              <dd className={clsx('mt-0.5 truncate', cell.tone)} title={cell.title}>
                {cell.dd}
              </dd>
            </div>
          ))}
        </dl>

        {/* shared genres scroll in only on lock; thin/empty is expected */}
        {isLocked && (
          <div className="min-h-[1.75rem]">
            <p className="mb-1.5 text-[9px] uppercase tracking-[0.22em] text-ink-muted">
              shared genres
            </p>
            {sharedGenres.length > 0 ? (
              <ul className="flex flex-wrap gap-1.5">
                {sharedGenres.map((g, i) => (
                  <li
                    key={g}
                    className="rounded border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-accent"
                    style={{
                      opacity: shown || reduced ? 1 : 0,
                      transform: shown || reduced ? 'translateX(0)' : 'translateX(-8px)',
                      transition: reduced
                        ? undefined
                        : `opacity 420ms ease-out ${1100 + i * 110}ms, transform 420ms cubic-bezier(0.34,1.56,0.64,1) ${1100 + i * 110}ms`,
                    }}
                  >
                    {g}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                none in common — artist signal carries the lock
              </p>
            )}
          </div>
        )}

        {/* connect affordance — idle/restricted invite a scan; presentational
            only, the parent wires the real OAuth via onConnect. */}
        {(isIdle || isRestricted) && (
          <button
            type="button"
            onClick={onConnect}
            className={clsx(
              'group flex w-full items-center justify-center gap-2 rounded border px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors',
              isRestricted
                ? 'border-gold/50 text-gold hover:bg-gold/10'
                : 'border-accent/50 text-accent hover:bg-accent/10',
            )}
          >
            <span
              aria-hidden
              className={clsx(
                'inline-block h-1.5 w-1.5 rounded-full',
                isRestricted ? 'bg-gold' : 'bg-accent animate-online-pulse',
                // a hair of forward drift on hover — transform only
                'transition-transform group-hover:translate-x-0.5',
              )}
            />
            {isRestricted ? 'request access // connect spotify' : 'connect spotify to scan'}
          </button>
        )}

        {isScanning && (
          <p className="text-center text-[10px] uppercase tracking-[0.18em] text-accent/80">
            <span className={clsx(!reduced && 'blend-scan-breathe')}>locking signal…</span>
          </p>
        )}
      </footer>

      {/* local keyframes — strictly opacity (and the global reduced-motion floor
          in tailwind.css force-disables every one of these). No transform-origin
          ambiguity, no box-shadow, no geometry. */}
      <style>{`
        @keyframes blendCoreTwinkle {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        .blend-core-twinkle { animation: blendCoreTwinkle 3.4s ease-in-out infinite; }

        @keyframes blendRimShimmer {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        .blend-rim-shimmer { animation: blendRimShimmer 5s ease-in-out infinite; }

        @keyframes blendScanBreathe {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        .blend-scan-breathe {
          display: inline-block;
          animation: blendScanBreathe 1.6s ease-in-out infinite;
        }

        /* Keyboard focus ring on a blip: emphasize via the existing halo (drawn
           in React) plus a subtle on-element outline that respects the scope. */
        .blend-blip:focus-visible { outline: none; }
      `}</style>
    </section>
  )
}

// ── Demo: matching fixtures, locked state (the showcase frame) ──────────────────
export function BlendRadarDemo() {
  const view: BlendView = { state: 'locked', result: fxBlend }
  return (
    <BlendRadar
      view={view}
      owner={fxOwnerSignature}
      onConnect={() => {}}
    />
  )
}
