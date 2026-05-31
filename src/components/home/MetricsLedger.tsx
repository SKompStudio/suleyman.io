'use client'

import { useLens, orderFor, type Lens } from './lens'

type Metric = {
  key: string
  value: string
  l1: string
  l2: string
  l3: string
}

const METRICS: Metric[] = [
  { key: 'quota', value: '200%', l1: 'funding', l2: 'quota', l3: 'Mitsubishi HC' },
  { key: 'users', value: '150', l1: 'paying users', l2: 'Applify AI', l3: 'in production' },
  { key: 'mentored', value: '100+', l1: 'learners', l2: 'mentored', l3: 'SKompXcel' },
  { key: 'live', value: '2025', l1: 'live since', l2: 'Skomp Studio', l3: 'in production' },
]

const KEYS = METRICS.map((m) => m.key)

const RANKS: Record<Lens, readonly string[]> = {
  // quota leads in fin + both; engineering surfaces software metrics first
  both: ['quota', 'live', 'users', 'mentored'],
  fin: ['quota', 'live', 'users', 'mentored'],
  eng: ['live', 'users', 'mentored', 'quota'],
}

export function MetricsLedger() {
  const { lens } = useLens()
  const order = orderFor(lens, KEYS, RANKS)

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-8 font-mono lg:grid-cols-4">
      {METRICS.map((m) => (
        <div
          key={m.key}
          style={{ order: order[m.key], viewTransitionName: `metric-${m.key}` }}
          className="flex flex-col"
        >
          <dt className="text-3xl font-semibold tabular-nums text-zinc-900 dark:text-ink-text lg:text-4xl">
            {m.value}
          </dt>
          <dd className="mt-2 text-sm leading-snug text-zinc-500 dark:text-ink-muted">
            {m.l1}
            <br />
            {m.l2}
            <br />
            {m.l3}
          </dd>
        </div>
      ))}
    </dl>
  )
}
