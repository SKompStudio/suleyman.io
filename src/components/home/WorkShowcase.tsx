'use client'

import { useLens, orderFor, type Lens } from './lens'
import { ProjectRecord, type ProjectRecordData } from './ProjectRecord'

const PROJECTS: ProjectRecordData[] = [
  {
    key: 'skomp-studio',
    path: 'skomp-studio',
    href: 'https://skomp.studio/',
    status: 'live',
    outcome: 'Multi-tenant SaaS running a pilates studio.',
    detail:
      'Class booking, waitlists, Square payments for a studio that ran on paper. Paying members, in production.',
    tech: ['ts', 'next', 'prisma', 'neon'],
    hover: '5,000+ tests gate every release',
  },
  {
    key: 'applify-ai',
    path: 'applify-ai',
    href: 'https://applify-ai.com/',
    status: 'live',
    outcome: 'Resume-tailoring ML product.',
    detail:
      'Event-driven LLM pipelines tailor resumes to any job description. ~150 paying users.',
    tech: ['ts', 'next', 'inngest', 'openai'],
  },
  {
    key: 'dealflow',
    path: 'dealflow-sandbox',
    href: 'https://github.com/kianis4',
    statusLabel: 'sandbox',
    outcome: 'I fund equipment-finance deals.',
    detail:
      'DealFlow Sandbox rebuilds that pipeline as event-driven microservices.',
    tech: ['c#', '.net', 'event-bus'],
    diagram: true,
  },
  {
    key: 'skompxcel',
    path: 'skompxcel',
    href: 'https://skompxcel.com/',
    status: 'live',
    outcome: 'Mentorship platform for CS students.',
    detail: 'Algorithms, systems design, mock interviews, resume reviews. 100+ learners.',
    tech: ['next', 'ts', 'gcp'],
  },
]

const KEYS = PROJECTS.map((p) => p.key)

const RANKS: Record<Lens, readonly string[]> = {
  both: ['skomp-studio', 'applify-ai', 'dealflow', 'skompxcel'],
  fin: ['dealflow', 'skomp-studio', 'applify-ai', 'skompxcel'],
  eng: ['skomp-studio', 'applify-ai', 'dealflow', 'skompxcel'],
}

// Authored spans per record, keyed by record. The lead record spans 2 cols.
const SPANS: Record<string, string> = {
  'skomp-studio': 'lg:col-span-2',
  'applify-ai': 'lg:col-span-1',
  dealflow: 'lg:col-span-2',
  skompxcel: 'lg:col-span-1',
}

export function WorkShowcase() {
  const { lens } = useLens()
  const order = orderFor(lens, KEYS, RANKS)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {PROJECTS.map((p) => (
        <div
          key={p.key}
          style={{ order: order[p.key] }}
          className={SPANS[p.key]}
        >
          <ProjectRecord data={p} />
        </div>
      ))}
    </div>
  )
}
