import Link from 'next/link'

import { Container } from '@/components/Container'
import { GitHubIcon, LinkedInIcon } from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'
import { Reveal, OperatorPortrait } from './AboutClient'
import { buildMeta } from '@/lib/buildMeta'

export const metadata = buildMeta({
  title: 'About',
  description:
    'Software engineer with equipment-finance experience. Production SaaS, an ML product, and a personal multi-agent operating system.',
  path: '/about',
})

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 font-mono text-sm text-ink-text">
      <span className="text-accent">~/{children}</span>
    </div>
  )
}

type Ship = {
  name: string
  outcome: string
  detail: string
  href: string
  linkLabel: string
}

const SHIPS: Ship[] = [
  {
    name: 'mike-ross-ai',
    outcome: 'Agentic legal RAG: cited Canadian-law answers.',
    detail:
      'A LangGraph state machine runs hybrid vector retrieval over 16,000+ legal documents (MongoDB Atlas) with a Gemini 2.0 Flash reasoning core, returning schema-validated, section-cited answers that block hallucination. FastAPI + Next.js, streamed over SSE. Built for Delta Hacks 12.',
    href: 'https://mike-ross.ca/',
    linkLabel: 'mike-ross.ca',
  },
  {
    name: 'skomp-studio',
    outcome: 'Multi-tenant SaaS running a pilates studio.',
    detail:
      'Class booking, waitlists, Square payments for a studio that ran on paper. Row-level tenant isolation, a ~790-test Vitest suite and a Playwright e2e gate every release.',
    href: 'https://skomp.studio/',
    linkLabel: 'skomp.studio',
  },
  {
    name: 'applify-ai',
    outcome: 'Resume-tailoring ML product.',
    detail:
      'Event-driven LLM pipelines generate ATS-optimized, job-targeted resumes from any job description. ~150 paying users.',
    href: 'https://applify-ai.com/',
    linkLabel: 'applify-ai.com',
  },
  {
    name: 'skompxcel',
    outcome: 'Mentorship platform for CS students.',
    detail:
      'Algorithms, systems design, mock interviews, resume reviews. 100+ learners.',
    href: 'https://skompxcel.com/',
    linkLabel: 'skompxcel.com',
  },
]

const STACK = [
  'typescript',
  'python',
  'next',
  'react',
  'prisma',
  'neon',
  'postgres',
  'fastapi',
  'langgraph',
  'aws',
  'vercel',
]

function ShipCard({ ship }: { ship: Ship }) {
  return (
    <div className="border-l-2 border-accent/40 py-1 pl-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="font-mono text-sm text-ink-text">{ship.name}</h3>
        <a
          href={ship.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-accent underline-offset-4 hover:underline"
        >
          {ship.linkLabel}
        </a>
      </div>
      <p className="mt-1.5 text-base text-zinc-300">{ship.outcome}</p>
      <p className="mt-1 text-sm text-ink-muted">{ship.detail}</p>
    </div>
  )
}

function SocialLine({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: any
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center font-mono text-sm text-ink-muted transition-colors hover:text-accent"
    >
      <Icon className="h-4 w-4 flex-none fill-ink-muted transition-colors group-hover:fill-accent" />
      <span className="ml-3">{children}</span>
    </Link>
  )
}

export default function About() {
  return (
    <Container className="mt-16 overflow-x-clip sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-[20rem_1fr] lg:gap-x-16">
        {/* Operator dossier rail — the signature graphic */}
        <div className="lg:order-last lg:sticky lg:top-28 lg:h-fit">
          <Reveal className="flex flex-col items-center lg:items-start">
            <OperatorPortrait image={portraitImage} />

            <div className="mt-6 w-full max-w-xs sm:max-w-sm">
              <div className="rounded-xl border border-ink-border bg-ink-surface/30 p-4">
                <div className="font-mono text-[11px] text-accent/70">~/contact</div>
                <div className="mt-3 flex flex-col gap-3">
                  <SocialLine href="https://github.com/kianis4/" icon={GitHubIcon}>
                    GitHub
                  </SocialLine>
                  <SocialLine
                    href="https://www.linkedin.com/in/suleyman-kiani"
                    icon={LinkedInIcon}
                  >
                    LinkedIn
                  </SocialLine>
                  <SocialLine href="mailto:suley.kiani@outlook.com" icon={MailIcon}>
                    suley.kiani@outlook.com
                  </SocialLine>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Dossier body */}
        <div className="min-w-0 lg:order-first">
          <p className="font-mono text-sm text-accent">~/about</p>
          <h1 className="mt-4 text-4xl font-normal tracking-tight text-ink-text sm:text-5xl">
            Suleyman Kiani
          </h1>
          <p className="mt-3 font-mono text-sm text-ink-muted">
            Software Engineer · Equipment Finance
          </p>

          <p className="mt-8 max-w-2xl text-lg text-zinc-400">
            I ship production software and I fund equipment-finance deals at
            Mitsubishi HC Capital. Full-stack and ML engineering on one side,
            structured finance on the other. A personal multi-agent OS runs the
            rest.
          </p>

          <div className="mt-14 space-y-14">
            <Reveal as="section">
              <SectionLabel>mission</SectionLabel>
              <p className="max-w-2xl text-base text-zinc-300">
                I structure and fund equipment-finance deals at Mitsubishi HC
                Capital, currently at 200% of monthly quota, where I have also
                shipped multiple internal automation and AI tools in production.
                Alongside that I run two production products with paying users.
                I am completing an MEng in Computing &amp; Software at McMaster,
                expected Dec 2026, with A+ grades in type theory and
                microservices.
              </p>
              <p className="mt-5 max-w-2xl text-base text-zinc-300">
                Off the clock I built my own JARVIS: a personal multi-agent
                operating system I run across my machines. It watches itself,
                recovers from failures behind fail-closed gates, and compounds
                my research and ops into a layered memory, the engineering and
                the finance feeding each other.
              </p>
            </Reveal>

            <Reveal as="section">
              <SectionLabel>ships</SectionLabel>
              <div className="grid gap-x-10 gap-y-6 lg:grid-cols-2">
                {SHIPS.map((ship) => (
                  <ShipCard key={ship.name} ship={ship} />
                ))}
              </div>
            </Reveal>

            <Reveal as="section">
              <SectionLabel>stack</SectionLabel>
              <div className="rounded-xl border border-ink-border bg-ink-surface/30 p-5">
                <div className="flex flex-wrap gap-x-2 gap-y-2 font-mono text-sm">
                  {STACK.map((t, i) => (
                    <span key={t} className="text-ink-muted">
                      {t}
                      {i < STACK.length - 1 && (
                        <span className="ml-2 text-ink-border">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal as="section">
              <SectionLabel>off-hours</SectionLabel>
              <p className="font-mono text-sm text-ink-muted">
                chess{' '}
                <a
                  href="https://www.chess.com/member/svley"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline-offset-4 hover:underline"
                >
                  1650
                </a>{' '}
                <span className="text-ink-border">·</span> kickboxing
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </Container>
  )
}
