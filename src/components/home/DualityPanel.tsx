'use client'

import clsx from 'clsx'
import { useLens } from './lens'

export function DualityPanel() {
  const { lens } = useLens()

  const financeLead = lens === 'fin'
  const engLead = lens === 'eng'

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[55fr_45fr]">
      <article
        style={{ viewTransitionName: 'lens-card-fin', order: financeLead ? 0 : engLead ? 2 : 1 }}
        className={clsx(
          'rounded-lg border p-6 transition-colors',
          financeLead
            ? 'border-accent/40 bg-accent/5'
            : 'border-zinc-200 bg-white/40 dark:border-ink-border dark:bg-ink-surface/40'
        )}
      >
        <div className="font-mono text-sm text-accent">finance</div>
        <p className="mt-3 text-base text-zinc-700 dark:text-zinc-300">
          Structuring and funding equipment-finance deals at Mitsubishi HC Capital.{' '}
          <span className="font-mono text-zinc-900 dark:text-ink-text">200%</span> of monthly quota.
        </p>
      </article>

      <article
        style={{ viewTransitionName: 'lens-card-eng', order: engLead ? 0 : 1 }}
        className={clsx(
          'rounded-lg border p-6 transition-colors',
          engLead
            ? 'border-engineering/50 bg-zinc-100/60 dark:bg-zinc-200/[0.04]'
            : 'border-zinc-200 bg-white/40 dark:border-ink-border dark:bg-ink-surface/40'
        )}
      >
        <div className="font-mono text-sm text-zinc-600 dark:text-engineering">engineering</div>
        <p className="mt-3 text-base text-zinc-700 dark:text-zinc-300">
          Multi-tenant SaaS in production, event-driven .NET microservices, an ML product with paying users.
        </p>
      </article>
    </div>
  )
}
