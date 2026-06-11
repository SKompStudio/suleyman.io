import Link from 'next/link'

import { Container } from '@/components/Container'
import { GitHubIcon, LinkedInIcon } from '@/components/SocialIcons'

import { LensProvider } from '@/components/home/lens'
import { LensToggle } from '@/components/home/LensToggle'
import { MetaRail } from '@/components/home/MetaRail'
import { DualityPanel } from '@/components/home/DualityPanel'
import { SystemConsole } from '@/components/home/SystemConsole'
import { MetricsLedger } from '@/components/home/MetricsLedger'
import { WorkShowcase } from '@/components/home/WorkShowcase'
import { ExperienceList } from '@/components/home/ExperienceList'
import { LiveSignals } from '@/components/home/LiveSignals'
import { EducationLedger } from '@/components/home/EducationLedger'
import { OffHours } from '@/components/home/OffHours'
import { HeroBoot } from '@/components/home/HeroBoot'
import { GrainOverlay } from '@/components/home/GrainOverlay'
import { Reveal } from '@/components/home/Reveal'
import { HomeTerminalShell } from '@/components/terminal/HomeTerminalShell'
import { buildMeta } from '@/lib/buildMeta'

export const metadata = buildMeta({
  title: 'Suleyman Kiani | Home',
  description:
    'Software engineer and equipment-finance professional. Production SaaS, an ML product, and a personal multi-agent operating system.',
  path: '/',
})

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 font-mono text-sm uppercase tracking-wide text-ink-muted">
      {children}
    </div>
  )
}

export default function Home() {
  const lastBuild = new Date().toISOString().slice(0, 10)

  return (
    <LensProvider>
      <GrainOverlay />
      <Container className="relative z-10 mt-9 overflow-x-clip">
        <div className="lg:flex lg:gap-12">
          <MetaRail lastBuild={lastBuild} />

          <div className="min-w-0 flex-1 lg:max-w-[1240px]">
            {/* Hero — server-rendered LCP headline + HUD ambient + boot island */}
            <section className="relative flex min-h-[60svh] flex-col justify-center py-8">
              {/* Ambient HUD layer: one faint grid + one soft cyan glow, behind
                  content, in their own clipping layer (never animated). */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 overflow-clip"
              >
                <div className="hud-grid absolute inset-0" />
                <div className="hud-glow absolute inset-0" />
              </div>

              <div className="hud-brackets relative max-w-3xl py-2">
                <p className="font-mono text-sm text-accent">~/suleyman.io</p>
                <h1 className="mt-4 text-4xl font-normal tracking-tight text-ink-text sm:text-5xl lg:text-7xl lg:leading-[1.05]">
                  I ship production software, fund equipment-finance deals, and run a
                  system that runs the rest.
                </h1>
                <p className="mt-6 max-w-2xl text-lg text-zinc-400">
                  Production SaaS and an ML product, both with paying users. 200% of
                  monthly funding quota ($4M funded against a $2M target) at Mitsubishi
                  HC Capital. A personal multi-agent OS that runs my research and ops.
                </p>

                <HeroBoot />

                {/* Interactive JARVIS console — server-rendered shell (LCP/CLS
                    safe), enhanced into the live REPL after mount. */}
                <HomeTerminalShell />
              </div>

              <Reveal className="mt-6">
                <p className="font-mono text-sm text-ink-muted">
                  <span className="text-ink-text">200%</span> quota{' '}
                  <span className="text-ink-border">·</span>{' '}
                  <span className="text-ink-text">150</span> paying users{' '}
                  <span className="text-ink-border">·</span>{' '}
                  <span className="text-ink-text">100+</span> mentored
                </p>
              </Reveal>

              <Reveal delay={1} className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-accent/90"
                >
                  Get in touch
                </Link>
                <Link
                  href="#system"
                  className="inline-flex items-center justify-center rounded-md border border-ink-border px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-accent/50"
                >
                  View the system
                </Link>
              </Reveal>

              <div className="mt-8 lg:hidden">
                <LensToggle />
              </div>
            </section>

            {/* Duality */}
            <section className="py-16">
              <Reveal>
                <DualityPanel />
              </Reveal>
            </section>

            {/* System Console — the centerpiece */}
            <section id="system" className="scroll-mt-28 py-16">
              <SectionLabel>system</SectionLabel>
              <Reveal>
                <SystemConsole />
              </Reveal>
            </section>

            {/* Architecture — Grand Unified map → /architecture gallery */}
            <section id="architecture" className="scroll-mt-28 py-16">
              <SectionLabel>architecture</SectionLabel>
              <Reveal>
                <Link
                  href="/architecture"
                  className="group block overflow-hidden rounded-xl border border-ink-border bg-ink-bg transition-colors hover:border-accent/40"
                >
                  {/* Horizontal scroll on narrow screens keeps the diagram
                      labels legible instead of crushing it to viewport width. */}
                  <div className="overflow-x-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/diagrams/d7-grand-unified.png"
                      alt="Grand unified system architecture map"
                      loading="lazy"
                      className="w-full min-w-[720px] sm:min-w-0"
                    />
                  </div>
                </Link>
                <p className="mt-4 max-w-2xl text-base text-zinc-400">
                  Seven production architectures, every node sourced from the real
                  codebases: a multi-agent OS run by Claude Code, distributed
                  microservices, multi-tenant SaaS, and engineer-built automation.{' '}
                  <Link
                    href="/architecture"
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    See the full set →
                  </Link>
                </p>
              </Reveal>
            </section>

            {/* Metrics ledger */}
            <section className="py-16">
              <Reveal>
                <MetricsLedger />
              </Reveal>
            </section>

            {/* Work showcase */}
            <section id="work" className="scroll-mt-28 py-16">
              <SectionLabel>work</SectionLabel>
              <Reveal>
                <WorkShowcase />
              </Reveal>
            </section>

            {/* Experience */}
            <section id="experience" className="scroll-mt-28 py-16">
              <SectionLabel>experience</SectionLabel>
              <Reveal>
                <ExperienceList />
              </Reveal>
            </section>

            {/* Live signals */}
            <section id="signals" className="scroll-mt-28 py-16">
              <SectionLabel>live signals</SectionLabel>
              <Reveal>
                <LiveSignals />
              </Reveal>
            </section>

            {/* Education */}
            <section id="education" className="scroll-mt-28 py-16">
              <Reveal>
                <EducationLedger />
              </Reveal>
              <div className="mt-8">
                <OffHours />
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="scroll-mt-28 py-16">
              <h2 className="text-2xl font-medium tracking-tight text-ink-text sm:text-3xl">
                Get in touch.
              </h2>
              <div className="mt-6 flex flex-col gap-3 font-mono text-sm">
                <a
                  href="mailto:suley.kiani@outlook.com"
                  className="text-accent underline-offset-4 hover:underline"
                >
                  suley.kiani@outlook.com
                </a>
                <a
                  href="mailto:kianis4@mcmaster.ca"
                  className="text-accent underline-offset-4 hover:underline"
                >
                  kianis4@mcmaster.ca
                </a>
                <a
                  href="/resume-1page.pdf"
                  className="text-accent underline-offset-4 hover:underline"
                >
                  resume.pdf
                </a>
                <a
                  href="https://github.com/kianis4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent underline-offset-4 hover:underline"
                >
                  <GitHubIcon className="h-4 w-4 fill-current" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/suleyman-kiani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent underline-offset-4 hover:underline"
                >
                  <LinkedInIcon className="h-4 w-4 fill-current" />
                  LinkedIn
                </a>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </LensProvider>
  )
}
