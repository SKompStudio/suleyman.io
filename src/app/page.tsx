import Link from 'next/link'

import { Container } from '@/components/Container'
import { GitHubIcon, LinkedInIcon } from '@/components/SocialIcons'

import { GridBackground } from '@/components/home/GridBackground'
import { Hero } from '@/components/home/Hero'
import { MetricStrip } from '@/components/home/MetricStrip'
import { ShippedSystems } from '@/components/home/ShippedSystems'
import { OperatorConsole } from '@/components/home/OperatorConsole'
import { BuildFeed } from '@/components/home/BuildFeed'
import { CommitHeatmap } from '@/components/home/CommitHeatmap'
import { WorkingStack } from '@/components/home/WorkingStack'
import { ExperienceList } from '@/components/home/ExperienceList'
import { EducationLedger } from '@/components/home/EducationLedger'
import { Reveal } from '@/components/home/Reveal'
import { buildMeta } from '@/lib/buildMeta'

export const metadata = buildMeta({
  title: 'Suleyman Kiani | Home',
  description:
    'I do not have a portfolio. I have a running system: a self-hosted agentic OS, an autonomous career engine, and an autobuilder that ships projects nightly.',
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
  const lastDeploy = new Date().toISOString().slice(0, 10)

  return (
    <>
      <GridBackground />
      <Container className="relative z-10 mt-9 overflow-x-clip">
        {/* Hero — anti-portfolio thesis, server-rendered LCP headline. */}
        <section className="py-8 lg:py-10">
          <Hero lastDeploy={lastDeploy} />
          <MetricStrip />
        </section>

        {/* Evidence grid — service dashboard (left) + live proof rail (right). */}
        <section className="grid grid-cols-1 gap-5 pb-12 lg:grid-cols-[1.55fr_1fr]">
          <div className="flex flex-col gap-5">
            <Reveal>
              <ShippedSystems />
            </Reveal>
          </div>
          <div className="flex flex-col gap-5">
            <Reveal>
              <OperatorConsole />
            </Reveal>
            <Reveal delay={1}>
              <BuildFeed />
            </Reveal>
            <Reveal delay={2}>
              <CommitHeatmap />
            </Reveal>
            <Reveal delay={3}>
              <WorkingStack />
            </Reveal>
          </div>
        </section>

        {/* Architecture — Grand Unified map → /architecture gallery */}
        <section id="architecture" className="scroll-mt-28 py-14">
          <SectionLabel>architecture</SectionLabel>
          <Reveal>
            <Link
              href="/architecture"
              className="group block overflow-hidden rounded-2xl border border-accent/15 bg-ink-bg transition-colors hover:border-accent/40"
            >
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

        {/* Experience */}
        <section id="experience" className="scroll-mt-28 py-14">
          <SectionLabel>experience</SectionLabel>
          <Reveal>
            <ExperienceList />
          </Reveal>
        </section>

        {/* Education */}
        <section id="education" className="scroll-mt-28 py-14">
          <Reveal>
            <EducationLedger />
          </Reveal>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-28 py-14">
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
      </Container>
    </>
  )
}
