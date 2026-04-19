import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

export const dynamic = 'force-dynamic'

import {
  ArrowRight,
  Zap,
  CheckCircle,
  Star,
  ArrowUpRight,
  Sparkles,
  Mail
} from 'lucide-react'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import {
  InstagramIcon,
  GitHubIcon,
  LinkedInIcon,
} from '@/components/SocialIcons'

import image1 from '@/images/logos/SKompXcel.png' // Was defined as path string but used in Photos map. Correcting imports.
import image2 from '@/images/photos/image-3.jpg'
import image3 from '@/images/photos/image-5.png'
import video from '@/images/photos/progress.mp4' // This needs declaration if .mp4 not handled by TS
import image5 from '@/images/logos/SKompXcel.png' // Wait, index.jsx had image5 as /ApplifyLogo.svg string?

// Checking original file imports to match:
// const image1 = '/SKomp.svg'
// const image5 = '/ApplifyLogo.svg'
// import image2 ...
// import video ...

// TypeScript requires handling static headers differently
import logoSKompXcel from '@/images/logos/SKompXcel.png'
import logoMHCC from '@/images/logos/mitsubishi.svg'
import logoGiftCash from '@/images/logos/giftcash.jpeg'
import logoSDI from '@/images/logos/sdi.jpeg'
import logoDevProtocol from '@/images/logos/devprotocol.png'

import { getAllArticles } from '@/lib/getAllArticles'
import { formatDate } from '@/lib/formatDate'
import { generateRssFeed } from '@/lib/generateRssFeed'

// Re-declaring imports as they were in the original file
const image1String = '/SKomp.svg'
const image5String = '/ApplifyLogo.svg'

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function ArrowDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface Article {
  slug: string
  title: string
  date: string
  description: string
}

function Article({ article }: { article: Article }) {
  return (
    <Card as="article">
      <Card.Title href={`/articles/${article.slug}`}>
        {article.title}
      </Card.Title>
      <Card.Eyebrow as="time" dateTime={article.date} decorate>
        {formatDate(article.date)}
      </Card.Eyebrow>
      <Card.Description>{article.description}</Card.Description>
      <Card.Cta>Read article</Card.Cta>
    </Card>
  )
}

function SocialLink({ icon: Icon, ...props }: { icon: React.ComponentType<{ className?: string }>; href: string; 'aria-label': string }) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}

function Newsletter() {
  return (
    <form
      action="/thank-you"
      className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
    >
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <MailIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Stay up to date</span>
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Get notified when I publish something new, and unsubscribe at any time.
      </p>
      <div className="mt-6 flex">
        <input
          type="email"
          placeholder="Email address"
          aria-label="Email address"
          required
          className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
        />
        <Button type="submit" className="ml-4 flex-none">
          Join
        </Button>
      </div>
    </form>
  )
}

interface Role {
  company: string
  title: string
  logo: any // StaticImageData imported
  start: string | { label: string; dateTime: string }
  end: string | { label: string; dateTime: string }
}

function Resume() {
  let resume: Role[] = [
    {
      company: 'Mitsubishi HC Capital Canada',
      title: 'Associate Account Manager – Equipment Finance',
      logo: logoMHCC,
      start: 'Sep 2025',
      end: 'Present',
    },
    {
      company: 'SKompXcel',
      title: 'Founder',
      logo: logoSKompXcel,
      start: 'Jan 2024',
      end: 'Present',
    },
    {
      company: 'E&S Solns.',
      title: 'Co-Founder and Lead Developer',
      logo: logoDevProtocol,
      start: 'June 2023',
      end: 'Present',
    },
    {
      company: 'GiftCash Inc.',
      title: 'Junior Web Developer',
      logo: logoGiftCash,
      start: 'May 2021',
      end: 'Aug 2022',
    },
    {
      company: 'SDI Labs.',
      title: 'Software Engineer Intern',
      logo: logoSDI,
      start: 'June 2019',
      end: 'Aug 2022',
    },
  ]

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <BriefcaseIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Work</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {resume.map((role, roleIndex) => (
          <li key={roleIndex} className="flex gap-4">
            <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
              <Image src={role.logo} alt="" className="h-7 w-7" unoptimized />
            </div>
            <dl className="flex flex-auto flex-wrap gap-x-2">
              <dt className="sr-only">Company</dt>
              <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {role.company}
              </dd>
              <dt className="sr-only">Role</dt>
              <dd className="text-xs text-zinc-500 dark:text-zinc-400">
                {role.title}
              </dd>
              <dt className="sr-only">Date</dt>
              <dd
                className="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
                aria-label={`${(role.start as any).label ?? role.start} until ${
                  (role.end as any).label ?? role.end
                }`}
              >
                <time dateTime={(role.start as any).dateTime ?? role.start}>
                  {(role.start as any).label ?? role.start}
                </time>{' '}
                <span aria-hidden="true">—</span>{' '}
                <time dateTime={(role.end as any).dateTime ?? role.end}>
                  {(role.end as any).label ?? role.end}
                </time>
              </dd>
            </dl>
          </li>
        ))}
      </ol>
      <Button href="./Suleyman_Kiani_RESUME_2025.pdf" variant="secondary" className="group mt-6 w-full">
        Download Resume
        <ArrowDownIcon className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
      </Button>
    </div>
  )
}

function Photos() {
  let rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2'];

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8 flex-wrap">
        {[image1String, image2, video ,image3, image5String].map((media, mediaIndex) => {
          const isVideo = typeof media === 'string' && media.endsWith('.mp4');
          const isSvg = typeof media === 'string' && media.endsWith('.svg');
          const src = typeof media === 'object' ? (media as any).src : media;

          return (
            <div
              key={String(src)}
              className={clsx(
                'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl',
                rotations[mediaIndex % rotations.length]
              )}
            >
              {/* Note: video support needs checking in Next.js 16/React 19 for custom props */}
              {isVideo ? (
                <video 
                  autoPlay
                  loop
                  muted
                  playsInline 
                  controls 
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src={src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : isSvg ? (
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <Image
                    src={src}
                    alt=""
                    width={500}
                    height={500}
                    sizes="(min-width: 640px) 18rem, 11rem"
                    className="max-h-full max-w-full object-contain"
                    style={{ backgroundColor: 'transparent' }}
                  />
                </div>
              ) : (
                <Image
                  src={src}
                  alt=""
                  width={500}
                  height={600}
                  sizes="(min-width: 640px) 18rem, 11rem"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Suleyman Kiani | Home',
  description: 'Suleyman Kiani - Associate Account Manager in equipment finance, MEng student in Computing and Software, and builder of tools like Applify AI and SKompXcel. Exploring the intersection of finance, ML, and cloud architecture.',
}

export default async function Home() {
  if (process.env.NODE_ENV === 'production') {
    await generateRssFeed()
  }

  const articles = (await getAllArticles())
    .slice(0, 4)
    .map(({ component, ...meta }: any) => meta)

  return (
    <>
      {/* Hero Section */}
      <Container className="mt-9">
        <div className="max-w-2xl">
          <div className="space-y-2 mb-6">
            <div className="inline-block rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              Finance • Code • Learning
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
              Progress rewards curiosity and deliberate practice.
            </h1>
          </div>
          
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            I&apos;m <strong>Suleyman Kiani</strong>—building systems that turn ideas into reality. 
            Currently balancing equipment finance at <strong>Mitsubishi HC Capital Canada</strong> with an 
            <strong> MEng in Computing and Software</strong> (Dec 2026), while exploring the intersection 
            of financial markets and machine learning.
          </p>

          {/* Key Metrics */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 border border-teal-200 dark:border-teal-700/50">
              <div className="text-2xl font-bold text-teal-700 dark:text-teal-400">150+</div>
              <div className="text-xs text-teal-600 dark:text-teal-500 mt-1">Applify AI Users</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">$15M+</div>
              <div className="text-xs text-blue-600 dark:text-blue-500 mt-1">Deals Financed</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700/50">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">100+</div>
              <div className="text-xs text-purple-600 dark:text-purple-500 mt-1">Students Mentored</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700/50">
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">1650</div>
              <div className="text-xs text-orange-600 dark:text-orange-500 mt-1">Chess Rating</div>
            </div>
          </div>

          {/* What I Do */}
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">What I Do</h2>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Equipment Finance</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Structure multi-million dollar construction & transportation deals. Build financial spreads, 
                    calculate EBITDA from statements, conduct 4-blocker credit evaluations, and model amortization 
                    schedules in Excel & Power BI.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Software Engineering</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Built <strong>Applify AI</strong> (150+ paying users)—an ATS-optimized résumé platform. Founded 
                    <strong> SKompXcel</strong>, mentoring 80+ students through algorithms, system design, and mock interviews. 
                    TypeScript, Next.js, Python, AWS, GCP.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Research & Learning</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Pursuing MEng in Computing & Software while diving into ML and financial markets—building 
                    systems that bridge data and decision-making.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tech Stack */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {['TypeScript', 'Next.js', 'Python', 'Node.js', 'PostgreSQL', 'AWS', 'GCP', 'Terraform', 'Excel', 'Power BI'].map((tech) => (
                <span key={tech} className="px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/10 dark:to-blue-900/10 border border-teal-200 dark:border-teal-800/50">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <strong>Let&apos;s Connect</strong> — Exploring cloud architecture, ML in finance, or just enjoy a good chess endgame? 
              My inbox is open.
            </p>
            
            {/* Social Links */}
            <div className="mt-4 flex gap-4">
              <SocialLink
                href="https://www.instagram.com/svley/"
                aria-label="Follow on Instagram"
                icon={InstagramIcon}
              />
              <SocialLink
                href="https://github.com/kianis4"
                aria-label="Follow on GitHub"
                icon={GitHubIcon}
              />
              <SocialLink
                href="https://www.linkedin.com/in/suleyman-kiani"
                aria-label="Follow on LinkedIn"
                icon={LinkedInIcon}
              />
              <SocialLink
                href="mailto:suley.kiani@outlook.com" 
                aria-label="Email me"
                icon={({ className, ...props }: any) => (
                  <Mail className={clsx("h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300", className)} />
                )}
              />
            </div>
          </div>
        </div>
      </Container>
            {/* Site Description */}
            <Container className="mt-16">
        <div className="max-w-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-sky-500">
                suleyman.io
              </span>
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              My working logbook—code, experiments, and lessons from building Applify AI, SKompXcel, 
              and a stack of open‑source tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1">Projects</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Live demos, architecture notes & post‑mortems</p>
            </div>
            
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1">Articles</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Cloud patterns, DevOps automation & problem‑solving</p>
            </div>
            
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1">Resume & Uses</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Skills, stack & gear that keeps the wheels turning</p>
            </div>
            
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1">Dashboards</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">LeetCode, Spotify & other data‑driven snapshots</p>
            </div>
          </div>
        </div>
      </Container>
      <div className="mt-16">
        <section className="py-10 md:py-16 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white blur-3xl"></div>
            <div className="absolute bottom-10 -left-20 w-60 h-60 rounded-full bg-white blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-white space-y-6 order-2 lg:order-1">
                <div className="flex items-center mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
                    <Sparkles className="h-4 w-4 mr-2 text-yellow-300" />
                    New from SKompXcel
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Applify AI — Your Personal <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">Résumé-Tailoring</span> Engine
                </h2>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl">
                  Paste any job description, get an ATS-optimized résumé tailored to your achievements. 
                  Download a perfect one-page PDF in minutes. <strong>150+ paying users</strong> and counting.
                </p>
                
                <div className="flex flex-wrap gap-5 pt-4">
                  <a 
                    href="https://www.applify-ai.com/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-gray-100 text-blue-700 font-medium transition-colors shadow-lg"
                  >
                    Experience Applify AI
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                  <Link 
                    href="/projects"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-medium transition-colors border border-white/20"
                  >
                    Learn More
                  </Link>
                </div>
                
                <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-white/20">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-300" />
                    <span>5-minute setup</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-yellow-300" />
                    <span>ATS-optimized</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-300" />
                    <span>87% success rate</span>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-white/20 shadow-2xl transform hover:-rotate-1 transition-transform duration-500">
                  <div className="relative rounded-xl overflow-hidden">
                    <Image
                      src="/images/applify.png"
                      alt="Applify AI"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover rounded-xl"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-full p-2 animate-float">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                        <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                        <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                        <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                        <Star className="h-4 w-4 text-yellow-400" fill="#FBBF24" />
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold">Resume Tailoring Made Simple</h3>
                      <p className="text-sm">Powered by SKompXcel AI</p>
                    </div>
                    
                    <div className="absolute -bottom-5 right-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1 shadow-lg transform rotate-6 animate-pulse">
                      <a 
                        href="https://www.applify-ai.com/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white dark:bg-gray-800 rounded-full p-1.5 block"
                      >
                        <ArrowUpRight className="h-5 w-5 text-blue-600" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Photos />
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-16">
            {articles.map((article: any) => (
              <Article key={article.slug} article={article} />
            ))}
          </div>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <Newsletter />
            <Resume />
          </div>
        </div>
      </Container>
    </>
  )
}
