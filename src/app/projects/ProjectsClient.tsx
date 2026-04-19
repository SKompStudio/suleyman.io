'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import {
  SiDjango,
  SiFlutter,
  SiGooglechrome,
  SiNodedotjs,
  SiOpenai,
  SiPython,
  SiReact,
  SiSwift,
  SiTypescript,
} from 'react-icons/si'
import { FaJava, FaLock } from 'react-icons/fa'
import { HiOutlineCodeBracketSquare } from 'react-icons/hi2'
import { FiServer, FiArrowUpRight } from 'react-icons/fi'
import { LuBot, LuCalendarDays } from 'react-icons/lu'
import { MdPhoneIphone } from 'react-icons/md'

import { SimpleLayout } from '@/components/SimpleLayout'
import { GitHubIcon } from '@/components/SocialIcons'
import type { Project } from '@/lib/projects'
import type { ProjectLogo as ProjectLogoType } from '@/data/projects'

const PROJECT_ICONS: Record<string, any> = {
  ai: LuBot,
  calendar: LuCalendarDays,
  chrome: SiGooglechrome,
  code: HiOutlineCodeBracketSquare,
  django: SiDjango,
  flutter: SiFlutter,
  java: FaJava,
  mobile: MdPhoneIphone,
  node: SiNodedotjs,
  openai: SiOpenai,
  python: SiPython,
  react: SiReact,
  server: FiServer,
  swift: SiSwift,
  typescript: SiTypescript,
}

const FILTERS: { label: string; value: string; description: string }[] = [
  { label: 'All', value: 'all', description: 'Everything' },
  { label: 'Production', value: 'production', description: 'Live in the wild' },
  { label: 'Open source', value: 'open-source', description: 'Code on GitHub' },
  { label: 'Experiments', value: 'experiments', description: 'Smaller research builds' },
]

function ProjectLogo({ logo, name, size = 36 }: { logo: ProjectLogoType | null; name: string; size?: number }) {
  if (logo?.type === 'image' && logo.src) {
    return (
      <Image
        src={logo.src}
        alt={name}
        width={size}
        height={size}
        className="object-contain"
        unoptimized
      />
    )
  }
  if (logo?.type === 'icon' && logo.name) {
    const Icon = PROJECT_ICONS[logo.name.toLowerCase()]
    if (Icon) return <Icon className={clsx('h-6 w-6', logo.className)} />
  }
  return (
    <span className="font-mono text-sm font-semibold text-zinc-500 dark:text-zinc-400">
      {getFallbackInitials(name)}
    </span>
  )
}

function getFallbackInitials(name = '') {
  return (
    name
      .split(/\s|-/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join('') || '··'
  )
}

function StatusDot({ status }: { status: 'live' | 'private' | 'source' | 'archive' }) {
  const map: Record<typeof status, { color: string; label: string }> = {
    live: { color: 'bg-teal-500 shadow-[0_0_0_3px_rgb(20_184_166/0.15)]', label: 'Live' },
    private: { color: 'bg-amber-500 shadow-[0_0_0_3px_rgb(245_158_11/0.15)]', label: 'Private' },
    source: { color: 'bg-zinc-400 shadow-[0_0_0_3px_rgb(161_161_170/0.15)]', label: 'Source' },
    archive: { color: 'bg-zinc-300 shadow-[0_0_0_3px_rgb(212_212_216/0.15)]', label: 'Archive' },
  }
  const cfg = map[status]
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
      <span className={clsx('h-1.5 w-1.5 rounded-full', cfg.color)} />
      {cfg.label}
    </span>
  )
}

function deriveStatus(p: Project): 'live' | 'private' | 'source' | 'archive' {
  if (p.visibility === 'private') return 'private'
  const host = p.link?.href?.toLowerCase() || ''
  if (host && !host.includes('github.com')) return 'live'
  return 'source'
}

function TechChips({ tech, limit }: { tech: string[]; limit?: number }) {
  const shown = limit ? tech.slice(0, limit) : tech
  const rest = limit ? tech.length - limit : 0
  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((t) => (
        <span
          key={t}
          className="font-mono text-[10.5px] text-zinc-600 dark:text-zinc-400 after:mx-1 after:text-zinc-300 after:content-['·'] last:after:hidden dark:after:text-zinc-700"
        >
          {t}
        </span>
      ))}
      {rest > 0 && (
        <span className="font-mono text-[10.5px] text-zinc-400 dark:text-zinc-500">+{rest}</span>
      )}
    </div>
  )
}

function HeroCard({ project }: { project: Project }) {
  const status = deriveStatus(project)
  const primaryHref = project.link?.href
  const showGithub = project.github && project.github.includes('github.com')

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white p-7 transition hover:border-zinc-300 hover:shadow-[0_1px_0_0_rgb(0_0_0/0.02),0_14px_40px_-12px_rgb(0_0_0/0.12)] dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:shadow-[0_1px_0_0_rgb(255_255_255/0.03),0_14px_40px_-12px_rgb(0_0_0/0.5)]">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <ProjectLogo logo={project.logo} name={project.name} size={28} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusDot status={status} />
          {project.timeframe && (
            <span className="font-mono text-[10px] tracking-wider text-zinc-400 dark:text-zinc-600">
              {project.timeframe}
            </span>
          )}
        </div>
      </div>

      <h3 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {project.name}
      </h3>

      <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-6">
        {project.description}
      </p>

      {project.badges && project.badges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.badges.map((b) => (
            <span
              key={b}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {b}
            </span>
          ))}
        </div>
      )}

      {project.tech && project.tech.length > 0 && (
        <div className="mt-5">
          <TechChips tech={project.tech} limit={10} />
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-zinc-100 pt-5 dark:border-zinc-900">
        {primaryHref ? (
          <a
            href={primaryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 transition group-hover:text-teal-600 dark:text-zinc-100 dark:group-hover:text-teal-400"
          >
            <span>{project.link.label}</span>
            <FiArrowUpRight className="h-4 w-4" />
          </a>
        ) : (
          <span className="text-sm text-zinc-400">No live link</span>
        )}
        <div className="flex items-center gap-3 text-zinc-400">
          {status === 'private' && <FaLock className="h-3.5 w-3.5" title="Private repo" />}
          {showGithub && (
            <a
              href={project.github!}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-zinc-700 dark:hover:text-zinc-200"
              aria-label="View on GitHub"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
          )}
          {typeof project.stats?.stars === 'number' && project.stats.stars > 0 && (
            <span className="font-mono text-xs">★ {project.stats.stars}</span>
          )}
        </div>
      </div>
    </article>
  )
}

function CompactCard({ project }: { project: Project }) {
  const status = deriveStatus(project)
  const primaryHref = project.link?.href
  const isGithubLink = primaryHref?.toLowerCase().includes('github.com')

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-900">
          <ProjectLogo logo={project.logo} name={project.name} size={22} />
        </div>
        <StatusDot status={status} />
      </div>

      <h3 className="mt-4 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {primaryHref ? (
          <a
            href={primaryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="transition group-hover:text-teal-600 dark:group-hover:text-teal-400"
          >
            {project.name}
          </a>
        ) : (
          project.name
        )}
      </h3>

      {project.description && (
        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>
      )}

      {project.tech && project.tech.length > 0 && (
        <div className="mt-4">
          <TechChips tech={project.tech} limit={5} />
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs text-zinc-400 dark:text-zinc-500">
        <span className="font-mono tracking-wider">
          {formatMonthYear(project.updatedAt)}
        </span>
        <div className="flex items-center gap-2.5">
          {status === 'private' && <FaLock className="h-3 w-3" title="Private repo" />}
          {!isGithubLink && primaryHref && (
            <FiArrowUpRight className="h-3.5 w-3.5 transition group-hover:text-teal-600 dark:group-hover:text-teal-400" />
          )}
          {isGithubLink && <GitHubIcon className="h-3.5 w-3.5" />}
        </div>
      </div>
    </article>
  )
}

function formatMonthYear(dateString: string) {
  if (!dateString) return ''
  try {
    return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' })
      .format(new Date(dateString))
      .toUpperCase()
  } catch {
    return ''
  }
}

function matchesFilter(project: Project, filter: string): boolean {
  if (filter === 'all') return true
  const href = project.link?.href?.toLowerCase() || ''
  const isLive = Boolean(href) && !href.includes('github.com')
  if (filter === 'production') return isLive
  if (filter === 'open-source') return project.source === 'github' && project.visibility === 'public'
  if (filter === 'experiments') {
    // "Experiments" = non-featured open-source GitHub repos
    return project.source === 'github' && !project.featured
  }
  return true
}

export function ProjectsClient({ projects = [] }: { projects: Project[] }) {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((p) => {
      if (!matchesFilter(p, filter)) return false
      if (!q) return true
      const hay = [p.name, p.description, ...(p.tech || [])].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [projects, filter, query])

  const featured = useMemo(
    () =>
      filtered
        .filter((p) => p.featured)
        .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99)),
    [filtered]
  )

  const rest = useMemo(
    () =>
      filtered
        .filter((p) => !p.featured)
        .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99) || (new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())),
    [filtered]
  )

  return (
    <SimpleLayout
      title="Things I've shipped, broken, and rebuilt"
      intro="Production SaaS platforms, research experiments, client launches, and weekend hacks. Featured projects are real applications with live users; everything else is open on GitHub."
    >
      <div className="mb-10 flex flex-col gap-4 border-y border-zinc-200 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
        <nav className="flex flex-wrap items-center gap-1" aria-label="Project filters">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              title={f.description}
              className={clsx(
                'rounded-full px-3 py-1.5 text-[13px] font-medium transition',
                filter === f.value
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
              )}
            >
              {f.label}
            </button>
          ))}
        </nav>
        <input
          type="search"
          placeholder="Search by name, tech, keyword…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:w-72 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
        />
      </div>

      {featured.length > 0 && (
        <section className="mb-16">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
              Featured · Production
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
              {featured.length} / {filtered.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {featured.map((project) => (
              <HeroCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <div className="mb-5 flex items-end justify-between">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
              {featured.length > 0 ? 'Everything else' : 'All work'}
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
              {rest.length} {rest.length === 1 ? 'project' : 'projects'}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((project) => (
              <CompactCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No projects match that filter.</p>
          <button
            onClick={() => {
              setFilter('all')
              setQuery('')
            }}
            className="mt-3 text-sm font-medium text-teal-600 hover:underline dark:text-teal-400"
          >
            Reset
          </button>
        </div>
      )}
    </SimpleLayout>
  )
}
