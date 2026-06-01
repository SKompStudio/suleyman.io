'use client'

import { useLens } from './lens'
import clsx from 'clsx'

// ── The System Console — the agentic OS as a living architecture map. ─────────
// Every label is a REAL, non-proprietary fact: a 4-device Tailscale mesh with
// Syncthing vault sync, an always-on Ryzen 9 / RTX 3080 server running local
// models (Whisper, Ollama qwen2.5) + the agent layer (orchestrator -> workers
// behind fail-closed gates, email watchers, scheduled briefings, weekly
// deep-research). Self-monitoring + self-healing. Inspired by Karpathy's
// LLM-OS / LLM-Wiki memory pattern. NO fabricated telemetry, no client/MHC
// internals, no Tailscale IPs.

type Kind = 'device' | 'hub' | 'agent'
type Node = { id: string; x: number; y: number; label: string; sub: string; kind: Kind }

// Three readable tiers: clients (top) -> server hub (center) -> agent layer.
const NODES: Node[] = [
  { id: 'm5', x: 150, y: 64, label: 'M5 MacBook Pro', sub: 'primary dev', kind: 'device' },
  { id: 'mbp', x: 320, y: 64, label: 'MacBook Pro', sub: 'dev', kind: 'device' },
  { id: 'iphone', x: 490, y: 64, label: 'iPhone 15 Pro', sub: 'control surface', kind: 'device' },
  { id: 'hub', x: 320, y: 250, label: 'server', sub: 'ryzen 9 · rtx 3080 · always-on', kind: 'hub' },
  { id: 'orch', x: 92, y: 420, label: 'orchestrator', sub: '→ workers', kind: 'agent' },
  { id: 'watch', x: 244, y: 438, label: 'watchers', sub: 'email · ~30s', kind: 'agent' },
  { id: 'brief', x: 396, y: 438, label: 'briefings', sub: 'nightly · weekday', kind: 'agent' },
  { id: 'research', x: 548, y: 420, label: 'deep-research', sub: 'weekly → vaults', kind: 'agent' },
]
const N = Object.fromEntries(NODES.map((n) => [n.id, n]))

// Device -> hub over Tailscale; hub -> agents (the orchestrator dispatching).
const LINKS: { from: string; to: string; delay: number }[] = [
  { from: 'm5', to: 'hub', delay: 0 },
  { from: 'mbp', to: 'hub', delay: 0.5 },
  { from: 'iphone', to: 'hub', delay: 1.0 },
  { from: 'hub', to: 'orch', delay: 0.3 },
  { from: 'hub', to: 'watch', delay: 1.1 },
  { from: 'hub', to: 'brief', delay: 0.7 },
  { from: 'hub', to: 'research', delay: 1.5 },
]

const READOUTS: { k: string; v: string }[] = [
  { k: 'hub', v: 'ryzen 9 5900x · rtx 3080 · 64gb' },
  { k: 'network', v: 'tailscale private mesh' },
  { k: 'sync', v: 'syncthing · live vaults + git history' },
  { k: 'local models', v: 'whisper · ollama qwen2.5' },
  { k: 'health', v: 'self-monitoring · auto-recovers' },
  { k: 'watchers', v: 'email-triggered · ~30s' },
  { k: 'research', v: 'weekly deep-research → vaults' },
  { k: 'model', v: 'orchestrator → worker · fail-closed gates' },
  { k: 'memory', v: 'layered: session → project → vaults' },
  { k: 'runtime', v: 'claude · opus / sonnet / haiku' },
]

function ZoneLabel({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} className="font-mono" fontSize={12} fill="#5BC8FF" fillOpacity={0.55} letterSpacing="2">
      {children}
    </text>
  )
}

function FabricLabel({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" className="font-mono" fontSize={12} fill="#5BC8FF" fillOpacity={0.9} letterSpacing="0.5">
      {children}
    </text>
  )
}

function SystemMap({ warm }: { warm: boolean }) {
  const c = warm ? '#E6D9B8' : '#5BC8FF'
  return (
    <svg
      viewBox="0 0 640 480"
      role="img"
      aria-label="Agentic OS architecture: an M5 MacBook Pro, a MacBook Pro, and an iPhone connect over a Tailscale mesh with Syncthing vault sync to an always-on Ryzen 9 / RTX 3080 server. The server runs local models (Whisper, Ollama qwen2.5) and an agent layer: an orchestrator dispatching workers behind fail-closed gates, email watchers, scheduled briefings, and weekly deep-research."
      className="w-full"
    >
      {/* Tier labels down the left edge */}
      <ZoneLabel x={6} y={34}>CLIENTS</ZoneLabel>
      <ZoneLabel x={6} y={224}>HUB</ZoneLabel>
      <ZoneLabel x={6} y={392}>AGENTS</ZoneLabel>

      {/* Syncthing: a continuous sync fabric across the client tier */}
      <path
        d={`M${N.m5.x} 64 L${N.mbp.x} 64 L${N.iphone.x} 64`}
        stroke={c}
        strokeOpacity={0.3}
        strokeWidth={1}
        strokeDasharray="2 6"
        fill="none"
      />
      <FabricLabel x={320} y={30}>syncthing · live vault sync</FabricLabel>

      {/* Links + traveling data-pulses */}
      {LINKS.map(({ from, to, delay }) => {
        const a = N[from]
        const b = N[to]
        const d = `M${a.x} ${a.y} L${b.x} ${b.y}`
        return (
          <g key={`${from}-${to}`}>
            <path d={d} stroke={c} strokeOpacity={0.3} strokeWidth={1.2} fill="none" />
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

      {/* Tailscale label on the device->hub mesh */}
      <FabricLabel x={432} y={158}>tailscale mesh</FabricLabel>

      {/* Local-models tag beside the hub */}
      <g transform="translate(384 244)">
        <rect x={0} y={-13} width={158} height={26} rx={5} fill="#0A0E14" stroke={c} strokeOpacity={0.4} />
        <text x={79} y={5} textAnchor="middle" className="font-mono" fontSize={11} fill={c} fillOpacity={0.95}>
          whisper · ollama qwen2.5
        </text>
      </g>

      {/* Nodes */}
      {NODES.map((n) => {
        const isHub = n.kind === 'hub'
        const r = isHub ? 14 : 6.5
        const labelAbove = n.kind !== 'agent'
        return (
          <g key={n.id}>
            {isHub && (
              <circle cx={n.x} cy={n.y} r={26} fill="none" stroke={c} strokeOpacity={0.45} strokeWidth={1.2} />
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={r}
              fill={isHub ? c : '#0A0E14'}
              stroke={c}
              strokeWidth={2}
              style={{ filter: `drop-shadow(0 0 ${isHub ? 10 : 4}px ${c})` }}
            />
            {isHub && (
              <circle
                cx={n.x}
                cy={n.y}
                r={r}
                fill={c}
                fillOpacity={0.5}
                className="hud-pulse animate-online-pulse"
              />
            )}
            <text
              x={n.x}
              y={labelAbove ? n.y - (isHub ? 26 : 18) : n.y + 26}
              textAnchor="middle"
              fill="#EAF0F6"
              className="font-mono"
              fontSize={isHub ? 20 : 16}
              fontWeight={isHub ? 600 : 500}
            >
              {n.label}
            </text>
            <text
              x={n.x}
              y={labelAbove ? n.y - (isHub ? 8 : 3) : n.y + 41}
              textAnchor="middle"
              fill="#94A0AE"
              className="font-mono"
              fontSize={12}
            >
              {n.sub}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function SystemConsole() {
  const { lens } = useLens()
  const warm = lens === 'eng'

  return (
    <div
      className={clsx(
        'hud-brackets relative overflow-hidden rounded-xl border bg-ink-surface/40 p-5 sm:p-7',
        warm ? 'border-engineering/30' : 'border-accent/25'
      )}
    >
      <div className="hud-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative">
        {/* Title bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-mono text-sm leading-tight text-ink-text">
            <span className="text-accent">~/agentic-os</span>
            <span className="ml-3 text-xs text-ink-muted">inspired by Karpathy&apos;s LLM-OS</span>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-accent">
            <span aria-hidden className="hud-pulse animate-online-pulse">
              ●
            </span>
            online
          </span>
        </div>

        {/* The living architecture map — the centerpiece, full width. */}
        <div className="mt-6 rounded-lg border border-white/5 bg-black/30 p-4 sm:p-6">
          <div className="mx-auto max-w-3xl">
            <SystemMap warm={warm} />
          </div>
        </div>

        {/* Console readouts, below the map in two columns. */}
        <dl className="mt-6 grid grid-cols-1 gap-x-10 font-mono text-xs sm:grid-cols-2">
          {READOUTS.map((r) => (
            <div
              key={r.k}
              className="flex items-baseline justify-between gap-4 border-b border-white/5 py-2"
            >
              <dt className="text-accent/70">{r.k}</dt>
              <dd className="text-right font-medium text-ink-text">{r.v}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 max-w-2xl font-sans text-base text-zinc-300">
          A personal multi-agent operating system I built and run across my own
          machines. It watches itself: health checks catch stuck or failed runs
          and recover them automatically, and autonomous work ships only behind
          deterministic, fail-closed gates. Scheduled briefings and weekly
          deep-research compound into a layered memory of knowledge vaults,
          always-on watchers handle document workflows from email, and an
          orchestrator dispatches workers. Architecture after Andrej Karpathy&apos;s
          LLM-OS and his LLM-Wiki memory pattern. Built on Claude.
        </p>
      </div>
    </div>
  )
}
