'use client'

// ── TASTE CONSTELLATION ───────────────────────────────────────────────────
// A star-map of the listener's top artists. Each artist is a star; brightness
// and size encode RANK (never popularity — that field no longer exists). Stars
// that share a genre are joined by faint cyan filaments, and hovering/focusing
// a star lights up its shared-genre cluster.
//
// Layout is DETERMINISTIC: positions derive from a tiny string hash of the
// artist id plus its rank, so the map is byte-identical across renders, SSR and
// client alike. There is no RNG and no physics tick — nothing ever MOVES a
// node. Animation is exclusively transform (on grouped reveals) and opacity
// (twinkle, filament fades, sweep), which the reduced-motion floor folds to a
// fully-composed static final frame.
//
// genres[] is frequently empty (Spotify stopped returning it for most artists
// in 2025). When the graph has too few shared-genre edges to read as a
// constellation, the SAME seeded layout degrades to a clean rank-radial scatter
// with the filaments simply not drawn — never a collapsed blob.
//
// SVG, not canvas: a few dozen nodes stay crisp at any DPI, are individually
// focusable for keyboard users, and carry real <title>/aria text for free.
//
// ── ANIMATION LAYER (view-triggered, transform/opacity only) ────────────────
//   · Entrance choreography: an IntersectionObserver arms the reveal only when
//     the figure scrolls into view (nothing animates offscreen). Filaments
//     draw in via stroke-dashoffset; stars rise + scale in, staggered by rank
//     so the brightest cores land first; the corner readout counts up via rAF.
//   · Continuous ambient life: a slow cyan radar sweep orbits the core, the
//     star cores twinkle (opacity), and top-five gold cores breathe a halo
//     pulse. All capped + GPU-cheap.
//   · Interaction: hover/focus lights a cluster with a smooth opacity/transform
//     transition; the rest dims.
//   · Reduced motion: every entrance is forced to its final state, the sweep
//     and pulse are removed, twinkle is frozen by the global CSS floor.

import type { RefObject } from 'react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

import type { RankedArtist } from './types'
import { fxArtists } from './fixtures'

const CYAN = '#5BC8FF'
const GOLD = '#E8B84B'

const VIEW_W = 720
const VIEW_H = 560
const CX = VIEW_W / 2
const CY = VIEW_H / 2

// Minimum number of shared-genre links before we consider the field a real
// constellation. Below this the genre signal is too sparse to draw lines.
const MIN_LINKS_FOR_CONSTELLATION = 3

// ── Deterministic helpers ──────────────────────────────────────────────────

// FNV-1a 32-bit. Stable, fast, no deps. Seeds all per-star jitter and twinkle.
function hash(str: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

// A stable float in [0,1) derived from a seed + a salt label.
function seededUnit(seed: number, salt: string): number {
  return (hash(`${seed}:${salt}`) % 100000) / 100000
}

function normalizeGenre(g: string): string {
  return g.trim().toLowerCase()
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0
  let inter = 0
  for (const g of a) if (b.has(g)) inter++
  const union = a.size + b.size - inter
  return union === 0 ? 0 : inter / union
}

// ── Reduced-motion hook (mirrors the site's single source of truth) ─────────
// Server renders motion-on; client narrows after mount to avoid a hydration
// mismatch. The global CSS floor still hard-kills CSS animation regardless —
// this gates the JS-driven entrance + rAF count-up + the SVG sweep.
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

// ── In-view trigger ─────────────────────────────────────────────────────────
// Arms entrance choreography the first time the figure is on screen. Reduced
// motion (or a missing IO) resolves to the final composed state immediately, so
// nothing waits and nothing moves.
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

// ── Live activity gate ──────────────────────────────────────────────────────
// Continuous ambient animation (the sweep / breathe / twinkle) must PAUSE when
// the figure scrolls out of view or the tab is backgrounded — otherwise it
// burns compositor + paint cycles invisibly. This returns a boolean that flips
// with both the figure's live intersection and document.visibility. It never
// re-renders per frame: it toggles at most on scroll-in/out and tab focus.
// Reduced motion never animates, so it reports false and the listeners are
// skipped entirely.
function useActive<T extends Element>(reduced: boolean) {
  const ref = useRef<T | null>(null)
  const [active, setActive] = useState(false)
  useEffect(() => {
    if (reduced) {
      setActive(false)
      return
    }
    const el = ref.current
    if (!el) return

    let onScreen = true
    let obs: IntersectionObserver | null = null
    const recompute = () => setActive(onScreen && !document.hidden)

    if (typeof IntersectionObserver !== 'undefined') {
      onScreen = false
      obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) onScreen = e.isIntersecting
          recompute()
        },
        { threshold: 0 },
      )
      obs.observe(el)
    }

    const onVisibility = () => recompute()
    document.addEventListener('visibilitychange', onVisibility)
    recompute()

    return () => {
      obs?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])
  return { ref, active }
}

// ── rAF count-up ────────────────────────────────────────────────────────────
// Eases an integer readout from 0 → target once `run` flips true, writing the
// text straight to a DOM node via a ref so the per-frame ticks never re-render
// the React tree (a full re-render of dozens of SVG nodes 60×/sec for the
// entrance would be pure waste). Snaps to the target instantly under reduced
// motion or for trivially small targets. Returns the ref to attach to a node.
function useCountUp(
  target: number,
  run: boolean,
  reduced: boolean,
): RefObject<HTMLSpanElement | null> {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = ref.current
    if (node) node.textContent = String(reduced ? target : 0)
  }, [reduced, target])
  useEffect(() => {
    const node = ref.current
    if (!node || !run) return
    if (reduced || target <= 0) {
      node.textContent = String(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 620
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - t, 3)
      node.textContent = String(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run, reduced])
  return ref
}

// ── Derived layout types ────────────────────────────────────────────────────

type Star = {
  artist: RankedArtist
  seed: number
  x: number
  y: number
  r: number // visual radius
  brightness: number // 0..1, drives opacity + glow
  isTopFive: boolean
  genreSet: Set<string>
  twinkleDelay: number
  twinkleDur: number
  revealOrder: number // 0..1 by rank — drives staggered entrance
}

type Link = {
  a: number // index into stars
  b: number
  strength: number // jaccard 0..1
  genres: string[] // shared genres (display)
  len: number // euclidean length (for dash draw-in)
}

type Layout = {
  stars: Star[]
  links: Link[]
  // adjacency by star index → set of star indices sharing ≥1 genre
  neighbors: Map<number, Set<number>>
  isConstellation: boolean
  maxRank: number
}

function buildLayout(artists: RankedArtist[]): Layout {
  const sorted = [...artists].sort((p, q) => p.rank - q.rank)
  const n = sorted.length
  const maxRank = sorted.reduce((m, a) => Math.max(m, a.rank), 1)

  const genreSets = sorted.map(
    (a) => new Set((a.genres ?? []).map(normalizeGenre).filter(Boolean)),
  )

  // Radial layout: rank 1 sits near the core, later ranks spiral outward. The
  // angle is golden-ratio stepped for an even sunflower spread, then nudged by a
  // seeded per-star jitter so it reads organic, not mechanical — but stays
  // deterministic. This is also the graceful-degradation layout: with no links
  // drawn, it's already a clean rank scatter.
  const GOLDEN = Math.PI * (3 - Math.sqrt(5))
  const rOuter = Math.min(VIEW_W, VIEW_H) * 0.42

  const stars: Star[] = sorted.map((artist, i) => {
    const seed = hash(`${artist.id}#${artist.rank}`)
    const rankFrac = n > 1 ? (artist.rank - 1) / (maxRank - 1 || 1) : 0

    // radius grows with rank; sqrt keeps the core from clumping.
    const baseRadius = 46 + Math.sqrt(rankFrac) * rOuter
    const radius = baseRadius + (seededUnit(seed, 'rj') - 0.5) * 46

    const angle = i * GOLDEN + (seededUnit(seed, 'aj') - 0.5) * 0.9

    const x = CX + Math.cos(angle) * radius
    const y = CY + Math.sin(angle) * radius * 0.86 // slight vertical squash

    // Brightness + size from rank only. Top ranks are big and bright.
    const brightness = 0.45 + (1 - rankFrac) * 0.55
    const r = 2.6 + (1 - rankFrac) * 6.2
    const isTopFive = artist.rank <= 5

    return {
      artist,
      seed,
      x: clampCoord(x, VIEW_W),
      y: clampCoord(y, VIEW_H),
      r,
      brightness,
      isTopFive,
      genreSet: genreSets[i],
      twinkleDelay: seededUnit(seed, 'td') * 4,
      twinkleDur: 3.2 + seededUnit(seed, 'tn') * 3.4,
      revealOrder: rankFrac, // bright (low-rank) cores reveal first
    }
  })

  // Pairwise shared-genre links. Cap each star's connections to its strongest
  // few so the densest hubs don't smear into a web.
  const candidate: Link[] = []
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const strength = jaccard(genreSets[i], genreSets[j])
      if (strength <= 0) continue
      const shared = [...genreSets[i]].filter((g) => genreSets[j].has(g))
      const dx = stars[i].x - stars[j].x
      const dy = stars[i].y - stars[j].y
      const len = Math.hypot(dx, dy)
      candidate.push({ a: i, b: j, strength, genres: shared, len })
    }
  }
  candidate.sort((p, q) => q.strength - p.strength)

  const degree = new Array<number>(n).fill(0)
  const MAX_DEGREE = 4
  const links: Link[] = []
  for (const link of candidate) {
    if (degree[link.a] >= MAX_DEGREE || degree[link.b] >= MAX_DEGREE) continue
    links.push(link)
    degree[link.a]++
    degree[link.b]++
  }

  const neighbors = new Map<number, Set<number>>()
  for (let i = 0; i < n; i++) neighbors.set(i, new Set())
  for (const link of links) {
    neighbors.get(link.a)!.add(link.b)
    neighbors.get(link.b)!.add(link.a)
  }

  return {
    stars,
    links,
    neighbors,
    isConstellation: links.length >= MIN_LINKS_FOR_CONSTELLATION,
    maxRank,
  }
}

function clampCoord(v: number, max: number): number {
  const pad = 28
  return Math.max(pad, Math.min(max - pad, v))
}

// Count of stars sharing ≥1 genre with the given index (its cluster size).
function sharedCount(layout: Layout, index: number): number {
  return layout.neighbors.get(index)?.size ?? 0
}

// ── Component ───────────────────────────────────────────────────────────────

export type TasteConstellationProps = {
  artists: RankedArtist[]
  /** Optional window label shown in the corner readout, e.g. "6 MONTHS". */
  windowLabel?: string
  className?: string
}

export default function TasteConstellation({
  artists,
  windowLabel,
  className,
}: TasteConstellationProps) {
  const gradId = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  const { ref: figureRef, shown } = useInView<HTMLElement>(reduced)
  // Live gate for continuous ambient motion — pauses offscreen / when hidden.
  const { ref: activeRef, active: animating } = useActive<HTMLElement>(reduced)

  // `active` is the hovered/focused star index — null when nothing is engaged.
  const [active, setActive] = useState<number | null>(null)

  const layout = useMemo(() => buildLayout(artists), [artists])
  const { stars, links, neighbors, isConstellation } = layout

  // The lit set: the active star plus its shared-genre neighbors.
  const litSet = useMemo(() => {
    if (active === null) return null
    const s = new Set<number>([active])
    for (const nb of neighbors.get(active) ?? []) s.add(nb)
    return s
  }, [active, neighbors])

  const activeStar = active === null ? null : stars[active]
  const activeShared = active === null ? 0 : sharedCount(layout, active)

  // Corner-readout count-ups, armed by the in-view trigger. Driven via refs so
  // the per-frame ticks write text directly and never re-render the SVG tree.
  const starCountRef = useCountUp(stars.length, shown, reduced)
  const linkCountRef = useCountUp(links.length, shown, reduced)

  // Merge the in-view (latched entrance) and live-activity refs onto the figure.
  const setFigureRef = (el: HTMLElement | null) => {
    figureRef.current = el
    activeRef.current = el
  }

  // Text summary for assistive tech and the no-genre fallback narrative.
  const summary = useMemo(() => {
    const top = stars
      .filter((s) => s.artist.rank <= 5)
      .map((s) => s.artist.name)
      .join(', ')
    const genreLine = isConstellation
      ? `${links.length} shared-genre connections form the constellation.`
      : 'Genre data is sparse, so artists are plotted as a rank scatter without connecting lines.'
    return `Taste constellation of ${stars.length} top artists${
      windowLabel ? ` over the last ${windowLabel.toLowerCase()}` : ''
    }. Brightest stars by rank: ${top || 'none'}. ${genreLine}`
  }, [stars, links.length, isConstellation, windowLabel])

  if (stars.length === 0) {
    return (
      <div
        className={clsx(
          'flex aspect-[720/560] w-full items-center justify-center rounded-lg border border-ink-border bg-ink-bg font-mono text-xs uppercase tracking-widest text-ink-muted',
          className,
        )}
      >
        no signal
      </div>
    )
  }

  // The longest filament length seeds the dash-draw entrance: every link shares
  // one large dasharray so they all draw at a consistent visual speed.
  const maxLen = links.reduce((m, l) => Math.max(m, l.len), 1)

  return (
    <figure
      ref={setFigureRef}
      className={clsx(
        'hud-brackets group/constellation relative isolate overflow-hidden rounded-lg border border-ink-border bg-ink-bg',
        className,
      )}
    >
      {/* static backdrop layers — match the site HUD vocabulary */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hud-grid" />
      <div aria-hidden className="pointer-events-none absolute inset-0 hud-glow opacity-70" />

      {/* corner readout — values count up on entrance */}
      <figcaption className="pointer-events-none absolute left-3 top-3 z-10 font-mono text-[10px] uppercase leading-tight tracking-[0.18em] text-ink-muted">
        <span className="text-accent">◆</span> taste constellation
        <span className="ml-2 text-ink-border">/</span>
        <span className="ml-2 text-ink-text tabular-nums">
          <span ref={starCountRef}>{reduced ? stars.length : 0}</span> stars
        </span>
        {windowLabel && (
          <>
            <span className="ml-2 text-ink-border">/</span>
            <span className="ml-2 text-ink-text">{windowLabel}</span>
          </>
        )}
        {isConstellation ? (
          <>
            <span className="ml-2 text-ink-border">/</span>
            <span className="ml-2 text-accent tabular-nums">
              <span ref={linkCountRef}>{reduced ? links.length : 0}</span> links
            </span>
          </>
        ) : (
          <span className="ml-2 text-gold">/ rank scatter · genres sparse</span>
        )}
      </figcaption>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="block w-full"
        role="img"
        aria-label={summary}
        onMouseLeave={() => setActive(null)}
      >
        <defs>
          {/* soft radial core for stars — cyan default, gold for top five */}
          <radialGradient id={`${gradId}-cyan`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DFF4FF" />
            <stop offset="45%" stopColor={CYAN} />
            <stop offset="100%" stopColor={CYAN} stopOpacity={0} />
          </radialGradient>
          <radialGradient id={`${gradId}-gold`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF1CC" />
            <stop offset="40%" stopColor={GOLD} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </radialGradient>

          {/* radar sweep: a faint cyan wedge, fading to nothing at its trailing
              edge. Rotated continuously by a transform animation (GPU-cheap).
              Masked to the field's elliptical footprint so it reads as a scan
              over the star map, not a hard pie slice. */}
          <radialGradient id={`${gradId}-sweep`} cx="0%" cy="0%" r="100%">
            <stop offset="0%" stopColor={CYAN} stopOpacity={0.16} />
            <stop offset="55%" stopColor={CYAN} stopOpacity={0.05} />
            <stop offset="100%" stopColor={CYAN} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* ── ambient radar sweep ──────────────────────────────────────────
            Pure rotation about the core. Removed under reduced motion (JS gate)
            so the static final frame carries no orbiting element. */}
        {!reduced && (
          <g
            aria-hidden
            style={{
              transformOrigin: `${CX}px ${CY}px`,
              animation: 'tc-sweep 9s linear infinite',
              animationPlayState: animating ? 'running' : 'paused',
              // will-change only while the sweep is actually spinning; dropped
              // the moment it pauses so an idle figure holds no compositor hint.
              willChange: animating ? 'transform' : 'auto',
              opacity: shown ? 1 : 0,
              transition: 'opacity 900ms ease-out',
            }}
          >
            <path
              d={`M ${CX} ${CY} L ${CX + 360} ${CY - 150} A 390 390 0 0 1 ${CX + 360} ${CY + 150} Z`}
              fill={`url(#${gradId}-sweep)`}
            />
            <line
              x1={CX}
              y1={CY}
              x2={CX + 388}
              y2={CY}
              stroke={CYAN}
              strokeOpacity={0.22}
              strokeWidth={1}
            />
          </g>
        )}

        {/* ── filament layer: shared-genre links ──────────────────────────── */}
        {isConstellation && (
          <g aria-hidden>
            {links.map((link, i) => {
              const a = stars[link.a]
              const b = stars[link.b]
              const lit =
                litSet !== null &&
                litSet.has(link.a) &&
                litSet.has(link.b) &&
                (link.a === active || link.b === active)
              const dim = litSet !== null && !lit

              // Draw-in: the line is its own length of dash, offset off-screen,
              // then offset → 0 once revealed. Transform/opacity-safe; the
              // global CSS floor + the shown=true-on-reduced path land it
              // composed instantly.
              const dash = maxLen + 4
              const drawDelay = 360 + i * 55
              const baseOpacity = lit ? 0.7 : dim ? 0.05 : 0.15

              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={CYAN}
                  strokeWidth={lit ? 1.4 : 1}
                  strokeDasharray={dash}
                  strokeDashoffset={shown ? 0 : dash}
                  style={{
                    strokeOpacity: shown ? baseOpacity : 0,
                    transition: reduced
                      ? undefined
                      : `stroke-dashoffset 700ms cubic-bezier(0.16,1,0.3,1) ${drawDelay}ms, stroke-opacity 300ms ease-out, stroke-width 300ms ease-out`,
                    filter: lit ? `drop-shadow(0 0 3px ${CYAN})` : undefined,
                  }}
                />
              )
            })}
          </g>
        )}

        {/* ── star layer ──────────────────────────────────────────────────── */}
        <g>
          {stars.map((s, i) => {
            const isActive = active === i
            const inLit = litSet?.has(i) ?? false
            const dimmed = litSet !== null && !inLit
            const fill = s.isTopFive ? `url(#${gradId}-gold)` : `url(#${gradId}-cyan)`
            const coreColor = s.isTopFive ? GOLD : CYAN
            const haloR = s.r * (isActive ? 3.4 : 2.4)
            const glowPx = (s.isTopFive ? 7 : 4) + (isActive ? 5 : 0)
            const shares = sharedCount(layout, i)
            const label = `${s.artist.name}, rank ${s.artist.rank}${
              isConstellation
                ? `, ${shares} shared-genre ${shares === 1 ? 'link' : 'links'}`
                : ''
            }`

            // Entrance: brightest (low-rank) cores land first; later ranks
            // stagger out. The group scales + lifts from the star's own centre
            // so the motion is transform/opacity only and never reflows.
            const revealDelay = 120 + s.revealOrder * 620
            const composed = shown
            const groupOpacity = composed ? (dimmed ? 0.32 : 1) : 0
            const groupTransform = composed
              ? 'translateY(0) scale(1)'
              : 'translateY(10px) scale(0.6)'

            return (
              <g
                key={s.artist.id}
                tabIndex={0}
                role="button"
                aria-label={label}
                className="cursor-pointer outline-none"
                style={{
                  opacity: groupOpacity,
                  transform: groupTransform,
                  transformOrigin: `${s.x}px ${s.y}px`,
                  transition: reduced
                    ? undefined
                    : `opacity 520ms ease-out ${revealDelay}ms, transform 620ms cubic-bezier(0.16,1,0.3,1) ${revealDelay}ms`,
                }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive((cur) => (cur === i ? null : cur))}
              >
                <title>{label}</title>

                {/* top-five gold cores breathe a soft halo pulse — opacity-only
                    scale on a dedicated ring so the core itself never moves.
                    Removed under reduced motion via the global CSS floor. */}
                {s.isTopFive && !reduced && (
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r={s.r + 6}
                    fill="none"
                    stroke={GOLD}
                    strokeWidth={1}
                    style={{
                      transformOrigin: `${s.x}px ${s.y}px`,
                      animation: `tc-breathe ${4.5 + s.twinkleDelay * 0.3}s ease-in-out ${s.twinkleDelay}s infinite`,
                      animationPlayState: animating ? 'running' : 'paused',
                    }}
                  />
                )}

                {/* soft glow halo */}
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={haloR}
                  fill={fill}
                  className="hud-glow transition-opacity duration-300"
                  style={{
                    opacity: (isActive ? 0.55 : 0.3) * s.brightness,
                  }}
                />

                {/* the star core — opacity twinkles; the global reduced-motion
                    floor freezes it to its painted state. */}
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={s.r}
                  fill={s.isTopFive ? '#FFF6DD' : '#EAF7FF'}
                  stroke={coreColor}
                  strokeWidth={isActive ? 1.6 : 1}
                  className="animate-online-pulse motion-reduce:animate-none transition-[stroke-width] duration-300"
                  style={{
                    opacity: s.brightness,
                    animationDelay: `${s.twinkleDelay}s`,
                    animationDuration: `${s.twinkleDur}s`,
                    animationPlayState: animating ? 'running' : 'paused',
                    filter: `drop-shadow(0 0 ${glowPx}px ${coreColor})`,
                  }}
                />

                {/* gold ring marks the top-five cores even before hover */}
                {s.isTopFive && (
                  <circle
                    cx={s.x}
                    cy={s.y}
                    r={s.r + 3.5}
                    fill="none"
                    stroke={GOLD}
                    strokeWidth={1}
                    strokeOpacity={isActive ? 0.9 : 0.5}
                    className="transition-[stroke-opacity] duration-300"
                  />
                )}
              </g>
            )
          })}
        </g>

        {/* ── hover/focus label ───────────────────────────────────────────── */}
        {activeStar && (
          <StarLabel
            star={activeStar}
            shared={activeShared}
            isConstellation={isConstellation}
          />
        )}
      </svg>

      {/* live region: announces the engaged star to screen readers without
          relying on the visual SVG label. */}
      <p className="sr-only" aria-live="polite">
        {activeStar
          ? `${activeStar.artist.name}, rank ${activeStar.artist.rank}${
              isConstellation
                ? `, ${activeShared} shared-genre ${
                    activeShared === 1 ? 'connection' : 'connections'
                  }`
                : ''
            }`
          : ''}
      </p>

      {/* Component-scoped keyframes. Both are pure transform/opacity and are
          force-stilled by the global `prefers-reduced-motion` CSS floor; the
          sweep + breathe elements are additionally JS-gated out entirely under
          reduced motion above. Local <style> keeps the file self-contained — no
          edit to the shared tailwind config. */}
      <style>{`
        @keyframes tc-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes tc-breathe {
          0%, 100% { opacity: 0.5; transform: scale(0.9); }
          50% { opacity: 0.95; transform: scale(1.12); }
        }
      `}</style>
    </figure>
  )
}

// ── In-SVG hover label ──────────────────────────────────────────────────────
// A compact mono readout anchored near the engaged star, flipped to stay inside
// the viewBox. Drawn in SVG units so it tracks the star precisely. It fades +
// lifts in on each engage (opacity/transform only) for a smooth feel.

function StarLabel({
  star,
  shared,
  isConstellation,
}: {
  star: Star
  shared: number
  isConstellation: boolean
}) {
  const name = star.artist.name
  const genres = [...star.genreSet]
  const sub = isConstellation
    ? `RANK ${star.artist.rank} · ${shared} SHARED ${shared === 1 ? 'GENRE' : 'GENRES'}`
    : `RANK ${star.artist.rank}`
  const genreLine =
    genres.length > 0 ? genres.slice(0, 3).join(' · ').toUpperCase() : 'NO GENRE DATA'

  const boxW = Math.max(name.length * 8.5, sub.length * 6.4, genreLine.length * 6.2, 96) + 20
  const boxH = 50
  const flipX = star.x + boxW + 18 > VIEW_W
  const flipY = star.y - boxH - 14 < 0
  const bx = flipX ? star.x - boxW - 12 : star.x + 12
  const by = flipY ? star.y + 12 : star.y - boxH - 12

  return (
    <g
      aria-hidden
      pointerEvents="none"
      style={{
        transformOrigin: `${star.x}px ${star.y}px`,
        animation: 'tc-label-in 180ms cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      <line
        x1={star.x}
        y1={star.y}
        x2={flipX ? bx + boxW : bx}
        y2={flipY ? by : by + boxH}
        stroke={CYAN}
        strokeWidth={1}
        strokeOpacity={0.5}
      />
      <rect
        x={bx}
        y={by}
        width={boxW}
        height={boxH}
        rx={4}
        fill="#0C1016"
        fillOpacity={0.94}
        stroke={star.isTopFive ? GOLD : CYAN}
        strokeOpacity={0.7}
        strokeWidth={1}
      />
      <text
        x={bx + 10}
        y={by + 19}
        fill="#E8EDF2"
        className="font-mono"
        fontSize={13}
        fontWeight={600}
      >
        {name}
      </text>
      <text
        x={bx + 10}
        y={by + 33}
        fill={star.isTopFive ? GOLD : CYAN}
        className="font-mono"
        fontSize={9}
        letterSpacing="1"
      >
        {sub}
      </text>
      <text
        x={bx + 10}
        y={by + 44}
        fill="#7C8896"
        className="font-mono"
        fontSize={8.5}
        letterSpacing="0.5"
      >
        {genreLine}
      </text>
      <style>{`
        @keyframes tc-label-in {
          from { opacity: 0; transform: translateY(4px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </g>
  )
}

// ── Demo export ─────────────────────────────────────────────────────────────
// Zero-arg preview used for isolated rendering + type-checking. Uses the
// medium-term fixture, which has real (if sparse) genres — exercising both the
// constellation path and graceful per-star empty-genre handling.

export function TasteConstellationDemo() {
  return (
    <div className="bg-ink-bg p-6">
      <TasteConstellation artists={fxArtists.medium} windowLabel="6 MONTHS" />
    </div>
  )
}
