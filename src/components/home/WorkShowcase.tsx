'use client'

import { useLens, orderFor, type Lens } from './lens'
import { ShowcaseCard, type ShowcaseData } from './ShowcaseCard'

import skompStudio from '@/images/showcase/solstice.png'
import applify from '@/images/showcase/applify.png'
import skompxcel from '@/images/showcase/skompxcel.png'

const PROJECTS: ShowcaseData[] = [
  {
    key: 'skomp-studio',
    href: 'https://skomp.studio/',
    url: 'skomp.studio',
    title: 'Skomp Studio',
    outcome: 'Multi-tenant SaaS running a pilates studio.',
    detail:
      'Class booking, waitlists, Square payments for a studio that ran on paper. Paying members, in production.',
    tech: ['ts', 'next', 'prisma', 'neon'],
    image: skompStudio,
  },
  {
    key: 'applify-ai',
    href: 'https://applify-ai.com/',
    url: 'applify-ai.com',
    title: 'Applify AI',
    outcome: 'Resume-tailoring ML product.',
    detail:
      'Event-driven LLM pipelines tailor resumes to any job description. ~150 paying users.',
    tech: ['ts', 'next', 'inngest', 'openai'],
    image: applify,
  },
  {
    key: 'skompxcel',
    href: 'https://skompxcel.com/',
    url: 'skompxcel.com',
    title: 'SKompXcel',
    outcome: 'Mentorship platform for CS students.',
    detail:
      'Algorithms, systems design, mock interviews, resume reviews. 100+ learners.',
    tech: ['next', 'ts', 'gcp'],
    image: skompxcel,
  },
]

const KEYS = PROJECTS.map((p) => p.key)

const RANKS: Record<Lens, readonly string[]> = {
  both: ['skomp-studio', 'applify-ai', 'skompxcel'],
  eng: ['applify-ai', 'skomp-studio', 'skompxcel'],
  fin: ['skomp-studio', 'skompxcel', 'applify-ai'],
}

export function WorkShowcase() {
  const { lens } = useLens()
  const warm = lens === 'eng'
  const order = orderFor(lens, KEYS, RANKS)
  const leadKey = RANKS[lens][0]

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2">
      {PROJECTS.map((p) => (
        <div
          key={p.key}
          style={{ order: order[p.key] }}
          className={p.key === leadKey ? 'md:col-span-2' : ''}
        >
          <ShowcaseCard data={p} warm={warm} />
        </div>
      ))}
    </div>
  )
}
