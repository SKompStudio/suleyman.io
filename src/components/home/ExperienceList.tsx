'use client'

import { useLens, orderFor, type Lens } from './lens'

type Role = {
  key: string
  timeline: string
  company: string
  title: string
  outcome: string
  stack: string[]
}

const ROLES: Role[] = [
  {
    key: 'mhc',
    timeline: '2025–present',
    company: 'Mitsubishi HC Capital',
    title: 'Equipment Finance',
    outcome:
      'Structure and fund equipment-finance deals. 200% of monthly funding quota. Built a TypeScript quoting tool that consolidates 13 manufacturer pricing models into one validated tool used on live deals.',
    stack: ['credit', 'structuring', 'typescript'],
  },
  {
    key: 'skompxcel',
    timeline: '2024–present',
    company: 'SKompXcel',
    title: 'Founder',
    outcome:
      'Mentorship platform for CS students. 100+ learners through algorithms, systems design, and mock interviews.',
    stack: ['next', 'ts', 'gcp'],
  },
  {
    key: 'giftcash',
    timeline: '2021–2022',
    company: 'Giftcash',
    title: 'Junior Web Developer',
    outcome:
      'Migrated a Django monolith to Node.js on AWS Lambda and tuned PostgreSQL indexing and caching on the balance-verification path.',
    stack: ['node', 'aws-lambda', 'postgres'],
  },
]

const KEYS = ROLES.map((r) => r.key)

const RANKS: Record<Lens, readonly string[]> = {
  both: ['mhc', 'skompxcel', 'giftcash'],
  fin: ['mhc', 'skompxcel', 'giftcash'],
  eng: ['skompxcel', 'giftcash', 'mhc'],
}

export function ExperienceList() {
  const { lens } = useLens()
  const order = orderFor(lens, KEYS, RANKS)

  return (
    <div className="flex flex-col gap-10">
      {ROLES.map((r) => (
        <div
          key={r.key}
          style={{ order: order[r.key], viewTransitionName: `role-${r.key}` }}
          className="grid grid-cols-1 gap-2 border-t border-zinc-200 pt-6 dark:border-ink-border lg:grid-cols-[180px_1fr]"
        >
          <div className="font-mono text-sm text-zinc-500 dark:text-ink-muted">{r.timeline}</div>
          <div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-ink-text">
              {r.company}{' '}
              <span className="text-zinc-400 dark:text-ink-muted">· {r.title}</span>
            </h3>
            <p className="mt-2 text-base text-zinc-700 dark:text-zinc-300">{r.outcome}</p>
            <div className="mt-3 font-mono text-xs text-zinc-400 dark:text-ink-muted">
              {r.stack.join(' · ')}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
