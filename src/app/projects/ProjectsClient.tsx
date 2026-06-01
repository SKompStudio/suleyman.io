'use client'

import { useMemo, useRef, useState } from 'react'
import Image, { type StaticImageData } from 'next/image'
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

import { Container } from '@/components/Container'
import { GitHubIcon } from '@/components/SocialIcons'
import type { Project } from '@/lib/projects'
import type { LanguageStat } from '@/lib/github'
import type { ProjectLogo as ProjectLogoType } from '@/data/projects'
import { TechConstellation } from './TechConstellation'
import { screenshotFor } from './showcase'

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

type Status = 'live' | 'private' | 'source'

function deriveStatus(p: Project): Status {
  if (p.visibility === 'private') return 'private'
  const host = p.link?.href?.toLowerCase() || ''
  if (host && !host.includes('github.com')) return 'live'
  return 'source'
}

// Mono path label — the registry "address" of the project, JARVIS style.
function pathLabel(p: Project): string {
  const host = p.link?.href?.toLowerCase() || ''
  if (host && !host.includes('github.com')) {
    try {
      return `~/${new URL(p.link.href).hostname.replace(/^www\./, '')}`
    } catch {
      /* fall through */
    }
  }
  if (p.githubSlug) return `~/${p.githubSlug}`
  return `~/${p.slug}`
}

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, { cls: string; dot: string; label: string }> = {
    live: { cls: 'text-accent border-accent/30 bg-accent/5', dot: 'bg-accent', label: 'live' },
    private: { cls: 'text-gold border-gold/30 bg-gold/5', dot: 'bg-gold', label: 'private' },
    source: { cls: 'text-ink-muted border-white/10 bg-white/5', dot: 'bg-ink-muted', label: 'source' },
  }
  const cfg = map[status]
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
        cfg.cls
      )}
    >
      <span
        className={clsx(
          'h-1.5 w-1.5 rounded-full',
          cfg.dot,
          status === 'live' && 'hud-pulse animate-online-pulse'
        )}
      />
      {cfg.label}
    </span>
  )
}

function ProjectGlyph({ logo, name }: { logo: ProjectLogoType | null; name: string }) {
  if (logo?.type === 'icon' && logo.name) {
    const Icon = PROJECT_ICONS[logo.name.toLowerCase()]
    if (Icon) return <Icon className="h-5 w-5 text-ink-muted" />
  }
  return (
    <span className="font-mono text-sm font-semibold text-ink-muted">
      {initials(name)}
    </span>
  )
}

function initials(name = '') {
  return (
    name
      .split(/\s|-/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join('') || '··'
  )
}

function TechTags({ tech, limit }: { tech: string[]; limit?: number }) {
  const shown = limit ? tech.slice(0, limit) : tech
  const rest = limit ? tech.length - limit : 0
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10.5px] text-ink-muted">
      {shown.map((t) => (
        <span key={t} className="after:ml-2 after:text-white/10 after:content-['·'] last:after:hidden">
          {t}
        </span>
      ))}
      {rest > 0 && <span className="text-accent/60">+{rest}</span>}
    </div>
  )
}

// Minimal browser frame + real screenshot, or a HUD scan-grid placeholder.
function FramedVisual({
  image,
  url,
  name,
  tilt,
}: {
  image: StaticImageData | null
  url: string
  name: string
  tilt: { active: boolean }
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-2 truncate font-mono text-[10.5px] text-ink-muted">{url}</span>
      </div>
      <div className="relative aspect-[16/10] w-full bg-black/30">
        {image ? (
          <Image
            src={image}
            alt={`${name} screenshot`}
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover object-top"
            placeholder="blur"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              backgroundImage:
                'linear-gradient(rgba(91,200,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(91,200,255,0.07) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          >
            <span className="font-mono text-xs tracking-wider text-accent/50">{`</> ${name}`}</span>
          </div>
        )}
        {tilt.active && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-accent/10" />
        )}
      </div>
    </div>
  )
}

function useTilt() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false })

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ rx: py * -3, ry: px * 3, active: true })
  }
  const onLeave = () => setTilt({ rx: 0, ry: 0, active: false })
  return { ref, tilt, onMove, onLeave }
}

function FeaturedRecord({ project }: { project: Project }) {
  const status = deriveStatus(project)
  const image = screenshotFor(project.slug, project.name)
  const { ref, tilt, onMove, onLeave } = useTilt()
  const href = project.link?.href
  const showGithub = project.github && project.github.includes('github.com')

  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group relative flex h-full flex-col rounded-xl border border-accent/20 bg-ink-surface/40 p-5 transition-[transform,box-shadow,border-color] duration-300 ease-out [perspective:1200px] hover:border-accent/40 motion-reduce:transform-none motion-reduce:transition-none sm:p-6"
      style={{
        transform: tilt.active ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` : undefined,
        boxShadow: tilt.active
          ? '0 0 0 1px rgba(91,200,255,0.4), 0 24px 60px -24px rgba(91,200,255,0.45)'
          : undefined,
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="truncate font-mono text-xs text-accent">{pathLabel(project)}</span>
        <StatusPill status={status} />
      </div>

      <FramedVisual image={image} url={project.link?.label || ''} name={project.name} tilt={tilt} />

      <div className="mt-5 flex items-baseline justify-between gap-3">
        <h3 className="text-xl font-semibold tracking-tight text-ink-text">{project.name}</h3>
        {project.timeframe && (
          <span className="shrink-0 font-mono text-[10px] tracking-wider text-ink-muted">
            {project.timeframe}
          </span>
        )}
      </div>

      <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-zinc-300">{project.description}</p>

      {project.tech?.length > 0 && (
        <div className="mt-4">
          <TechTags tech={project.tech} limit={10} />
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/5 pt-4">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-text transition hover:text-accent"
          >
            <span>{project.link.label}</span>
            <FiArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span className="font-mono text-xs text-ink-muted">no live link</span>
        )}
        <div className="flex items-center gap-3 text-ink-muted">
          {status === 'private' && <FaLock className="h-3.5 w-3.5" title="Private repo" />}
          {showGithub && (
            <a
              href={project.github!}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-ink-text"
              aria-label="View on GitHub"
            >
              <GitHubIcon className="h-4 w-4" />
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

function CompactRecord({ project }: { project: Project }) {
  const status = deriveStatus(project)
  const href = project.link?.href
  const isGithubLink = href?.toLowerCase().includes('github.com')

  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-ink-border bg-ink-surface/30 p-4 transition duration-300 hover:border-accent/30 hover:bg-ink-surface/50 hover:shadow-[0_0_0_1px_rgba(91,200,255,0.18),0_16px_40px_-24px_rgba(91,200,255,0.35)]">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-black/40">
            <ProjectGlyph logo={project.logo} name={project.name} />
          </span>
          <span className="truncate font-mono text-[11px] text-accent/80">{pathLabel(project)}</span>
        </div>
        <StatusPill status={status} />
      </div>

      <h3 className="text-sm font-semibold tracking-tight text-ink-text">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition group-hover:text-accent"
          >
            {project.name}
          </a>
        ) : (
          project.name
        )}
      </h3>

      {project.description && (
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-muted">
          {project.description}
        </p>
      )}

      {project.tech?.length > 0 && (
        <div className="mt-3">
          <TechTags tech={project.tech} limit={5} />
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-3 font-mono text-[10px] text-ink-muted">
        <span className="tracking-wider">{formatMonthYear(project.updatedAt)}</span>
        <div className="flex items-center gap-2.5">
          {status === 'private' && <FaLock className="h-3 w-3" title="Private repo" />}
          {!isGithubLink && href && (
            <FiArrowUpRight className="h-3.5 w-3.5 transition group-hover:text-accent" />
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
  if (filter === 'experiments') return project.source === 'github' && !project.featured
  return true
}

function Readout({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-[10px] uppercase tracking-wider text-accent/60">{k}</span>
      <span className="font-mono text-sm font-semibold tabular-nums text-ink-text">{v}</span>
    </div>
  )
}

export function ProjectsClient({
  projects = [],
  languageStats = [],
}: {
  projects: Project[]
  languageStats?: LanguageStat[]
}) {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  const counts = useMemo(() => {
    const live = projects.filter((p) => deriveStatus(p) === 'live').length
    const oss = projects.filter((p) => p.source === 'github' && p.visibility === 'public').length
    return { total: projects.length, live, oss }
  }, [projects])

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
    () => filtered.filter((p) => p.featured).sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99)),
    [filtered]
  )

  const rest = useMemo(
    () =>
      filtered
        .filter((p) => !p.featured)
        .sort(
          (a, b) =>
            (a.priority ?? 99) - (b.priority ?? 99) ||
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
    [filtered]
  )

  return (
    <Container className="mt-16 overflow-x-clip sm:mt-32">
      {/* ── HUD header ──────────────────────────────────────────────────── */}
      <header className="hud-brackets relative overflow-hidden rounded-xl border border-accent/20 bg-ink-surface/30 p-6 sm:p-8">
        <div className="hud-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="hud-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <div className="flex items-center gap-3 font-mono text-xs text-accent">
              <span>~/projects</span>
              <span className="inline-flex items-center gap-1.5 text-ink-muted">
                <span aria-hidden className="hud-pulse animate-online-pulse text-accent">
                  ●
                </span>
                registry online
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-text sm:text-4xl">
              Things I&apos;ve shipped, broken, and rebuilt
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
              Production SaaS, research experiments, and client launches. Featured records are
              live applications with real users; everything else is open on GitHub.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/5 pt-5">
              <Readout k="total" v={counts.total} />
              <Readout k="production" v={counts.live} />
              <Readout k="open-source" v={counts.oss} />
            </div>
          </div>

          {/* Signature: the live tech-stack constellation */}
          <div className="rounded-lg border border-white/5 bg-black/30 p-3">
            <div className="mb-1 flex items-center justify-between px-1 font-mono text-[10px] uppercase tracking-wider text-accent/60">
              <span>stack constellation</span>
              <span className="text-ink-muted">shared tech graph</span>
            </div>
            <TechConstellation projects={projects} languageStats={languageStats} />
          </div>
        </div>
      </header>

      {/* ── Filter toolbar ──────────────────────────────────────────────── */}
      <div className="mt-10 flex flex-col gap-4 border-y border-ink-border py-4 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex flex-wrap items-center gap-1.5" aria-label="Project filters">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              title={f.description}
              className={clsx(
                'rounded-full border px-3 py-1.5 font-mono text-[12px] transition',
                filter === f.value
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-transparent text-ink-muted hover:border-white/10 hover:bg-white/5 hover:text-ink-text'
              )}
            >
              {f.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="grep name · tech · keyword…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-ink-border bg-black/30 px-4 py-1.5 font-mono text-xs text-ink-text placeholder-ink-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40 sm:w-64"
          />
          <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-wider text-ink-muted sm:inline">
            {filtered.length}/{projects.length}
          </span>
        </div>
      </div>

      {/* ── Featured records ────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-accent/70">
              ~/featured · production
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              {featured.length} / {filtered.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {featured.map((project) => (
              <FeaturedRecord key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* ── Compact records ─────────────────────────────────────────────── */}
      {rest.length > 0 && (
        <section className="mt-14">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-accent/70">
              {featured.length > 0 ? '~/everything-else' : '~/all-work'}
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              {rest.length} {rest.length === 1 ? 'record' : 'records'}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((project) => (
              <CompactRecord key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-ink-border py-16 text-center">
          <p className="font-mono text-sm text-ink-muted">
            {projects.length === 0
              ? 'registry empty — no records to display'
              : 'no records match that filter'}
          </p>
          {projects.length > 0 && (
            <button
              onClick={() => {
                setFilter('all')
                setQuery('')
              }}
              className="mt-3 font-mono text-xs text-accent transition hover:underline"
            >
              reset filters
            </button>
          )}
        </div>
      )}
    </Container>
  )
}
