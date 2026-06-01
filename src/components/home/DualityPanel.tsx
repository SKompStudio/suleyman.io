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
          'hud-brackets rounded-lg border p-6 transition-colors',
          financeLead
            ? 'border-accent/50 bg-accent/[0.06]'
            : 'border-ink-border bg-ink-surface/40'
        )}
      >
        <div className="font-mono text-sm text-accent">finance</div>
        <p className="mt-3 text-base text-zinc-300">
          {financeLead
            ? 'Structuring and funding equipment-finance deals at Mitsubishi HC Capital. '
            : 'Equipment finance at Mitsubishi HC Capital. '}
          <span className="font-mono text-ink-text">200%</span> of monthly quota.
        </p>
      </article>

      <article
        style={{ viewTransitionName: 'lens-card-eng', order: engLead ? 0 : 1 }}
        className={clsx(
          'hud-brackets rounded-lg border p-6 transition-colors',
          engLead
            ? 'border-engineering/50 bg-engineering/[0.05]'
            : 'border-ink-border bg-ink-surface/40'
        )}
      >
        <div className={clsx('font-mono text-sm', engLead ? 'text-engineering' : 'text-ink-muted')}>
          engineering
        </div>
        <p className="mt-3 text-base text-zinc-300">
          {engLead
            ? 'Production multi-tenant SaaS, event-driven services, an ML product with paying users, and a personal multi-agent OS.'
            : 'Multi-tenant SaaS in production, event-driven services, an ML product with paying users.'}
        </p>
      </article>
    </div>
  )
}
