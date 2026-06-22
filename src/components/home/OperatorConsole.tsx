import clsx from 'clsx'

import { ConductorFeed } from './ConductorFeed'

// The signature element: a live operator console for the agentic OS, woven into
// the top of the proof rail. Telemetry cards describe real system capabilities
// in generic terms (no client data, no internal automation names). Counts that
// cannot be wired to a live source are stated as honest static structure
// ("3 vaults", "all gates green") rather than fake live counters.

type Telemetry = {
  label: string
  value: string
  unit: string
  delta: string
  accent?: 'cyan' | 'gold'
}

const CARDS: Telemetry[] = [
  {
    label: 'Agents live',
    value: '3',
    unit: 'watchers',
    delta: 'all gates green · 0 stranded',
  },
  {
    label: 'Build pipeline',
    value: 'nightly',
    unit: '',
    delta: 'researched · tested · gated',
    accent: 'gold',
  },
  {
    label: 'Jobs in pipeline',
    value: '2',
    unit: 'lanes',
    delta: 'tailored · awaiting tap',
  },
  {
    label: 'KB / RAG memory',
    value: '3',
    unit: 'vaults',
    delta: 'synced · bge-m3 indexed',
  },
]

function Card({ t }: { t: Telemetry }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-accent/15 bg-white/[0.018] px-3.5 py-3">
      <span
        aria-hidden
        className={clsx(
          'absolute inset-y-0 left-0 w-[2px]',
          t.accent === 'gold' ? 'bg-gold/70' : 'bg-accent/50'
        )}
      />
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
        {t.label}
      </div>
      <div
        className={clsx(
          'mt-2.5 font-mono text-2xl font-bold leading-none tracking-tight tabular-nums',
          t.accent === 'gold' ? 'text-gold' : 'text-ink-text'
        )}
      >
        {t.value}
        {t.unit ? (
          <span className="ml-1.5 text-xs font-medium text-ink-muted">
            {t.unit}
          </span>
        ) : null}
      </div>
      <div
        className={clsx(
          'mt-2 font-mono text-[10.5px]',
          t.accent === 'gold' ? 'text-gold/90' : 'text-[#46E5A0]'
        )}
      >
        {t.delta}
      </div>
    </div>
  )
}

export function OperatorConsole() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-b from-ink-surface to-[#0A0E14] shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
      />
      {/* head bar */}
      <div className="flex items-center gap-2.5 border-b border-accent/15 bg-accent/[0.03] px-4 py-3">
        <span aria-hidden className="flex gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <i className="h-2.5 w-2.5 rounded-full bg-gold" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#46E5A0]" />
        </span>
        <span className="font-mono text-[11.5px] tracking-[0.04em] text-ink-muted">
          <span className="font-semibold text-ink-text">agentic-os</span> /
          status
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10.5px] text-accent">
          <span
            aria-hidden
            className="hud-pulse h-[6px] w-[6px] animate-online-pulse rounded-full bg-accent shadow-[0_0_8px_var(--hud-accent)]"
          />
          MONITORING
        </span>
      </div>

      <div className="p-3.5">
        <div className="grid grid-cols-2 gap-2.5">
          {CARDS.map((t) => (
            <Card key={t.label} t={t} />
          ))}
        </div>

        <ConductorFeed />

        <div className="mt-3 space-y-2 px-1">
          <p className="font-mono text-[10.5px] tracking-[0.03em] text-ink-muted">
            inspired by Karpathy&apos;s LLM-OS · compounding memory
          </p>
          <p className="text-[13px] leading-relaxed text-zinc-400">
            A personal multi-agent operating system that compounds research,
            ops, and engineering. Deterministic fail-closed gates, sandboxed
            workers, and human-tapped publishes. Built on Claude.
          </p>
        </div>
      </div>
    </div>
  )
}
