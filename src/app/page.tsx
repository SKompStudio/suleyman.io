import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import {
  ArrowRight,
  Zap,
  CheckCircle,
  Star,
  ArrowUpRight,
  Sparkles,
  Mail,
} from 'lucide-react'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import {
  InstagramIcon,
  GitHubIcon,
  LinkedInIcon,
} from '@/components/SocialIcons'

import image2 from '@/images/photos/image-3.jpg'
import image3 from '@/images/photos/image-5.png'
import video from '@/images/photos/progress.mp4'

import logoSKompXcel from '@/images/logos/SKompXcel.png'
import logoMHCC from '@/images/logos/mitsubishi.svg'
import logoGiftCash from '@/images/logos/giftcash.jpeg'
import logoSDI from '@/images/logos/sdi.jpeg'
import logoDevProtocol from '@/images/logos/devprotocol.png'

import { getAllArticles } from '@/lib/getAllArticles'
import { formatDate } from '@/lib/formatDate'

export const dynamic = 'force-dynamic'

const image1String = '/SKomp.svg'
const image5String = '/ApplifyLogo.svg'

export const metadata = {
  title: 'Suleyman Kiani | Home',
  description:
    'Suleyman Kiani — Associate Account Manager in equipment finance exceeding quota every month, MEng candidate in Computing and Software (expected Dec 2026), and builder of tools like Applify AI and SKompXcel. Exploring the intersection of finance, ML, and cloud architecture.',
}

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

interface ArticleMeta {
  slug: string
  title: string
  date: string
  description: string
}

function Article({ article }: { article: ArticleMeta }) {
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

function SocialLink({
  icon: Icon,
  ...props
}: {
  icon: React.ComponentType<{ className?: string }>
  href: string
  'aria-label': string
}) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-teal-600 dark:fill-zinc-400 dark:group-hover:fill-teal-400" />
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
          className="min-w-0 flex-auto appearance-none rounded-2xl border border-zinc-900/10 bg-white px-4 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
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
  logo: any
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
      <Button
        href="./Suleyman_Kiani_RESUME_2025.pdf"
        variant="secondary"
        className="group mt-6 w-full"
      >
        Download Resume
        <ArrowDownIcon className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
      </Button>
    </div>
  )
}

function Photos() {
  let rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2']

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex flex-wrap justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {[image1String, image2, video, image3, image5String].map(
          (media, mediaIndex) => {
            const isVideo = typeof media === 'string' && media.endsWith('.mp4')
            const isSvg = typeof media === 'string' && media.endsWith('.svg')
            const src = typeof media === 'object' ? (media as any).src : media

            return (
              <div
                key={String(src)}
                className={clsx(
                  'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-900/5 dark:bg-zinc-800 dark:ring-0 sm:w-72',
                  rotations[mediaIndex % rotations.length],
                )}
              >
                {isVideo ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
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
            )
          },
        )}
      </div>
    </div>
  )
}

export default async function Home() {
  const articles = (await getAllArticles())
    .slice(0, 4)
    .map(({ component, ...meta }: any) => meta)

  return (
    <>
      {/* Hero Section */}
      <Container className="mt-9">
        <div className="max-w-2xl">
          <div className="mb-6 space-y-2">
            <div className="inline-block rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              Finance • Code • Learning
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
              Progress rewards curiosity and deliberate practice.
            </h1>
          </div>

          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            I&apos;m <strong>Suleyman Kiani</strong>—building systems that turn
            ideas into reality. I&apos;m ~9 months into equipment finance at{' '}
            <strong>Mitsubishi HC Capital Canada</strong>, where I&apos;ve
            exceeded my funding quota every single month, while finishing my{' '}
            <strong>MEng in Computing and Software</strong> (expected Dec 2026).
            I just wrapped Year 1 with an A+ in Simple Type Theory and
            Microservices-Oriented Architectures, and I&apos;m exploring the
            intersection of financial markets and machine learning.
          </p>

          {/* Key Metrics */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100 p-4 dark:border-teal-700/50 dark:from-teal-900/20 dark:to-teal-800/20">
              <div className="text-2xl font-bold text-teal-700 dark:text-teal-400">
                150+
              </div>
              <div className="mt-1 text-xs text-teal-600 dark:text-teal-500">
                Applify AI Users
              </div>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:border-blue-700/50 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                200%
              </div>
              <div className="mt-1 text-xs text-blue-600 dark:text-blue-500">
                Quota Attainment (Apr–May &apos;26)
              </div>
            </div>
            <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4 dark:border-purple-700/50 dark:from-purple-900/20 dark:to-purple-800/20">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                100+
              </div>
              <div className="mt-1 text-xs text-purple-600 dark:text-purple-500">
                Students Mentored
              </div>
            </div>
            <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 dark:border-orange-700/50 dark:from-orange-900/20 dark:to-orange-800/20">
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                1650
              </div>
              <div className="mt-1 text-xs text-orange-600 dark:text-orange-500">
                Chess Rating
              </div>
            </div>
          </div>

          {/* What I Do */}
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              What I Do
            </h2>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700/50 dark:bg-zinc-800/50">
                <div className="mt-0.5 flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Equipment Finance
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Structure multi-million dollar construction &amp;
                    transportation deals. I&apos;ve exceeded my funding quota
                    every month this fiscal year—hitting{' '}
                    <strong>200% attainment in Apr–May 2026</strong>. I build
                    financial spreads, calculate EBITDA from statements, conduct
                    4-blocker credit evaluations, and model amortization
                    schedules in Excel &amp; Power BI.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700/50 dark:bg-zinc-800/50">
                <div className="mt-0.5 flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Software Engineering
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Built <strong>Applify AI</strong> (150+ users)—an
                    ATS-optimized résumé platform. Founded{' '}
                    <strong>SKompXcel</strong>, mentoring 100+ students through
                    algorithms, system design, and mock interviews. TypeScript,
                    Next.js, Python, AWS, GCP.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700/50 dark:bg-zinc-800/50">
                <div className="mt-0.5 flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Research &amp; Learning
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Finishing my MEng in Computing &amp; Software (expected Dec
                    2026)—Year 1 done with an A+ in Simple Type Theory and
                    Microservices-Oriented Architectures—while diving into ML and
                    financial markets to build systems that bridge data and
                    decision-making.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                'TypeScript',
                'Next.js',
                'Python',
                'Node.js',
                'PostgreSQL',
                'AWS',
                'GCP',
                'Terraform',
                'Excel',
                'Power BI',
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-blue-50 p-6 dark:border-teal-800/50 dark:from-teal-900/10 dark:to-blue-900/10">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              <strong>Let&apos;s Connect</strong> — Exploring cloud architecture,
              ML in finance, or just enjoy a good chess endgame? My inbox is open.
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
                icon={({ className }: { className?: string }) => (
                  <Mail
                    className={clsx(
                      'h-6 w-6 fill-zinc-500 transition group-hover:fill-teal-600 dark:fill-zinc-400 dark:group-hover:fill-teal-400',
                      className,
                    )}
                  />
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
            <h2 className="mb-2 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
              <span className="bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-transparent">
                suleyman.io
              </span>
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              My working logbook—code, experiments, and lessons from building
              Applify AI, SKompXcel, and a stack of open-source tools.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700/50 dark:bg-zinc-800/50">
              <h3 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Projects
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Live demos, architecture notes &amp; post-mortems
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700/50 dark:bg-zinc-800/50">
              <h3 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Articles
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Cloud patterns, DevOps automation &amp; problem-solving
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700/50 dark:bg-zinc-800/50">
              <h3 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Resume &amp; Uses
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Skills, stack &amp; gear that keeps the wheels turning
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700/50 dark:bg-zinc-800/50">
              <h3 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Dashboards
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                LeetCode, Spotify &amp; other data-driven snapshots
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Applify AI Promo */}
      <div className="mt-16">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 py-10 md:py-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white blur-3xl"></div>
            <div className="absolute -left-20 bottom-10 h-60 w-60 rounded-full bg-white blur-3xl"></div>
          </div>

          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="order-2 space-y-6 text-white lg:order-1">
                <div className="mb-2 flex items-center">
                  <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                    <Sparkles className="mr-2 h-4 w-4 text-yellow-300" />
                    New from SKompXcel
                  </span>
                </div>
                <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                  Applify AI — Your Personal{' '}
                  <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                    Résumé-Tailoring
                  </span>{' '}
                  Engine
                </h2>
                <p className="max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">
                  Paste any job description, get an ATS-optimized résumé tailored
                  to your achievements. Download a perfect one-page PDF in
                  minutes. <strong>150+ users</strong> and counting.
                </p>

                <div className="flex flex-wrap gap-5 pt-4">
                  <a
                    href="https://www.applify-ai.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 font-medium text-blue-700 shadow-lg transition-colors hover:bg-gray-100"
                  >
                    Experience Applify AI
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                  <Link
                    href="/projects"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-blue-700 px-6 py-3.5 font-medium text-white transition-colors hover:bg-blue-800"
                  >
                    Learn More
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-6 border-t border-white/20 pt-6">
                  <div className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-yellow-300" />
                    <span>5-minute setup</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-yellow-300" />
                    <span>ATS-optimized</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-yellow-300" />
                    <span>87% success rate</span>
                  </div>
                </div>
              </div>

              <div className="relative order-1 lg:order-2">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-400/20 to-purple-500/20 blur-3xl"></div>
                <div className="relative transform rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-4 shadow-2xl backdrop-blur-sm transition-transform duration-500 hover:-rotate-1 md:p-6">
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src="/images/applify.png"
                      alt="Applify AI"
                      width={600}
                      height={400}
                      className="h-auto w-full rounded-2xl object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    <div className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm dark:bg-gray-800/90">
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

                    <div className="absolute -bottom-5 right-8 rotate-6 transform rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1 shadow-lg">
                      <a
                        href="https://www.applify-ai.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-full bg-white p-1.5 dark:bg-gray-800"
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
            {articles.map((article: ArticleMeta) => (
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
