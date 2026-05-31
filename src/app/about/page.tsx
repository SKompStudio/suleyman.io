import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { 
  Code, 
  GraduationCap, 
  Heart, 
  Terminal,
  ExternalLink,
  Activity
} from 'lucide-react'

import { Container } from '@/components/Container'
import {
  InstagramIcon,
  GitHubIcon,
  LinkedInIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

function SocialLink({ className, href, children, icon: Icon }: { className?: string, href: string, children: React.ReactNode, icon: any }) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
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

function SectionHeading({ icon: Icon, children }: { icon: any, children: React.ReactNode }) {
  return (
    <h2 className="flex items-center text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">
      {Icon && <Icon className="h-6 w-6 mr-2 text-teal-500" />}
      {children}
    </h2>
  )
}

function ProjectCard({ title, description, link, linkLabel }: { title: string, description: string, link: string, linkLabel: string }) {
  return (
    <div className="mb-6 border-l-2 border-teal-500 pl-4 py-1">
      <h3 className="font-bold text-zinc-800 dark:text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{description}</p>
      {link && (
        <a 
          href={link}
          target="_blank"
          rel="noopener noreferrer" 
          className="inline-flex items-center text-xs font-medium text-teal-500 hover:text-teal-600"
        >
          {linkLabel || 'Learn more'} <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      )}
    </div>
  )
}

export const metadata = {
  title: 'About',
  description: "I'm Suleyman 'Suley' Kiani: Associate Account Manager in equipment finance, MEng student, and builder of tools like Applify AI. Exploring finance, ML, and cloud architecture.",
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        
        {/* Left Side - Portrait Image */}
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt="Suleyman Kiani"
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800 shadow-xl"
            />
          </div>
        </div>

        {/* Right Side - About Me Text */}
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl mb-6">
            About Me
          </h1>
          
          <div className="prose dark:prose-invert">
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
              A few lines of code, a well‑timed chess tactic, or a calm slip inside a kick‑boxing exchange all point to the same truth: progress rewards curiosity and deliberate practice. I&apos;m <strong>Suleyman &apos;Suley&apos; Kiani</strong>, a perennial student who builds software because it turns day‑dreams into reality.
            </p>
          </div>
          
          <div className="mt-10 space-y-10">
            <section>
              <SectionHeading icon={GraduationCap}>Current Journey</SectionHeading>
              <p className="text-zinc-600 dark:text-zinc-400">
                Since September 2025, I&apos;ve run two parallel tracks. By day I&apos;m an <strong>Associate Account Manager in equipment finance</strong> at Mitsubishi HC Capital Canada—underwriting and structuring multi‑million‑dollar leases, spreading financials, and running credit analysis. I&apos;ve exceeded my funding quota every month since my second month, and funded <strong>200% of target</strong> through the spring. By night I&apos;m completing an <strong>MEng in Computing and Software</strong> (expected Dec 2026; Year 1 done with A+ grades in type theory and microservices) and shipping production software. The throughline is the same: build intelligent systems that close the gap between data and decision‑making, with one foot firmly in finance and one in engineering.
              </p>
            </section>
            
            <section>
              <SectionHeading icon={Code}>Building Useful Things</SectionHeading>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                At McMaster University I was essentially the unofficial &ldquo;CS ambassador,&rdquo; guiding visitors through labs, pair‑debugging first‑years on segmentation faults, and learning as much from their fresh questions as they did from my answers. That give‑and‑take grew into SKompXcel, the mentorship platform where 100+ learners have drilled algorithms, systems design, mock interviews, and résumé reviews. These days I ship production software the same way I learn—end to end.
              </p>
              <div className="mt-4 space-y-1">
                <ProjectCard
                  title="Skomp Studio"
                  description="A multi‑tenant fitness‑studio SaaS (~100K lines of TypeScript) running a live paying studio on Next.js, Prisma/Neon, Square payments, and AWS—hexagonal architecture with row‑level tenant isolation."
                  link="https://www.solsticepilates.ca/"
                  linkLabel="See it live"
                />

                <ProjectCard
                  title="Applify AI"
                  description="An AI‑powered résumé‑tailoring platform (Next.js + LLMs) with ~150 paying users, generating ATS‑optimized, job‑targeted résumés in minutes."
                  link="https://www.applify-ai.com/"
                  linkLabel="Visit Applify AI"
                />

                <ProjectCard
                  title="SKompXcel"
                  description="A mentorship hub where 100+ computer‑science students practice algorithms, mock interviews, and good study habits on a serverless Google Cloud stack."
                  link="/projects/skompxcel"
                  linkLabel="Learn more about SKompXcel"
                />

                <ProjectCard
                  title="Open-Source Collection"
                  description="A growing collection of open‑source side projects—from a from‑scratch micrograd neural‑net engine to a .NET event‑driven deal‑flow sandbox—shared so others can build on them."
                  link="https://github.com/kianis4"
                  linkLabel="Browse GitHub repos"
                />
              </div>
            </section>
            
            <section>
              <SectionHeading icon={Activity}>Off the Clock</SectionHeading>
              <p className="text-zinc-600 dark:text-zinc-400">
                Rapid chess keeps my brain sharp (1650 ELO peak), kick‑boxing keeps me grounded, 
                and mentoring keeps me curious—there&apos;s nothing like watching a concept finally click for someone.
              </p>
            </section>
            
            <section>
              <SectionHeading icon={Heart}>Guiding Ideas</SectionHeading>
              <p className="text-zinc-600 dark:text-zinc-400">
                Empathy first, iterate fast, share what you learn. Whether I&apos;m analyzing credit structures, refactoring a codebase, or walking a student through dynamic programming, the goal is the same: make the next step easier for the person beside me.
              </p>
            </section>
            
            <section>
              <SectionHeading icon={Terminal}>Tech Snapshot</SectionHeading>
              <div className="flex flex-wrap gap-2 mt-3">
                {['TypeScript', 'Python', 'Next.js', 'React', 'Node', 'PostgreSQL', 'Prisma', 'AWS', 'GCP', 'Docker', '.NET', 'Claude API', 'Power BI'].map((tech) => (
                  <span 
                    key={tech} 
                    className="px-3 py-1 text-xs bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
            
            <section>
              <p className="text-zinc-600 dark:text-zinc-400 italic border-l-4 border-zinc-200 dark:border-zinc-700 pl-4 py-1">
                If you&apos;re exploring thoughtful cloud architecture, pragmatic AI, financial tech, or just enjoy trading endgame ideas, feel free to reach out.
              </p>
            </section>
          </div>
        </div>

        {/* Right Side - Social Links */}
        <div className="lg:pl-20">
          <ul role="list" className="mt-4 rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm">
            <SocialLink href="https://www.instagram.com/svley/" icon={InstagramIcon}>
              Follow on Instagram
            </SocialLink>
            <SocialLink href="https://github.com/kianis4/" icon={GitHubIcon} className="mt-4">
              Follow on GitHub
            </SocialLink>
            <SocialLink href="https://www.linkedin.com/in/suleyman-kiani-9249a0240/" icon={LinkedInIcon} className="mt-4">
              Follow on LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:suley.kiani@outlook.com"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              suley.kiani@outlook.com
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
