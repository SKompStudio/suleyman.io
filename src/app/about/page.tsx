import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { Code, GraduationCap, Terminal, ExternalLink } from 'lucide-react'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  LinkedInIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  children: React.ReactNode
  icon: any
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-accent dark:text-zinc-200 dark:hover:text-accent"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-accent" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

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

function SectionHeading({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center text-xl font-medium text-zinc-800 dark:text-zinc-100">
      {Icon && <Icon className="mr-2 h-5 w-5 text-accent" />}
      {children}
    </h2>
  )
}

function ProjectCard({
  title,
  description,
  link,
  linkLabel,
}: {
  title: string
  description: string
  link: string
  linkLabel: string
}) {
  return (
    <div className="mb-6 border-l-2 border-accent/60 py-1 pl-4">
      <h3 className="font-mono text-sm text-zinc-800 dark:text-zinc-100">{title}</h3>
      <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs font-medium text-accent hover:underline"
        >
          {linkLabel || 'Learn more'} <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      )}
    </div>
  )
}

export const metadata = {
  title: 'About',
  description:
    'Software engineer with equipment-finance experience. Production SaaS, an ML product, and event-driven systems.',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt="Suleyman Kiani"
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover shadow-xl dark:bg-zinc-800"
            />
          </div>
        </div>

        <div className="lg:order-first lg:row-span-2">
          <h1 className="mb-6 text-4xl font-medium tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
            About
          </h1>

          <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
            Full-stack and ML engineering. Equipment finance. I ship production software and I fund
            equipment-finance deals at Mitsubishi HC Capital.
          </p>

          <div className="mt-10 space-y-10">
            <section>
              <SectionHeading icon={GraduationCap}>What I do</SectionHeading>
              <p className="text-zinc-600 dark:text-zinc-400">
                I structure and fund equipment-finance deals at Mitsubishi HC Capital, currently at 200%
                of monthly quota. Alongside that I run two production products with paying users and an
                event-driven finance sandbox. I am completing an MEng in Computing and Software at
                McMaster, expected Dec 2026, with A+ grades in type theory and microservices.
              </p>
            </section>

            <section>
              <SectionHeading icon={Code}>What I ship</SectionHeading>
              <div className="mt-4 space-y-1">
                <ProjectCard
                  title="skomp-studio"
                  description="Multi-tenant SaaS running a pilates studio. Class booking, waitlists, Square payments for a studio that ran on paper. Row-level tenant isolation, a 5,000+ test Vitest suite and Playwright e2e gate every release."
                  link="https://skomp.studio/"
                  linkLabel="skomp.studio"
                />
                <ProjectCard
                  title="applify-ai"
                  description="Resume-tailoring ML product. Generates ATS-optimized, job-targeted resumes from any job description. ~150 paying users."
                  link="https://applify-ai.com/"
                  linkLabel="applify-ai.com"
                />
                <ProjectCard
                  title="dealflow-sandbox"
                  description="I fund equipment-finance deals. DealFlow Sandbox rebuilds that pipeline as event-driven .NET microservices: order, validate, credit, event-bus, fund, ledger."
                  link="https://github.com/kianis4"
                  linkLabel="GitHub"
                />
                <ProjectCard
                  title="skompxcel"
                  description="Mentorship platform for CS students. Algorithms, systems design, mock interviews, resume reviews. 100+ learners."
                  link="https://skompxcel.com/"
                  linkLabel="skompxcel.com"
                />
              </div>
            </section>

            <section>
              <SectionHeading icon={Terminal}>Stack</SectionHeading>
              <p className="mt-3 font-mono text-sm text-zinc-500 dark:text-ink-muted">
                typescript · next · react · prisma · neon · postgres · .net · python · aws · vercel
              </p>
            </section>

            <section>
              <p className="font-mono text-sm text-zinc-500 dark:text-ink-muted">
                off-hours: chess{' '}
                <a
                  href="https://www.chess.com/member/svley"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline-offset-4 hover:underline"
                >
                  1650
                </a>{' '}
                · kickboxing
              </p>
            </section>
          </div>
        </div>

        <div className="lg:pl-20">
          <ul
            role="list"
            className="mt-4 rounded-2xl border border-zinc-100 bg-white/80 p-6 dark:border-zinc-700/40 dark:bg-zinc-800/80"
          >
            <SocialLink href="https://github.com/kianis4/" icon={GitHubIcon}>
              GitHub
            </SocialLink>
            <SocialLink
              href="https://www.linkedin.com/in/suleyman-kiani"
              icon={LinkedInIcon}
              className="mt-4"
            >
              LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:suleyman@skompxcel.com"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              suleyman@skompxcel.com
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
