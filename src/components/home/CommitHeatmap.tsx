'use client'

import { useEffect, useState } from 'react'

// GitHub-style contribution heatmap in the cyan ramp, wired to the real public
// GitHub contributions calendar via /api/github-contributions. Shows the most
// recent 26 weeks. If the source is down it degrades gracefully to an honest
// "unavailable" note rather than a fabricated grid.

type GhDay = { date: string; count: number; level: number }
type GhData = { total: number; days: GhDay[] }

const LEVEL_FILL = [
  'rgba(91,200,255,0.06)',
  'rgba(91,200,255,0.22)',
  'rgba(91,200,255,0.42)',
  'rgba(91,200,255,0.66)',
  '#5BC8FF',
]

const WEEKS = 26

function levelFor(count: number, level: number) {
  if (level >= 0 && level <= 4) return level
  if (!count) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 9) return 3
  return 4
}

function Cell({ fill, title }: { fill: string; title?: string }) {
  return (
    <div
      title={title}
      className="aspect-square w-full rounded-[2.5px]"
      style={{ backgroundColor: fill }}
    />
  )
}

export function CommitHeatmap() {
  const [gh, setGh] = useState<GhData | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    fetch('/api/github-contributions')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive) return
        if (d && Array.isArray(d.days) && d.days.length) setGh(d)
        else setFailed(true)
      })
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [])

  // Bucket the last 26*7 days into week columns of 7 rows.
  const recent = gh ? gh.days.slice(-WEEKS * 7) : []
  const weeks: GhDay[][] = []
  for (let i = 0; i < recent.length; i += 7) {
    weeks.push(recent.slice(i, i + 7))
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-accent/15 bg-gradient-to-b from-ink-surface to-[#0A0E14]">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
      />
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="font-mono text-xs uppercase tracking-[0.05em] text-ink-muted">
          // commit <span className="text-accent">activity</span>
        </div>
        <div className="rounded-md border border-[#46E5A0]/25 bg-[#46E5A0]/10 px-2 py-1 font-mono text-[10.5px] tracking-[0.04em] text-[#46E5A0]">
          26 wks
        </div>
      </div>

      <div className="px-5 py-4">
        {gh ? (
          <div
            className="grid gap-[4px]"
            style={{
              gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
              gridAutoFlow: 'column',
              gridTemplateRows: 'repeat(7, 1fr)',
            }}
          >
            {weeks.map((w, wi) =>
              w.map((d, di) => (
                <Cell
                  key={`${wi}-${di}`}
                  fill={LEVEL_FILL[levelFor(d.count, d.level)]}
                  title={`${d.date}: ${d.count}`}
                />
              ))
            )}
          </div>
        ) : (
          <div className="grid h-[88px] place-items-center font-mono text-[11px] text-ink-muted">
            {failed ? 'contributions unavailable' : 'loading contributions…'}
          </div>
        )}

        <div className="mt-3.5 flex items-center justify-between font-mono text-[10.5px] text-ink-muted">
          <span>build-in-public · half a year</span>
          <span className="flex items-center gap-1">
            less
            {LEVEL_FILL.map((f) => (
              <span
                key={f}
                className="h-2.5 w-2.5 rounded-[2px]"
                style={{ backgroundColor: f }}
              />
            ))}
            more
          </span>
        </div>
      </div>
    </div>
  )
}
