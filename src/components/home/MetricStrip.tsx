import clsx from 'clsx'

// The hero metric strip: one bordered 4-up mono strip (2x2 on narrow). Numbers
// are stated, not counted-up, rendered tabular-nums immediately. Every value is
// a real fact about the running system or a true policy fact.

type Metric = {
  value: string
  accent?: string
  label: string
}

const METRICS: Metric[] = [
  { value: '57', label: 'live systemd units' },
  { value: '3', accent: '+1', label: 'always-on watchers' },
  { value: '14k', accent: '+', label: 'autonomous commits' },
  { value: '100', accent: '%', label: 'human-gated publishes' },
]

export function MetricStrip() {
  return (
    <div className="mt-9 grid grid-cols-2 overflow-hidden rounded-2xl border border-accent/15 bg-gradient-to-b from-ink-surface to-[#0A0E14] sm:grid-cols-4">
      {METRICS.map((m, i) => (
        <div
          key={m.label}
          className={clsx(
            'relative px-5 py-4',
            // hairline dividers between cells (neutral, low-alpha)
            i % 2 === 0 && 'border-r border-white/[0.06]',
            i < 2 && 'border-b border-white/[0.06] sm:border-b-0',
            i === 1 && 'sm:border-r',
            i === 2 && 'sm:border-r'
          )}
        >
          <div className="font-mono text-3xl font-bold tracking-tight tabular-nums text-accent">
            {m.value}
            {m.accent ? <span className="text-gold">{m.accent}</span> : null}
          </div>
          <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">
            {m.label}
          </div>
        </div>
      ))}
    </div>
  )
}
