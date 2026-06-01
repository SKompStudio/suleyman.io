'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

// JARVIS algorithm-training telemetry console. REAL data only, fetched from the
// site's own /api/leetcode route. If the source is down or empty, a clean HUD
// empty state renders — never fabricated numbers.

interface LeetCodeData {
  totalSolved: number
  totalQuestions: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  totalEasy: number
  totalMedium: number
  totalHard: number
  ranking: number
  contributionPoint: number
  reputation: number
  submissionCalendar?: Record<string, number>
  recentSubmissions?: Array<{
    title: string
    titleSlug?: string
    timestamp: string | number
    statusDisplay: string
    lang?: string
  }>
}

const ACCENT = '#5BC8FF'
const GOLD = '#E8B84B'

type Tier = {
  key: 'easy' | 'medium' | 'hard'
  label: string
  solved: number
  total: number
  color: string
}

// ── motion-aware reveal gate ────────────────────────────────────────────────
// `ready` re-runs the effect once the observed node actually mounts. The ref'd
// div only renders in the ready branch, so a mount-only effect would observe a
// null node and the reveal would never fire (center stuck at 0).
function useReveal<T extends HTMLElement>(ready = true) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
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
      { rootMargin: '0px 0px -8% 0px', threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ready])
  return { ref, shown }
}

// Count-up that never shifts layout (fixed tabular width, transform-free text
// swap only). Honors reduced-motion by snapping to the final value.
function useCountUp(target: number, run: boolean, duration = 1100) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run, duration])
  return value
}

// ── signature: concentric arc-reactor difficulty rings ──────────────────────
function ReactorRings({
  tiers,
  total,
  shown,
}: {
  tiers: Tier[]
  total: number
  shown: boolean
}) {
  const count = useCountUp(total, shown)
  const size = 240
  const c = size / 2
  const radii = [98, 76, 54] // easy outer → hard inner

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${total} problems solved across difficulty tiers`}
      >
        <defs>
          <radialGradient id="reactor-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(91,200,255,0.18)" />
            <stop offset="60%" stopColor="rgba(91,200,255,0.04)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle cx={c} cy={c} r={104} fill="url(#reactor-core)" />
        {tiers.map((tier, i) => {
          const r = radii[i]
          const circ = 2 * Math.PI * r
          const pct = tier.total > 0 ? Math.min(1, tier.solved / tier.total) : 0
          const offset = shown ? circ * (1 - pct) : circ
          return (
            <g key={tier.key} transform={`rotate(-90 ${c} ${c})`}>
              <circle
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke="rgba(91,200,255,0.08)"
                strokeWidth={7}
              />
              <circle
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={tier.color}
                strokeWidth={7}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                style={{
                  transition: `stroke-dashoffset 1200ms cubic-bezier(0.16,1,0.3,1)`,
                  transitionDelay: `${i * 140}ms`,
                  filter: `drop-shadow(0 0 4px ${tier.color}66)`,
                }}
              />
            </g>
          )
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono text-5xl font-semibold tabular-nums"
          style={{ color: GOLD }}
        >
          {count}
        </span>
        <span className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
          solved
        </span>
      </div>
    </div>
  )
}

// ── animated difficulty bars ────────────────────────────────────────────────
function DifficultyBars({ tiers, shown }: { tiers: Tier[]; shown: boolean }) {
  return (
    <div className="space-y-5">
      {tiers.map((tier, i) => {
        const pct = tier.total > 0 ? (tier.solved / tier.total) * 100 : 0
        return (
          <div key={tier.key}>
            <div className="flex items-baseline justify-between font-mono text-xs">
              <span className="uppercase tracking-wider" style={{ color: tier.color }}>
                {tier.label}
              </span>
              <span className="tabular-nums text-ink-text">
                {tier.solved}
                <span className="text-ink-muted"> / {tier.total}</span>
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-accent/10">
              <div
                className="h-full rounded-full"
                style={{
                  width: shown ? `${pct}%` : '0%',
                  backgroundColor: tier.color,
                  boxShadow: `0 0 8px ${tier.color}66`,
                  transition: 'width 1100ms cubic-bezier(0.16,1,0.3,1)',
                  transitionDelay: `${250 + i * 120}ms`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── key telemetry readouts ──────────────────────────────────────────────────
function Readout({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="border-l-2 border-accent/30 pl-3">
      <div className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-ink-muted">
        {label}
      </div>
      <div
        className="mt-1 font-mono text-lg font-medium tabular-nums"
        style={{ color: accent ? GOLD : undefined }}
      >
        {value}
      </div>
    </div>
  )
}

// ── contribution heatmap from real submissionCalendar ───────────────────────
const HEAT_FILL = [
  'rgba(91,200,255,0.05)',
  'rgba(91,200,255,0.22)',
  'rgba(91,200,255,0.42)',
  'rgba(91,200,255,0.66)',
  'rgba(91,200,255,0.95)',
]

function levelFor(count: number) {
  if (!count) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 6) return 3
  return 4
}

function Heatmap({ calendar }: { calendar: Record<string, number> }) {
  // Build a fixed 53-week × 7-day grid ending today, from the real timestamp map.
  const { weeks, monthTicks, activeDays, peak } = useMemo(() => {
    const dayMap = new Map<string, number>()
    let activeDays = 0
    let peak = 0
    for (const [ts, count] of Object.entries(calendar)) {
      const d = new Date(parseInt(ts, 10) * 1000)
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`
      dayMap.set(key, count)
      if (count > 0) activeDays++
      if (count > peak) peak = count
    }

    const today = new Date()
    const end = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    )
    // Align grid end to the Saturday of the current week.
    const endAligned = new Date(end)
    endAligned.setUTCDate(endAligned.getUTCDate() + (6 - end.getUTCDay()))
    const TOTAL_WEEKS = 53
    const start = new Date(endAligned)
    start.setUTCDate(start.getUTCDate() - (TOTAL_WEEKS * 7 - 1))

    const weeks: { date: Date; count: number; level: number }[][] = []
    const monthTicks: { col: number; label: string }[] = []
    let lastMonth = -1
    const cursor = new Date(start)
    for (let w = 0; w < TOTAL_WEEKS; w++) {
      const col: { date: Date; count: number; level: number }[] = []
      for (let d = 0; d < 7; d++) {
        const key = `${cursor.getUTCFullYear()}-${cursor.getUTCMonth()}-${cursor.getUTCDate()}`
        const count = dayMap.get(key) ?? 0
        col.push({ date: new Date(cursor), count, level: levelFor(count) })
        if (d === 0) {
          const m = cursor.getUTCMonth()
          if (m !== lastMonth) {
            monthTicks.push({
              col: w,
              label: cursor.toLocaleString('en-US', {
                month: 'short',
                timeZone: 'UTC',
              }),
            })
            lastMonth = m
          }
        }
        cursor.setUTCDate(cursor.getUTCDate() + 1)
      }
      weeks.push(col)
    }
    return { weeks, monthTicks, activeDays, peak }
  }, [calendar])

  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-xs">
        <span className="text-accent">~/submission-calendar</span>
        <span className="text-ink-muted">
          {activeDays} active {activeDays === 1 ? 'day' : 'days'} · 53 weeks
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="inline-block min-w-full">
          <div
            className="grid gap-[3px]"
            style={{ gridTemplateColumns: `repeat(53, minmax(7px, 1fr))` }}
          >
            {weeks.map((_, wi) => {
              const tick = monthTicks.find((t) => t.col === wi)
              return (
                <span
                  key={wi}
                  className="h-3 font-mono text-[0.6rem] leading-none text-ink-muted"
                >
                  {tick ? tick.label : ''}
                </span>
              )
            })}
          </div>

          <div
            className="mt-1 grid gap-[3px]"
            style={{ gridTemplateColumns: `repeat(53, minmax(7px, 1fr))` }}
          >
            {weeks.map((col, wi) => (
              <div key={wi} className="grid grid-rows-7 gap-[3px]">
                {col.map((cell, di) => (
                  <div
                    key={di}
                    title={`${cell.date.toLocaleDateString('en-US', {
                      timeZone: 'UTC',
                    })}: ${cell.count} submission${cell.count === 1 ? '' : 's'}`}
                    className="aspect-square w-full rounded-[2px]"
                    style={{ backgroundColor: HEAT_FILL[cell.level] }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between font-mono text-[0.65rem] text-ink-muted">
        <span>{peak > 0 ? `peak ${peak}/day` : 'no submissions in window'}</span>
        <span className="flex items-center gap-1">
          less
          {HEAT_FILL.map((fill, i) => (
            <span
              key={i}
              className="inline-block h-2.5 w-2.5 rounded-[2px]"
              style={{ backgroundColor: fill }}
            />
          ))}
          more
        </span>
      </div>
    </div>
  )
}

// ── recent submissions event log ────────────────────────────────────────────
function EventLog({ subs }: { subs: NonNullable<LeetCodeData['recentSubmissions']> }) {
  return (
    <div>
      <div className="font-mono text-xs text-accent">~/recent-submissions</div>
      <ul className="mt-4 space-y-px font-mono text-xs">
        {subs.slice(0, 8).map((s, i) => {
          const ok = s.statusDisplay.toLowerCase().includes('accepted')
          const when = new Date(Number(s.timestamp) * 1000)
          const color = ok ? ACCENT : '#FF6B7A'
          return (
            <li
              key={i}
              className="flex items-center gap-3 border-b border-accent/10 py-2.5 last:border-b-0"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
              />
              {s.titleSlug ? (
                <a
                  href={`https://leetcode.com/problems/${s.titleSlug}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 truncate text-ink-text transition-colors hover:text-accent"
                >
                  {s.title}
                </a>
              ) : (
                <span className="min-w-0 flex-1 truncate text-ink-text">{s.title}</span>
              )}
              <span
                className="hidden flex-shrink-0 uppercase tracking-wider sm:inline"
                style={{ color }}
              >
                {ok ? 'AC' : s.statusDisplay}
              </span>
              <span className="flex-shrink-0 text-ink-muted">
                {when.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Panel({
  children,
  className = '',
  brackets = false,
}: {
  children: React.ReactNode
  className?: string
  brackets?: boolean
}) {
  return (
    <div
      className={`rounded-xl border border-accent/25 bg-ink-surface/40 p-6 sm:p-7 ${
        brackets ? 'hud-brackets' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

function SkeletonLine({ w }: { w: string }) {
  return <div className={`h-3 rounded bg-accent/10 ${w}`} />
}

export function StatsConsole() {
  const [stats, setStats] = useState<LeetCodeData | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const reactor = useReveal<HTMLDivElement>(status === 'ready')

  useEffect(() => {
    let alive = true
    fetch('/api/leetcode')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: LeetCodeData) => {
        if (!alive) return
        if (typeof d?.totalSolved !== 'number') {
          setStatus('error')
          return
        }
        setStats(d)
        setStatus('ready')
      })
      .catch(() => {
        if (alive) setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [])

  const tiers: Tier[] = stats
    ? [
        {
          key: 'easy',
          label: 'easy',
          solved: stats.easySolved,
          total: stats.totalEasy,
          color: ACCENT,
        },
        {
          key: 'medium',
          label: 'medium',
          solved: stats.mediumSolved,
          total: stats.totalMedium,
          color: GOLD,
        },
        {
          key: 'hard',
          label: 'hard',
          solved: stats.hardSolved,
          total: stats.totalHard,
          color: '#FF6B7A',
        },
      ]
    : []

  if (status === 'loading') {
    return (
      <Panel>
        <div className="flex items-center gap-2 font-mono text-xs text-accent">
          <span className="hud-pulse animate-online-pulse">●</span>
          establishing uplink…
        </div>
        <div className="mt-6 grid gap-4">
          <SkeletonLine w="w-2/3" />
          <SkeletonLine w="w-1/2" />
          <SkeletonLine w="w-5/6" />
          <SkeletonLine w="w-1/3" />
        </div>
      </Panel>
    )
  }

  if (status === 'error' || !stats) {
    return (
      <Panel brackets>
        <div className="flex items-center gap-2 font-mono text-xs text-ink-muted">
          <span style={{ color: '#FF6B7A' }}>●</span>
          ~/leetcode · uplink unavailable
        </div>
        <p className="mt-4 max-w-md font-mono text-sm text-ink-muted">
          The LeetCode telemetry feed is offline right now. No cached numbers are
          shown. This panel reflects live data only.
        </p>
        <a
          href="https://leetcode.com/kianis4"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block font-mono text-xs text-accent underline-offset-4 hover:underline"
        >
          view profile on leetcode →
        </a>
      </Panel>
    )
  }

  const attempted = stats.easySolved + stats.mediumSolved + stats.hardSolved
  const acceptanceRate =
    stats.totalSolved > 0
      ? Math.round((attempted / stats.totalSolved) * 100)
      : 0
  const coverage =
    stats.totalQuestions > 0
      ? ((stats.totalSolved / stats.totalQuestions) * 100).toFixed(1)
      : '0'
  const hasCalendar =
    !!stats.submissionCalendar && Object.keys(stats.submissionCalendar).length > 0
  const hasSubs = !!stats.recentSubmissions && stats.recentSubmissions.length > 0

  return (
    <div className="space-y-6">
      {/* Primary diagnostic: reactor rings + difficulty bars */}
      <Panel brackets>
        <div className="flex items-center gap-2 font-mono text-xs text-accent">
          <span className="hud-pulse animate-online-pulse">●</span>
          ~/difficulty-breakdown · live
        </div>

        <div
          ref={reactor.ref}
          className="mt-7 grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-12"
        >
          <ReactorRings tiers={tiers} total={stats.totalSolved} shown={reactor.shown} />
          <div className="w-full">
            <DifficultyBars tiers={tiers} shown={reactor.shown} />
            <p className="mt-6 font-mono text-[0.7rem] leading-relaxed text-ink-muted">
              {coverage}% of the {stats.totalQuestions.toLocaleString()} problem
              archive cleared. Rings: easy (outer) → hard (inner).
            </p>
          </div>
        </div>
      </Panel>

      {/* Telemetry readouts */}
      <Panel>
        <div className="font-mono text-xs text-accent">~/profile-telemetry</div>
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
          <Readout
            label="global rank"
            value={`#${stats.ranking.toLocaleString()}`}
            accent
          />
          <Readout label="acceptance" value={`${acceptanceRate}%`} />
          <Readout
            label="contribution"
            value={stats.contributionPoint.toLocaleString()}
          />
          <Readout label="reputation" value={stats.reputation.toLocaleString()} />
        </div>
      </Panel>

      {/* Heatmap */}
      {hasCalendar && (
        <Panel>
          <Heatmap calendar={stats.submissionCalendar!} />
        </Panel>
      )}

      {/* Event log */}
      {hasSubs && (
        <Panel>
          <EventLog subs={stats.recentSubmissions!} />
        </Panel>
      )}
    </div>
  )
}
