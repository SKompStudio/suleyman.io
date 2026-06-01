import { Container } from '@/components/Container'
import { Reveal } from '@/components/home/Reveal'

export const metadata = {
  title: 'Architecture',
  description:
    'The system behind the system: seven production architectures, from a personal multi-agent OS run by Claude Code to distributed microservices, multi-tenant SaaS, and engineer-built automation. Every node sourced from the real codebases.',
}

type Diagram = {
  file: string
  tag: string
  title: string
  blurb: string
  tech: string[]
}

// Order: the whole landscape first, then the Claude-run brain, then the
// per-domain deep dives. Every label is scrubbed of employer/customer identity.
const DIAGRAMS: Diagram[] = [
  {
    file: 'd7-grand-unified',
    tag: 'system landscape',
    title: 'Grand Unified Architecture',
    blurb:
      'Every domain as a column, every shared platform drawn once as a capability band. Scan down a column to see what a project depends on; scan across a band to see who shares a platform. This is how five very different systems compose into one engine.',
    tech: [
      'Claude Code', 'OpenAI GPT-5.1', 'Ollama / Whisper', 'Neon', 'RabbitMQ',
      'Inngest', 'AWS', 'Vercel', 'Tailscale', 'Sentry',
    ],
  },
  {
    file: 'd6-agentic-os',
    tag: 'built on Claude Code',
    title: 'Personal Agentic OS — the brain',
    blurb:
      'An always-on multi-agent operating system run by Claude Code. The orchestrator fans work out to custom Skills via the Agent tool; systemd-timed watchers spawn headless claude -p workers; a layered memory (session → project → vault) compounds research and ops. Local models on an RTX 3080 handle the free tier; the iOS bridge runs the Claude Agent SDK.',
    tech: [
      'Claude Code', 'Claude Agent SDK', 'Skills', 'headless claude -p',
      'MCP servers', 'systemd', 'Ollama (qwen2.5 / bge)', 'faster-whisper',
      'LanceDB', 'FastAPI', 'arq + Redis', 'Tailscale',
    ],
  },
  {
    file: 'd5-podcasthub',
    tag: 'distributed systems',
    title: 'PodcastHub — distributed microservices',
    blurb:
      'A polyglot, event-driven recording platform built for graduate distributed-systems work (CAS 735). Six services across Node and Python, each a hexagonal ports-and-adapters bounded context owning its own data, choreographed over a RabbitMQ topic exchange plus a dedicated work queue for FFmpeg media processing.',
    tech: [
      'Next.js 16', 'Node / Express', 'Python / FastAPI', 'RabbitMQ',
      'PostgreSQL', 'MinIO', 'FFmpeg', 'Docker Compose', 'hexagonal / DDD',
    ],
  },
  {
    file: 'd2-booking-roles',
    tag: 'multi-tenant SaaS',
    title: 'Booking SaaS — access & role model',
    blurb:
      'Four roles (member, instructor, admin, platform owner), each with distinct authentication and capabilities, gated through a single pipeline: role-scoped JWT → edge middleware → multi-tenant subdomain routing → app-level studio isolation. The isolation boundary is enforced in the data layer by a scoped-Prisma wrapper, not by database RLS.',
    tech: [
      'NextAuth (JWT)', 'edge middleware', 'multi-tenant subdomains',
      'scopedPrisma isolation', '4-role RBAC',
    ],
  },
  {
    file: 'd3-booking-dataflow',
    tag: 'multi-tenant SaaS',
    title: 'Booking SaaS — data-flow',
    blurb:
      'The same product traced by data movement: a synchronous request spine (booking, auth, card checkout) split cleanly from a durable, event-driven async tier (payment webhooks with HMAC verification, Inngest functions, scheduled cron, realtime push). One shared serverless Postgres, every row studio-scoped.',
    tech: [
      'Next.js 16', 'Prisma 7', 'Neon', 'Square', 'Inngest',
      'Vercel Cron', 'AWS SES / SNS / KMS / AppSync',
    ],
  },
  {
    file: 'd1-internal-automation',
    tag: 'automation',
    title: 'Internal Automation Fleet',
    blurb:
      'Engineer-built automation for an operations role: an email-triggered, fail-closed document pipeline. A systemd timer claims each thread exactly once via a Gmail-label state machine, spawns a detached Claude worker that validates or generates documents, writes a markdown ledger, and replies on the same thread. Idle cost is zero. (Genericized — no employer internals.)',
    tech: [
      'Python', 'systemd', 'Gmail API (DWD)', 'fail-closed FSM',
      'LibreOffice / PyMuPDF', 'FastAPI / arq', 'Tailscale',
    ],
  },
  {
    file: 'd4-applify',
    tag: 'ML product',
    title: 'Applify AI — resume-tailoring pipeline',
    blurb:
      'A resume-tailoring ML product with paying users. A JWT-gated request enqueues a durable, step-checkpointed Inngest pipeline that drives the OpenAI Responses API with Zod-validated structured outputs. Shown sparse on purpose — only the publicly self-reported stack, nothing inferred.',
    tech: [
      'Next.js 15', 'Inngest', 'OpenAI GPT-5.1 + Zod', 'Prisma 7',
      'Stripe', 'Sentry',
    ],
  },
]

// The Claude-native engineering surface — what makes this a "Claude developer"
// portfolio rather than just "an app that calls an API".
const CLAUDE_STACK: string[] = [
  'Custom Skills (~22)',
  'Headless claude -p workers',
  'Agent-tool sub-agent fan-out',
  'Claude Agent SDK (Python)',
  'MCP servers',
  'Domain-tier policy gates',
  'Hooks & slash commands',
  'Multi-agent Workflows',
]

function Eyebrow({ children }: { children: string }) {
  return <p className="mb-5 font-mono text-sm text-accent">{children}</p>
}

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-md border border-ink-border bg-ink-surface/40 px-2.5 py-1 font-mono text-xs text-ink-muted">
      {children}
    </span>
  )
}

function DiagramFigure({ d }: { d: Diagram }) {
  return (
    <Reveal as="article" className="scroll-mt-28">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-xl font-medium tracking-tight text-ink-text sm:text-2xl">
          {d.title}
        </h2>
        <span className="font-mono text-xs uppercase tracking-wide text-accent/80">
          {d.tag}
        </span>
      </div>
      <a
        href={`/diagrams/${d.file}.svg`}
        target="_blank"
        rel="noopener noreferrer"
        className="group block overflow-hidden rounded-xl border border-ink-border bg-ink-bg transition-colors hover:border-accent/40"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/diagrams/${d.file}.svg`}
          alt={`${d.title} — architecture diagram`}
          loading="lazy"
          className="w-full"
        />
      </a>
      <p className="mt-4 max-w-3xl text-base text-zinc-400">{d.blurb}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {d.tech.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>
    </Reveal>
  )
}

export default function Architecture() {
  return (
    <Container className="relative z-10 mt-16 sm:mt-24">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative py-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-clip"
        >
          <div className="hud-grid absolute inset-0" />
          <div className="hud-glow absolute inset-0" />
        </div>
        <Eyebrow>~/architecture</Eyebrow>
        <h1 className="max-w-3xl text-4xl font-normal tracking-tight text-ink-text sm:text-5xl">
          The system behind the system.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          Seven production architectures — a personal multi-agent OS run by
          Claude Code, distributed microservices, multi-tenant SaaS, and
          engineer-built automation. Every node was extracted from the real
          codebases, not sketched.
        </p>
      </section>

      {/* ── Built on Claude Code ─────────────────────────────────────────── */}
      <Reveal
        as="section"
        className="mt-10 rounded-xl border border-accent/30 bg-ink-surface/40 p-6 sm:p-8"
      >
        <Eyebrow>built on Claude Code</Eyebrow>
        <p className="max-w-3xl text-base text-zinc-300">
          The brain of the whole system is{' '}
          <span className="text-ink-text">Claude Code</span>. The orchestrator is
          an interactive Claude session that fans work out to custom Skills via
          the Agent tool; email watchers spawn headless{' '}
          <span className="font-mono text-accent">claude -p</span> workers; the
          mobile bridge runs the Claude Agent SDK; MCP servers wire it into the
          vaults. I build <span className="text-ink-text">with</span> Claude, not
          just on top of a model API.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {CLAUDE_STACK.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
        <p className="mt-6 max-w-3xl border-l-2 border-accent/40 pl-4 font-mono text-sm text-ink-muted">
          These seven diagrams were generated by a Claude Code super-orchestrator
          running a multi-agent workflow — one sub-agent per diagram, each
          rendering and visually reviewing its own output. This page was built by
          the system it documents.
        </p>
      </Reveal>

      {/* ── The gallery ──────────────────────────────────────────────────── */}
      <div className="mt-16 space-y-20 pb-16">
        {DIAGRAMS.map((d) => (
          <DiagramFigure key={d.file} d={d} />
        ))}
      </div>
    </Container>
  )
}
