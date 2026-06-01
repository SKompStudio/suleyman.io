'use client'

import { useMemo } from 'react'
import type { Project } from '@/lib/projects'
import type { LanguageStat } from '@/lib/github'

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

type Star = { tech: string; count: number; x: number; y: number; r: number }
type Edge = { x1: number; y1: number; x2: number; y2: number; i: number }

// Pure styling / build-config — not "languages I coded". Everything else
// (incl. C, C++, C#, PHP, Swift, Java, Dart, TeX, Jupyter, HTML) is kept so the
// constellation shows real range.
const SKIP_LANGS = new Set([
  'CSS', 'SCSS', 'Sass', 'Less', 'Stylus',
  'Dockerfile', 'Makefile', 'CMake', 'Procfile', 'Roff', 'Rich Text Format', 'Gnuplot',
])

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
      r: 4.5 + Math.sqrt(count) * 2.4,
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

  return { stars, edges, total: projects.length, more: [] as string[] }
}

// Real GitHub language footprint → constellation. Drops pure styling/config,
// ranks every real language by code volume (bytes), features a diverse top set,
// and lists the rest so nothing is hidden. Stars are sized on a compressed log
// scale so the leaders read big while the long tail stays visible and balanced.
// `count` is repoCount (the honest "×N" label); `total` stays the registry size.
function buildFromLanguages(langs: LanguageStat[], projectTotal: number) {
  const real = langs
    .filter((l) => l.bytes > 0 && !SKIP_LANGS.has(l.language))
    .sort((a, b) => b.bytes - a.bytes)

  // Pin the distinctive languages worth a star even when low-volume (the
  // coursework C / C++ / C# / PHP work), swapping out the lowest-volume
  // non-pinned entries to make room. Everything else spills into the "+ also"
  // tail so the full breadth is shown, never hidden.
  const PIN = new Set(['C', 'C++', 'C#', 'PHP', 'Swift', 'Java', 'Go', 'Rust', 'Kotlin'])
  const CAP = 14
  const top = real.slice(0, CAP)
  const missingPins = real.filter((l) => PIN.has(l.language) && !top.includes(l))
  let chosen = top
  if (missingPins.length) {
    const drop = new Set(
      top
        .filter((l) => !PIN.has(l.language))
        .sort((a, b) => a.bytes - b.bytes)
        .slice(0, missingPins.length)
    )
    chosen = [...top.filter((l) => !drop.has(l)), ...missingPins]
  }
  const stars0 = chosen.sort((a, b) => b.bytes - a.bytes)
  const more = real.filter((l) => !stars0.includes(l)).map((l) => l.language)
  const n = stars0.length
  const R = 172
  const maxLog = Math.log((stars0[0]?.bytes ?? 1) + 1) || 1
  const stars: Star[] = stars0.map((l, i) => {
    const angle = (i / Math.max(n, 1)) * Math.PI * 2 - Math.PI / 2
    const norm = Math.log(l.bytes + 1) / maxLog
    return {
      tech: l.language,
      count: l.repoCount,
      r: 4 + norm * 8,
      x: CX + Math.cos(angle) * R,
      y: CY + Math.sin(angle) * (R * 0.82),
    }
  })

  const edges: Edge[] = stars.map((s, i) => ({ x1: CX, y1: CY, x2: s.x, y2: s.y, i }))

  return { stars, edges, total: projectTotal, more }
}

export function TechConstellation({
  projects,
  languageStats,
}: {
  projects: Project[]
  languageStats?: LanguageStat[]
}) {
  const { stars, edges, total, more } = useMemo(
    () =>
      languageStats && languageStats.length > 0
        ? buildFromLanguages(languageStats, projects.length)
        : build(projects),
    [projects, languageStats]
  )

  if (stars.length === 0) {
    return (
      <div className="flex h-full min-h-[180px] items-center justify-center rounded-lg border border-white/5 bg-black/30 p-6">
        <span className="font-mono text-xs text-ink-muted">
          tech graph unavailable, no shared stack detected
        </span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-label={`Technology constellation across ${total} projects: ${stars
        .map((s) => `${s.tech} in ${s.count} repos`)
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
        const r = s.r
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
      {more.length > 0 && (
        <p className="mt-1 px-2 text-center font-mono text-[10.5px] leading-relaxed text-ink-muted">
          <span className="text-accent/70">+ also</span> {more.join(' · ')}
        </p>
      )}
    </div>
  )
}
