'use client'

// ── /setup client islands ─────────────────────────────────────────────────
// All visuals below are built from REAL, non-proprietary facts about the
// operator's workflow: a 4-device Tailscale private mesh with Syncthing live
// file sync, an always-on Ryzen 9 5900X / RTX 3080 / 64GB Linux server as the
// automation hub, local AI on the 3080 (Whisper transcription + Ollama
// qwen2.5), and an agent layer built on Claude (orchestrator -> workers behind
// fail-closed gates, ~30s email watchers, weekday/nightly briefings, weekly
// deep-research into RAG vaults). Motion is transform/opacity only and folds to
// a static final state under prefers-reduced-motion (enforced globally in CSS).

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

const CYAN = '#5BC8FF'
const GOLD = '#E8B84B'

// ── A small in-view hook so charts animate when scrolled to (final layout box
// occupied from frame 1; reduced-motion shows the final state immediately). ──
function useInView<T extends Element>() {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
      { threshold: 0.25 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, shown }
}

// ── 1. The signature: the system mesh ─────────────────────────────────────
// A more detailed take than the homepage console. Three readable tiers:
// client devices (Tailscale mesh + Syncthing fabric) -> the always-on server
// hub -> two lanes off the hub: a LOCAL-AI compute lane (RTX 3080) and the
// CLOUD agent lane (Claude). Directional pulses travel along every link.

type Node = {
  id: string
  x: number
  y: number
  label: string
  sub: string
  kind: 'device' | 'hub' | 'gpu' | 'agent'
}

const NODES: Node[] = [
  { id: 'm5', x: 110, y: 70, label: 'M5 MacBook Pro', sub: 'primary dev', kind: 'device' },
  { id: 'mbp', x: 300, y: 70, label: 'MacBook Pro', sub: 'secondary dev', kind: 'device' },
  { id: 'iphone', x: 490, y: 70, label: 'iPhone 15 Pro', sub: 'control surface', kind: 'device' },
  { id: 'hub', x: 300, y: 250, label: 'linux server', sub: 'ryzen 9 5900x · 64gb · always-on', kind: 'hub' },
  { id: 'gpu', x: 110, y: 420, label: 'RTX 3080', sub: 'whisper · ollama qwen2.5', kind: 'gpu' },
  { id: 'agent', x: 490, y: 420, label: 'agent layer', sub: 'claude · orchestrator → workers', kind: 'agent' },
]
const N = Object.fromEntries(NODES.map((n) => [n.id, n]))

const LINKS: { from: string; to: string; delay: number; warm?: boolean }[] = [
  { from: 'm5', to: 'hub', delay: 0 },
  { from: 'mbp', to: 'hub', delay: 0.4 },
  { from: 'iphone', to: 'hub', delay: 0.8 },
  { from: 'hub', to: 'gpu', delay: 0.3, warm: true },
  { from: 'hub', to: 'agent', delay: 1.0 },
]

function MeshNode({ n }: { n: Node }) {
  const isHub = n.kind === 'hub'
  const isGpu = n.kind === 'gpu'
  const c = isGpu ? GOLD : CYAN
  const r = isHub ? 15 : 7
  const above = n.kind === 'device'
  return (
    <g>
      {isHub && (
        <circle cx={n.x} cy={n.y} r={28} fill="none" stroke={CYAN} strokeOpacity={0.4} strokeWidth={1.2} />
      )}
      <circle
        cx={n.x}
        cy={n.y}
        r={r}
        fill={isHub ? CYAN : '#0A0E14'}
        stroke={c}
        strokeWidth={2}
        style={{ filter: `drop-shadow(0 0 ${isHub ? 10 : 4}px ${c})` }}
      />
      {isHub && (
        <circle cx={n.x} cy={n.y} r={r} fill={CYAN} fillOpacity={0.5} className="hud-pulse animate-online-pulse" />
      )}
      <text
        x={n.x}
        y={above ? n.y - 20 : n.y + 26}
        textAnchor="middle"
        fill="#EAF0F6"
        className="font-mono"
        fontSize={isHub ? 17 : 14}
        fontWeight={isHub ? 600 : 500}
      >
        {n.label}
      </text>
      <text
        x={n.x}
        y={above ? n.y - 5 : n.y + 41}
        textAnchor="middle"
        fill={isGpu ? GOLD : '#94A0AE'}
        fillOpacity={isGpu ? 0.95 : 1}
        className="font-mono"
        fontSize={11}
      >
        {n.sub}
      </text>
    </g>
  )
}

export function SystemMesh() {
  return (
    <svg
      viewBox="0 0 600 480"
      role="img"
      aria-label="Workflow architecture: an M5 MacBook Pro, a secondary MacBook Pro, and an iPhone 15 Pro form a Tailscale private mesh with Syncthing live file sync, connecting to an always-on Ryzen 9 5900X / 64GB Linux server. The server runs local AI on an RTX 3080 (Whisper transcription and Ollama qwen2.5) and a Claude-based agent layer that dispatches an orchestrator to worker agents."
      className="w-full"
    >
      {/* tier labels */}
      <text x={6} y={36} className="font-mono" fontSize={11} fill={CYAN} fillOpacity={0.5} letterSpacing="2">DEVICES</text>
      <text x={6} y={226} className="font-mono" fontSize={11} fill={CYAN} fillOpacity={0.5} letterSpacing="2">HUB</text>
      <text x={6} y={396} className="font-mono" fontSize={11} fill={CYAN} fillOpacity={0.5} letterSpacing="2">COMPUTE</text>

      {/* syncthing fabric across the device tier */}
      <path
        d={`M${N.m5.x} 70 L${N.mbp.x} 70 L${N.iphone.x} 70`}
        stroke={CYAN}
        strokeOpacity={0.3}
        strokeWidth={1}
        strokeDasharray="2 6"
        fill="none"
      />
      <text x={300} y={34} textAnchor="middle" className="font-mono" fontSize={11} fill={CYAN} fillOpacity={0.85}>
        syncthing · live vault sync
      </text>

      {/* links + traveling pulses */}
      {LINKS.map(({ from, to, delay, warm }) => {
        const a = N[from]
        const b = N[to]
        const c = warm ? GOLD : CYAN
        const d = `M${a.x} ${a.y} L${b.x} ${b.y}`
        return (
          <g key={`${from}-${to}`}>
            <path d={d} stroke={c} strokeOpacity={0.28} strokeWidth={1.2} fill="none" />
            <path
              d={d}
              stroke={c}
              strokeWidth={2.6}
              fill="none"
              strokeLinecap="round"
              strokeDasharray="10 28"
              className="hud-pulse animate-data-pulse"
              style={{ animationDelay: `${delay}s`, filter: `drop-shadow(0 0 4px ${c})` }}
            />
          </g>
        )
      })}

      <text x={432} y={160} textAnchor="middle" className="font-mono" fontSize={11} fill={CYAN} fillOpacity={0.85}>
        tailscale mesh
      </text>
      <text x={190} y={350} textAnchor="middle" className="font-mono" fontSize={11} fill={GOLD} fillOpacity={0.9}>
        local AI
      </text>
      <text x={418} y={350} textAnchor="middle" className="font-mono" fontSize={11} fill={CYAN} fillOpacity={0.85}>
        cloud agents
      </text>

      {NODES.map((n) => (
        <MeshNode key={n.id} n={n} />
      ))}
    </svg>
  )
}

// ── 2. Automation-cadence timeline ────────────────────────────────────────
// Real cadences plotted on a 24h day. Discrete scheduled events get markers at
// their hour; the always-on watchers render as a continuous band across the
// whole day. Bars grow via scaleX transform; markers fade/rise. Times are
// representative local-time slots (real cadences, not fabricated telemetry).

type Track =
  | { kind: 'continuous'; label: string; note: string; warm?: boolean }
  | { kind: 'points'; label: string; note: string; hours: number[]; warm?: boolean }

const TRACKS: Track[] = [
  { kind: 'continuous', label: 'email watchers', note: 'always-on · ~30s poll' },
  { kind: 'points', label: 'morning brief', note: 'weekday', hours: [7.5] },
  { kind: 'points', label: 'idea digest', note: 'weekday · local model', hours: [7.75] },
  { kind: 'points', label: 'data feeds', note: 'daily', hours: [6.5] },
  { kind: 'points', label: 'end-of-day', note: 'weekday', hours: [17.5] },
  { kind: 'points', label: 'night health', note: 'nightly · self-check', hours: [21.5] },
  { kind: 'points', label: 'deep-research', note: 'weekly → vaults', hours: [20], warm: true },
]

const HOUR_TICKS = [0, 6, 12, 18, 24]

export function CadenceTimeline() {
  const { ref, shown } = useInView<HTMLDivElement>()
  return (
    <div ref={ref}>
      {/* hour axis */}
      <div className="relative mb-3 ml-[8.5rem] hidden h-4 font-mono text-[10px] text-ink-muted sm:block">
        {HOUR_TICKS.map((h) => (
          <span
            key={h}
            className="absolute -translate-x-1/2"
            style={{ left: `${(h / 24) * 100}%` }}
          >
            {String(h).padStart(2, '0')}:00
          </span>
        ))}
      </div>

      <div className="space-y-2.5">
        {TRACKS.map((t, i) => {
          const c = t.warm ? 'text-gold' : 'text-accent'
          return (
            <div key={t.label} className="flex items-center gap-3">
              <div className="w-32 shrink-0 font-mono text-xs leading-tight">
                <div className="text-ink-text">{t.label}</div>
                <div className="text-[10px] text-ink-muted">{t.note}</div>
              </div>

              <div className="relative h-7 flex-1 rounded border border-white/5 bg-black/30">
                {/* faint hour gridlines */}
                {HOUR_TICKS.slice(1, -1).map((h) => (
                  <span
                    key={h}
                    aria-hidden
                    className="absolute top-0 h-full w-px bg-white/5"
                    style={{ left: `${(h / 24) * 100}%` }}
                  />
                ))}

                {t.kind === 'continuous' ? (
                  <span
                    className={clsx(
                      'absolute inset-y-1.5 left-1 right-1 origin-left rounded-sm bg-accent/25 transition-transform duration-700 ease-out',
                      shown ? 'scale-x-100' : 'scale-x-0',
                    )}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <span className="absolute inset-0 rounded-sm border border-accent/40" />
                  </span>
                ) : (
                  t.hours.map((h) => (
                    <span
                      key={h}
                      className={clsx(
                        'absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px] border transition-all duration-500 ease-out',
                        t.warm ? 'border-gold bg-gold/30' : 'border-accent bg-accent/30',
                        shown ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                      )}
                      style={{
                        left: `${(h / 24) * 100}%`,
                        transitionDelay: `${300 + i * 80}ms`,
                      }}
                    />
                  ))
                )}
                <span className={clsx('sr-only', c)} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── 3. Compute split — where the work runs ────────────────────────────────
// A conceptual split, not metered telemetry: heavy reasoning + multi-agent
// orchestration runs on Claude in the cloud; cheap/private/high-volume work
// (voice transcription, voice-note filtering, local LLM tasks) runs on the
// RTX 3080. Two animated bars grow to fixed, labeled proportions.

const COMPUTE: { label: string; pct: number; note: string; warm?: boolean }[] = [
  { label: 'local · RTX 3080', pct: 35, note: 'whisper · ollama qwen2.5 · cheap + private', warm: true },
  { label: 'cloud · Claude', pct: 65, note: 'orchestration · deep reasoning · workers' },
]

export function ComputeSplit() {
  const { ref, shown } = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className="space-y-5">
      {COMPUTE.map((row, i) => (
        <div key={row.label}>
          <div className="mb-1.5 flex items-baseline justify-between font-mono text-xs">
            <span className="text-ink-text">{row.label}</span>
            <span className={row.warm ? 'text-gold' : 'text-accent'}>{row.pct}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-black/40">
            <div
              className={clsx(
                'h-full origin-left rounded-full transition-transform duration-[900ms] ease-out',
                row.warm ? 'bg-gold/70' : 'bg-accent/70',
              )}
              style={{
                width: `${row.pct}%`,
                transform: shown ? 'scaleX(1)' : 'scaleX(0)',
                transitionDelay: `${i * 150}ms`,
                boxShadow: `0 0 8px ${row.warm ? GOLD : CYAN}55`,
              }}
            />
          </div>
          <p className="mt-1.5 font-mono text-[11px] text-ink-muted">{row.note}</p>
        </div>
      ))}
    </div>
  )
}
