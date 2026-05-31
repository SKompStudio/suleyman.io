import Link from 'next/link'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  LinkedInIcon,
} from '@/components/SocialIcons'

import { LensProvider } from '@/components/home/lens'
import { LensToggle } from '@/components/home/LensToggle'
import { MetaRail } from '@/components/home/MetaRail'
import { DualityPanel } from '@/components/home/DualityPanel'
import { MetricsLedger } from '@/components/home/MetricsLedger'
import { WorkShowcase } from '@/components/home/WorkShowcase'
import { ExperienceList } from '@/components/home/ExperienceList'
import { EducationLedger } from '@/components/home/EducationLedger'
import { SystemStatus } from '@/components/home/SystemStatus'
import { OffHours } from '@/components/home/OffHours'
import { HeroHairline } from '@/components/home/HeroHairline'
import { GrainOverlay } from '@/components/home/GrainOverlay'
import { Reveal } from '@/components/home/Reveal'

export const metadata = {
  title: 'Suleyman Kiani | Home',
  description:
    'Equipment finance professional and software engineer. Production SaaS, ML, and event-driven systems.',
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 font-mono text-sm uppercase tracking-wide text-zinc-400 dark:text-ink-muted">
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

          <div className="min-w-0 flex-1 lg:max-w-[1100px]">
            {/* Hero */}
            <section className="flex min-h-[60svh] flex-col justify-center py-8">
              <p className="font-mono text-sm text-accent">~/suleyman.io</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-normal tracking-tight text-zinc-900 dark:text-ink-text sm:text-5xl lg:text-7xl lg:leading-[1.05]">
                I ship production software. I also fund equipment-finance deals.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                Production SaaS and an ML product, both with paying users. 200% of monthly funding
                quota at Mitsubishi HC Capital.
              </p>

              <HeroHairline />

              <Reveal className="mt-6">
                <p className="font-mono text-sm text-zinc-500 dark:text-ink-muted">
                  <span className="text-zinc-900 dark:text-ink-text">200%</span> quota{' '}
                  <span className="text-zinc-300 dark:text-ink-border">·</span>{' '}
                  <span className="text-zinc-900 dark:text-ink-text">150</span> paying users{' '}
                  <span className="text-zinc-300 dark:text-ink-border">·</span>{' '}
                  <span className="text-zinc-900 dark:text-ink-text">100+</span> mentored
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
                  href="#work"
                  className="inline-flex items-center justify-center rounded-md border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-ink-border dark:text-zinc-300 dark:hover:border-zinc-500"
                >
                  View work
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

            {/* Education */}
            <section id="education" className="scroll-mt-28 py-16">
              <Reveal>
                <EducationLedger />
              </Reveal>
            </section>

            {/* Agentic OS readout */}
            <section id="system" className="scroll-mt-28 py-16">
              <Reveal>
                <SystemStatus lastBuild={lastBuild} />
              </Reveal>
              <div className="mt-8">
                <OffHours />
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="scroll-mt-28 py-16">
              <h2 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-ink-text sm:text-3xl">
                Get in touch.
              </h2>
              <div className="mt-6 flex flex-col gap-3 font-mono text-sm">
                <a
                  href="mailto:suleyman@skompxcel.com"
                  className="text-accent underline-offset-4 hover:underline"
                >
                  Get in touch
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
