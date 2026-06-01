'use client'

import { useEffect, useState } from 'react'

// Live system telemetry — REAL data only. GitHub public contribution calendar
// + LeetCode solved count. If a source fails, that panel hides (never faked).

type GhDay = { date: string; count: number; level: number }
type GhData = { total: number; days: GhDay[] }
type LcData = { solved: number; ranking: number | null }

const LEVEL_FILL = [
  'rgba(91,200,255,0.06)',
  'rgba(91,200,255,0.25)',
  'rgba(91,200,255,0.45)',
  'rgba(91,200,255,0.7)',
  'rgba(91,200,255,1)',
]

function levelFor(count: number, level: number) {
  if (level >= 0 && level <= 4) return level
  if (!count) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 9) return 3
  return 4
}

function GithubHeatmap({ data }: { data: GhData }) {
  // Bucket days into week columns (7 rows). API returns chronological days.
  const weeks: GhDay[][] = []
  let week: GhDay[] = []
  for (const day of data.days) {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length) weeks.push(week)

  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-xs">
        <span className="text-ink-muted">github · contributions</span>
        <span className="text-ink-text">
          {data.total.toLocaleString()} this year
        </span>
      </div>
      <div
        className="mt-3 grid grid-flow-col gap-[3px] overflow-hidden"
        style={{ gridTemplateRows: 'repeat(7, 1fr)' }}
      >
        {weeks.map((w, wi) =>
          w.map((d, di) => (
            <div
              key={`${wi}-${di}`}
              title={`${d.date}: ${d.count}`}
              className="aspect-square w-full rounded-[2px]"
              style={{ backgroundColor: LEVEL_FILL[levelFor(d.count, d.level)] }}
            />
          ))
        )}
      </div>
    </div>
  )
}

export function LiveSignals() {
  const [gh, setGh] = useState<GhData | null>(null)
  const [lc, setLc] = useState<LcData | null>(null)

  useEffect(() => {
    let alive = true

    fetch('/api/github-contributions')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d && Array.isArray(d.days) && d.days.length) setGh(d)
      })
      .catch(() => {})

    fetch('/api/leetcode')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive || !d) return
        const solved = d.totalSolved ?? d.solved ?? null
        if (solved != null) {
          setLc({ solved, ranking: d.ranking ?? null })
        }
      })
      .catch(() => {})

    return () => {
      alive = false
    }
  }, [])

  if (!gh && !lc) return null

  return (
    <div className="rounded-xl border border-accent/20 bg-ink-surface/40 p-5 sm:p-6">
      <div className="flex items-center gap-2 font-mono text-xs text-accent">
        <span aria-hidden className="hud-pulse animate-online-pulse">
          ●
        </span>
        live signals
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[3fr_1fr] lg:gap-10">
        {gh ? (
          <GithubHeatmap data={gh} />
        ) : (
          <div className="font-mono text-xs text-ink-muted">
            github · contributions unavailable
          </div>
        )}

        {lc && (
          <div className="self-end font-mono text-xs">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-ink-muted">leetcode · solved</span>
              <span className="text-ink-text">{lc.solved}</span>
            </div>
            {lc.ranking != null && (
              <div className="mt-2 flex items-baseline justify-between gap-4">
                <span className="text-ink-muted">ranking</span>
                <span className="text-ink-text">
                  {lc.ranking.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
