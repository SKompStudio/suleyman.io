'use client'

import { useLens } from './lens'
import clsx from 'clsx'

// ── The System Console — the agentic OS as a living HUD/system map. ──────────
// Every number and label here is a REAL, non-proprietary fact (see the build
// spec): a 4-machine Tailscale mesh, ~22 skills/automations, always-on
// email-triggered watchers (~30s), scheduled briefings + weekly deep-research,
// orchestrator->worker with fail-closed gates, voice routing, RAG vaults,
// built on Claude. NO fabricated live telemetry — the cadences are static.

type Node = {
  id: string
  x: number
  y: number
  label: string
  sub: string
  kind: 'hub' | 'machine' | 'agent'
}

// Two tiers: the machine mesh (top) and the agent/automation layer (bottom),
// converging on the always-on server hub in the middle.
const NODES: Node[] = [
  { id: 'mac1', x: 120, y: 56, label: 'mac', sub: 'dev', kind: 'machine' },
  { id: 'mac2', x: 300, y: 56, label: 'mac', sub: 'dev', kind: 'machine' },
  { id: 'phone', x: 480, y: 56, label: 'iphone', sub: 'control', kind: 'machine' },
  { id: 'hub', x: 300, y: 168, label: 'server', sub: 'always-on hub', kind: 'hub' },
  { id: 'watch', x: 96, y: 280, label: 'watchers', sub: 'email · ~30s', kind: 'agent' },
  { id: 'brief', x: 240, y: 280, label: 'briefings', sub: 'nightly · daily', kind: 'agent' },
  { id: 'research', x: 384, y: 280, label: 'research', sub: 'weekly', kind: 'agent' },
  { id: 'voice', x: 504, y: 280, label: 'voice', sub: 'local model', kind: 'agent' },
]

const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]))

// Directional links. Top tier flows machines -> hub; bottom tier flows
// hub -> agent layer (the orchestrator dispatching workers).
const LINKS: { from: string; to: string; delay: number }[] = [
  { from: 'mac1', to: 'hub', delay: 0 },
  { from: 'mac2', to: 'hub', delay: 0.4 },
  { from: 'phone', to: 'hub', delay: 0.8 },
  { from: 'hub', to: 'watch', delay: 0.2 },
  { from: 'hub', to: 'brief', delay: 0.9 },
  { from: 'hub', to: 'research', delay: 1.4 },
  { from: 'hub', to: 'voice', delay: 0.6 },
]

const READOUTS: { k: string; v: string }[] = [
  { k: 'mesh', v: '4 machines · tailscale' },
  { k: 'skills', v: '~22 automations' },
  { k: 'health', v: 'self-monitoring · auto-recovers' },
  { k: 'watchers', v: 'email-triggered · ~30s' },
  { k: 'briefings', v: 'nightly health · weekday am/eod' },
  { k: 'research', v: 'weekly deep-research → vaults' },
  { k: 'model', v: 'orchestrator → worker · fail-closed gates' },
  { k: 'memory', v: 'layered: session → project → vaults' },
]

function SystemMap({ warm }: { warm: boolean }) {
  const stroke = warm ? '#E6D9B8' : '#5BC8FF'
  return (
    <svg
      viewBox="0 0 600 320"
      role="img"
      aria-label="Agentic OS system map: a four-machine Tailscale mesh feeding an always-on server hub that orchestrates email watchers, briefings, weekly research, and voice routing."
      className="w-full"
    >
      {/* Links + traveling data-pulses */}
      {LINKS.map(({ from, to, delay }) => {
        const a = NODE_BY_ID[from]
        const b = NODE_BY_ID[to]
        const d = `M${a.x} ${a.y} L${b.x} ${b.y}`
        return (
          <g key={`${from}-${to}`}>
            <path d={d} stroke={stroke} strokeOpacity={0.32} strokeWidth={1} fill="none" />
            <path
              d={d}
              stroke={stroke}
              strokeWidth={2.2}
              fill="none"
              strokeLinecap="round"
              strokeDasharray="9 26"
              className="hud-pulse animate-data-pulse"
              style={{ animationDelay: `${delay}s`, filter: `drop-shadow(0 0 3px ${stroke})` }}
            />
          </g>
        )
      })}

      {/* Nodes */}
      {NODES.map((n) => {
        const isHub = n.kind === 'hub'
        const r = isHub ? 9 : 5
        return (
          <g key={n.id}>
            {isHub && (
              <circle
                cx={n.x}
                cy={n.y}
                r={16}
                fill="none"
                stroke={stroke}
                strokeOpacity={0.5}
                strokeWidth={1}
              />
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={r}
              fill={isHub ? stroke : '#0A0E14'}
              stroke={stroke}
              strokeWidth={1.6}
              fillOpacity={isHub ? 1 : 1}
              style={{ filter: `drop-shadow(0 0 ${isHub ? 7 : 3}px ${stroke})` }}
            />
            {isHub && (
              <circle
                cx={n.x}
                cy={n.y}
                r={r}
                fill={stroke}
                className="hud-pulse animate-online-pulse"
                fillOpacity={0.5}
              />
            )}
            <text
              x={n.x}
              y={n.kind === 'agent' ? n.y + 20 : n.y - 14}
              textAnchor="middle"
              fill={warm ? '#E8EDF2' : '#E8EDF2'}
              className="font-mono"
              fontSize={11}
            >
              {n.label}
            </text>
            <text
              x={n.x}
              y={n.kind === 'agent' ? n.y + 32 : n.y - 2}
              textAnchor="middle"
              fill="#7C8896"
              className="font-mono"
              fontSize={9}
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
      {/* Soft single glow behind the console, static. */}
      <div className="hud-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative">
        {/* Title bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-mono text-sm leading-tight text-ink-text">
            <span className="text-accent">~/agentic-os</span>
            <span className="ml-3 text-xs text-ink-muted">
              inspired by Karpathy&apos;s LLM-OS
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-accent">
            <span aria-hidden className="hud-pulse animate-online-pulse">
              ●
            </span>
            online
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr] lg:gap-10">
          {/* Living system map */}
          <div className="rounded-lg border border-white/5 bg-black/20 p-3">
            <SystemMap warm={warm} />
          </div>

          {/* Console readouts */}
          <dl className="self-center font-mono text-xs">
            {READOUTS.map((r) => (
              <div
                key={r.k}
                className="flex items-baseline justify-between gap-4 border-b border-white/5 py-2 last:border-0"
              >
                <dt className="text-accent/70">{r.k}</dt>
                <dd className="text-right font-medium text-ink-text">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>

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
