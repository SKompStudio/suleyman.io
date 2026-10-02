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
    key: 'launchgood',
    timeline: 'Oct 2026–',
    company: 'LaunchGood',
    title: 'Applied AI Engineer',
    outcome:
      'Senior (P3) hire into the pod that owns AI initiatives: production agents across operations, trust and safety, support and finance, each gated by evaluation suites in CI.',
    stack: ['agents', 'evals', 'python'],
  },
  {
    key: 'mhc',
    timeline: '2025–2026',
    company: 'Mitsubishi HC Capital',
    title: 'Associate Account Manager (Software Engineering scope)',
    outcome:
      'Funded equipment-finance deals over quota every month from month two, and built a quoting tool now owned by corporate IT, a collections risk scorecard the SVP announced org-wide, and an AI document-validation service.',
    stack: ['credit', 'structuring', 'automation'],
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
  both: ['launchgood', 'mhc', 'skompxcel', 'giftcash'],
  fin: ['launchgood', 'mhc', 'skompxcel', 'giftcash'],
  eng: ['launchgood', 'skompxcel', 'giftcash', 'mhc'],
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
          className="grid grid-cols-1 gap-2 border-t border-ink-border pt-6 lg:grid-cols-[180px_1fr]"
        >
          <div className="font-mono text-sm text-ink-muted">{r.timeline}</div>
          <div>
            <h3 className="text-lg font-medium text-ink-text">
              {r.company} <span className="text-ink-muted">· {r.title}</span>
            </h3>
            <p className="mt-2 text-base text-zinc-300">{r.outcome}</p>
            <div className="mt-3 font-mono text-xs text-ink-muted">
              {r.stack.join(' · ')}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
