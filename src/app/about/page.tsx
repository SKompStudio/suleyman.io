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
    name: 'mac-study-companion',
    outcome: 'M.Eng research: study notes that cannot make things up.',
    detail:
      'A virtual TA for students with ADHD. Lecture recordings become study notes where every released sentence cites the minute of audio it came from, and any sentence the checker cannot prove is held back in place with its reason shown. A fail-closed release gate discharges the verification conditions in Z3; the pipeline state machine is model-checked in TLA+; the Socratic tutor is given only the steps the student has demonstrated, so it cannot reveal an answer it was never told. Nine FastAPI services over a Redis Streams bus. Accepted by both supervisors in September 2026.',
    href: '/architecture',
    linkLabel: 'github.com/kianis4',
  },
  {
    name: 'mike-ross-ai',
    outcome: 'Agentic legal RAG: cited Canadian-law answers.',
    detail:
      'A LangGraph state machine runs hybrid vector retrieval over a 16,000-chunk corpus of seven federal and provincial statutes (MongoDB Atlas) with a Gemini 2.0 Flash reasoning core, returning schema-validated, section-cited answers that block hallucination. FastAPI + Next.js, streamed over SSE. Built for Delta Hacks 12.',
    href: 'https://mike-ross.ca/',
    linkLabel: 'mike-ross.ca',
  },
  {
    name: 'incite',
    outcome: 'White-label studio platform running a real business.',
    detail:
      'Booking, waitlists, memberships and Square payments for studios that ran on paper. Tenant isolation enforced in the data layer by a scoped Prisma client, 74 data models across 196 API routes, and a suite of more than 6,000 tests with Playwright end-to-end runs as a required check on every release. Solstice Pilates runs its entire operation on it.',
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
  'redis',
  'langgraph',
  'z3',
  'tla+',
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
      {/* The prose takes the flexible column and the dossier rail the fixed one.
          Reversing these puts the body in the 20rem track, which squeezes every
          paragraph into a narrow ribbon and leaves the right half of a desktop
          window empty next to a 24rem card. */}
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-16">
        {/* Operator dossier rail — the signature graphic */}
        <div className="lg:sticky lg:top-28 lg:order-last lg:h-fit">
          <Reveal className="flex flex-col items-center lg:items-start">
            <OperatorPortrait image={portraitImage} />

            <div className="mt-6 w-full max-w-xs sm:max-w-sm">
              <div className="rounded-xl border border-ink-border bg-ink-surface/30 p-4">
                <div className="font-mono text-[11px] text-accent/70">
                  ~/contact
                </div>
                <div className="mt-3 flex flex-col gap-3">
                  <SocialLine
                    href="https://github.com/kianis4/"
                    icon={GitHubIcon}
                  >
                    GitHub
                  </SocialLine>
                  <SocialLine
                    href="https://www.linkedin.com/in/suleyman-kiani"
                    icon={LinkedInIcon}
                  >
                    LinkedIn
                  </SocialLine>
                  <SocialLine
                    href="mailto:suley.kiani@outlook.com"
                    icon={MailIcon}
                  >
                    suley.kiani@outlook.com
                  </SocialLine>
                  <SocialLine href="mailto:kianis4@mcmaster.ca" icon={MailIcon}>
                    kianis4@mcmaster.ca
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
            Applied AI Engineer · LaunchGood
          </p>

          <p className="mt-8 max-w-2xl text-lg text-zinc-400">
            I build AI agents and ship them with their evals attached. From
            October 2026 I am an Applied AI Engineer at LaunchGood, after a year
            in equipment finance at Mitsubishi HC Capital. A personal
            multi-agent OS runs the rest.
          </p>

          <div className="mt-14 space-y-14">
            <Reveal as="section">
              <SectionLabel>mission</SectionLabel>
              <p className="max-w-2xl text-base text-zinc-300">
                I join LaunchGood in October 2026 as a senior (P3) Applied AI
                Engineer, in the pod that owns AI initiatives. Before that I spent
                a year funding equipment-finance deals at Mitsubishi HC Capital,
                over quota every month from my second, and built the desk a quoting tool that
                corporate IT now owns and is deploying. Alongside that I run two
                production products with paying users.
              </p>
              <p className="mt-5 max-w-2xl text-base text-zinc-300">
                My MEng in Computing &amp; Software at McMaster is research
                complete: Dr. William Farmer and Dr. Richard Paige reviewed the
                running system in September 2026 and judged the project
                complete, with coursework running through 2027. The project is
                Mac Study Companion, below. A+ in simple type theory, A in
                microservice architectures.
              </p>
              <p className="mt-5 max-w-2xl text-base text-zinc-300">
                Off the clock I built my own JARVIS: a personal multi-agent
                operating system I run across my own machines. Scheduled jobs
                and email-triggered workers carry out agent tasks on a private
                mesh, each one sandboxed behind a fail-closed egress allowlist
                so an untrusted inbound document never reaches a credential.
                Work that dies mid-flight is re-driven a bounded number of times
                and then parked for a human rather than retried forever, a
                dead-man switch watches the health monitor itself, and a local
                model answers over my own notes with citations. The engineering
                and the finance feed each other.
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
