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
  description: "I'm Suleyman 'Suley' Kiani: Associate Account Manager in equipment finance, MEng student, and builder of production SaaS like Applify AI and Skomp Studio. Exploring finance, ML, and cloud architecture.",
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
                I&apos;ve been balancing two parallel tracks since September 2025. On the academic side, I&apos;ve now wrapped up the first year of my <strong>MEng in Computing and Software</strong> (expected Dec 2026), and I&apos;m quietly proud of the A+ grades I earned in <em>Simple Type Theory</em> and <em>Microservices‑Oriented Architectures</em>—two courses that pulled at very different parts of my brain. On the work side, I&apos;m about nine months into my role as an <strong>Associate Account Manager in equipment finance</strong> at Mitsubishi HC Capital Canada. By day I structure multi‑million‑dollar deals, run credit analysis, and build amortization models in Excel and Power BI; I&apos;ve exceeded my funding quota every month of the current fiscal year, including funding $4M against a $2M target—200% of quota—in both April and May 2026. By night I&apos;m diving into machine learning, sharpening my understanding of financial markets, and threading together what I learn in both worlds. The goal hasn&apos;t changed: gain real experience in financial markets while deepening my technical foundation, so I can build intelligent systems that bridge the gap between data and decision‑making.
              </p>
            </section>
            
            <section>
              <SectionHeading icon={Code}>Building Useful Things</SectionHeading>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                At McMaster University I was essentially the unofficial &ldquo;CS ambassador,&rdquo; guiding visitors through labs, pair‑debugging first‑years on segmentation faults, and learning as much from their fresh questions as they did from my answers. That give‑and‑take grew into SKompXcel, the mentorship platform where more than 80 learners have drilled algorithms, systems design, mock interviews, and résumé reviews. These days that same instinct shows up in the production SaaS I ship and maintain—real products with real users, where the feedback loop is unforgiving and all the more rewarding for it. <strong>Applify AI</strong> now serves 150+ paying users, and <strong>Skomp Studio</strong> has grown past 500 users—each one a reminder that the best way to learn is to put something useful into the world and listen.
              </p>
              <div className="mt-4 space-y-1">
                <ProjectCard
                  title="Applify AI"
                  description="An AI‑powered resume‑tailoring platform (Next.js 15 + OpenAI) that helps job‑seekers cut through ATS filters—now supporting 150+ paying users."
                  link="https://www.applify-ai.com/"
                  linkLabel="Visit Applify AI"
                />

                <ProjectCard
                  title="Skomp Studio"
                  description="A multi‑tenant fitness‑studio SaaS that handles scheduling, memberships, and payments for 500+ users across independent studios."
                  link="https://skomp.studio/"
                  linkLabel="Visit Skomp Studio"
                />

                <ProjectCard
                  title="SKompXcel"
                  description="A mentorship hub where computer‑science students practice algorithms, mock interviews, and good study habits on a serverless Google Cloud stack."
                  link="/projects/skompxcel"
                  linkLabel="Learn more about SKompXcel"
                />

                <ProjectCard
                  title="Open-Source Collection"
                  description="A growing collection of open‑source side projects—from LeetCode stat scrapers to rule‑based chatbots—shared so others can build on them."
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
                {['TypeScript', 'Next.js', 'Node', 'Prisma', 'Inngest', 'AWS', 'GCP', 'PostgreSQL', 'Python', 'Terraform', 'Excel', 'Power BI'].map((tech) => (
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
