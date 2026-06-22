import Link from 'next/link'
import clsx from 'clsx'

// The primary evidence surface: a service dashboard, not a project-card grid.
// Each row is a running system framed as "is it up," with a status badge.
// Every system is real material from the running setup.

type Dot = 'cyan' | 'gold' | 'green'

type System = {
  name: string
  href: string
  dot: Dot
  desc: string
  tags: string[]
  status: string
  qualifier: string
  statusAccent?: boolean
}

const SYSTEMS: System[] = [
  {
    name: 'The Agentic OS',
    href: '/architecture',
    dot: 'cyan',
    desc: 'A self-built operating layer across two machines: conductor, memory/RAG, 57 timers, watcher jails. Runs unattended on a home server.',
    tags: ['systemd', 'Python', 'bubblewrap', 'LanceDB'],
    status: 'live',
    qualifier: '24/7 uptime',
    statusAccent: true,
  },
  {
    name: 'The Career Engine',
    href: '/architecture',
    dot: 'gold',
    desc: 'Always-on prospect to tailor to approval loop. Aggregates ATS sources, grounds every resume claim to a fact inventory, auto-applies behind a two-tap human gate.',
    tags: ['3 lanes', 'Playwright', 'claim-grounding'],
    status: '2-tap',
    qualifier: 'apply gate',
  },
  {
    name: 'The Autobuilder',
    href: '/architecture',
    dot: 'green',
    desc: 'Mines ideas from a knowledge vault, then researches, specs, builds, tests and previews a full project nightly. Sandboxed, fail-closed, never auto-published.',
    tags: ['nightly', 'isolated worktree', 'two-tier gate'],
    status: 'nightly',
    qualifier: '2:00am ET',
  },
  {
    name: 'Solstice, Skomp Studio',
    href: '/projects',
    dot: 'cyan',
    desc: 'Production SaaS for a paying client. Next.js 16 with Neon Postgres and Prisma on Vercel, with read-only Sentry triage and an advisory improvement-pool agent.',
    tags: ['Next.js 16', 'Neon', 'Vercel', 'in production'],
    status: 'prod',
    qualifier: 'paying client',
    statusAccent: true,
  },
]

const DOT: Record<Dot, string> = {
  cyan: 'bg-accent shadow-[0_0_8px_rgba(91,200,255,0.6)]',
  gold: 'bg-gold shadow-[0_0_8px_rgba(232,184,75,0.5)]',
  green: 'bg-[#46E5A0] shadow-[0_0_8px_rgba(70,229,160,0.5)]',
}

export function ShippedSystems() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-accent/15 bg-gradient-to-b from-ink-surface to-[#0A0E14]">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
      />
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="font-mono text-xs uppercase tracking-[0.05em] text-ink-muted">
          // shipped <span className="text-accent">systems</span>
        </div>
        <div className="rounded-md border border-[#46E5A0]/25 bg-[#46E5A0]/10 px-2 py-1 font-mono text-[10.5px] tracking-[0.04em] text-[#46E5A0]">
          ● all running
        </div>
      </div>

      <div className="px-2 py-2">
        {SYSTEMS.map((s, i) => (
          <Link
            key={s.name}
            href={s.href}
            className={clsx(
              'grid grid-cols-[1fr_auto] items-start gap-4 rounded-xl px-3.5 py-3.5 transition-colors hover:bg-accent/[0.04]',
              i > 0 && 'border-t border-white/[0.06]'
            )}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className={clsx('h-[7px] w-[7px] flex-none rounded-full', DOT[s.dot])}
                />
                <span className="text-[15px] font-semibold tracking-tight text-ink-text">
                  {s.name}
                </span>
              </div>
              <p className="mt-1.5 max-w-[46ch] text-[13px] leading-relaxed text-ink-muted">
                {s.desc}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-white/[0.06] px-2 py-0.5 font-mono text-[10.5px] text-ink-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="min-w-[78px] text-right font-mono">
              <div
                className={clsx(
                  'text-lg font-bold',
                  s.statusAccent ? 'text-accent' : 'text-ink-text'
                )}
              >
                {s.status}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.05em] text-ink-muted">
                {s.qualifier}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3.5 font-mono text-[11px] text-ink-muted">
        <span>// curated from a live catalog, not a screenshot gallery</span>
        <Link href="/projects" className="text-accent hover:underline">
          view all →
        </Link>
      </div>
    </div>
  )
}
