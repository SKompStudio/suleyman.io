'use client'

import { useMemo } from 'react'
import type { Project } from '@/lib/projects'

// ── Signature graphic: the tech-stack constellation. ─────────────────────────
// A real graph of the portfolio: the most-shared technologies become hub stars,
// each wired to the projects that use them. Pure data — every edge is a real
// (project uses tech) relation pulled from the live `tech[]` arrays. Layout is
// deterministic (angle by index) so the server and client render identically;
// motion is transform/opacity-only and killed under prefers-reduced-motion by
// the global floor + the `hud-pulse` guard.

const CX = 320
const CY = 235
const VB_W = 640
const VB_H = 470

// Normalize tech labels so "Next.js 15" / "Next.js" / "next" collapse to one star.
function canon(raw: string): string {
  const t = raw.toLowerCase()
  if (t.includes('next')) return 'Next.js'
  if (t.includes('typescript') || t === 'ts') return 'TypeScript'
  if (t.includes('react')) return 'React'
  if (t.includes('postgres') || t.includes('prisma')) return 'Postgres'
  if (t.includes('python')) return 'Python'
  if (t.includes('swift')) return 'Swift'
  if (t.includes('openai') || t.includes('gpt') || t === 'ai') return 'OpenAI'
  if (t.includes('aws')) return 'AWS'
  if (t.includes('tailwind')) return 'Tailwind'
  if (t.includes('node')) return 'Node'
  if (t.includes('flutter') || t.includes('dart')) return 'Flutter'
  if (t.includes('django')) return 'Django'
  return raw
}

type Star = { tech: string; count: number; x: number; y: number }
type Edge = { x1: number; y1: number; x2: number; y2: number; i: number }

function build(projects: Project[]) {
  const counts = new Map<string, number>()
  for (const p of projects) {
    const seen = new Set<string>()
    for (const t of p.tech ?? []) {
      const c = canon(t)
      if (seen.has(c)) continue
      seen.add(c)
      counts.set(c, (counts.get(c) ?? 0) + 1)
    }
  }

  // Keep the technologies shared by 2+ projects — those are the constellation's
  // structural stars. Cap to the strongest 9 for a legible figure.
  const stars0 = Array.from(counts.entries())
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 9)

  const n = stars0.length
  const R = 168
  const stars: Star[] = stars0.map(([tech, count], i) => {
    const angle = (i / Math.max(n, 1)) * Math.PI * 2 - Math.PI / 2
    return {
      tech,
      count,
      x: CX + Math.cos(angle) * R,
      y: CY + Math.sin(angle) * (R * 0.82),
    }
  })

  // Edges: hub -> every star, weighted by shared-project count.
  const edges: Edge[] = stars.map((s, i) => ({
    x1: CX,
    y1: CY,
    x2: s.x,
    y2: s.y,
    i,
  }))

  return { stars, edges, total: projects.length }
}

export function TechConstellation({ projects }: { projects: Project[] }) {
  const { stars, edges, total } = useMemo(() => build(projects), [projects])

  if (stars.length === 0) {
    return (
      <div className="flex h-full min-h-[180px] items-center justify-center rounded-lg border border-white/5 bg-black/30 p-6">
        <span className="font-mono text-xs text-ink-muted">
          tech graph unavailable — no shared stack detected
        </span>
      </div>
    )
  }

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-label={`Technology constellation across ${total} projects: ${stars
        .map((s) => `${s.tech} in ${s.count} projects`)
        .join(', ')}.`}
      className="w-full"
    >
      {/* Edges + traveling data-pulses (hub -> each shared-tech star) */}
      {edges.map((e) => {
        const d = `M${e.x1} ${e.y1} L${e.x2} ${e.y2}`
        return (
          <g key={`e-${e.i}`}>
            <path d={d} stroke="#5BC8FF" strokeOpacity={0.22} strokeWidth={1} fill="none" />
            <path
              d={d}
              stroke="#5BC8FF"
              strokeWidth={2.2}
              fill="none"
              strokeLinecap="round"
              strokeDasharray="8 26"
              className="hud-pulse animate-data-pulse"
              style={{ animationDelay: `${(e.i % 6) * 0.42}s`, filter: 'drop-shadow(0 0 3px #5BC8FF)' }}
            />
          </g>
        )
      })}

      {/* Shared-tech stars */}
      {stars.map((s, i) => {
        const r = 4.5 + s.count * 1.6
        const labelBelow = s.y > CY
        return (
          <g key={`s-${s.tech}`}>
            <circle
              cx={s.x}
              cy={s.y}
              r={r}
              fill="#0A0E14"
              stroke="#5BC8FF"
              strokeWidth={1.8}
              style={{ filter: 'drop-shadow(0 0 4px #5BC8FF)' }}
            />
            <text
              x={s.x}
              y={labelBelow ? s.y + r + 16 : s.y - r - 8}
              textAnchor="middle"
              className="font-mono"
              fontSize={13}
              fill="#EAF0F6"
            >
              {s.tech}
            </text>
            <text
              x={s.x}
              y={labelBelow ? s.y + r + 30 : s.y - r - 22}
              textAnchor="middle"
              className="font-mono"
              fontSize={11}
              fill="#5BC8FF"
              fillOpacity={0.7}
            >
              ×{s.count}
            </text>
          </g>
        )
      })}

      {/* Central hub — the portfolio core */}
      <circle cx={CX} cy={CY} r={30} fill="none" stroke="#5BC8FF" strokeOpacity={0.4} strokeWidth={1.2} />
      <circle
        cx={CX}
        cy={CY}
        r={16}
        fill="#5BC8FF"
        style={{ filter: 'drop-shadow(0 0 12px #5BC8FF)' }}
      />
      <circle
        cx={CX}
        cy={CY}
        r={16}
        fill="#5BC8FF"
        fillOpacity={0.5}
        className="hud-pulse animate-online-pulse"
      />
      <text x={CX} y={CY + 4} textAnchor="middle" className="font-mono" fontSize={11} fontWeight={700} fill="#06080B">
        {total}
      </text>
    </svg>
  )
}
