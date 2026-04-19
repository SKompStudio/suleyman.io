import type { ProjectEntry } from '@prisma/client'

export type ProjectEntryRow = ProjectEntry

export interface GithubRepo {
  id: number
  slug: string
  githubSlug: string
  name: string
  description: string
  link: { href: string; label: string }
  github: string
  logo: null
  timeframe: string
  tech: string[]
  featured: boolean
  priority: number
  badges: string[]
  source: 'github'
  visibility: 'private' | 'public'
  stats: {
    stars: number
    forks: number
    issues: number
    watchers: number
  }
  updatedAt: string
  createdAt: string
  topics: string[]
  homepage: string | null
  defaultBranch: string
}

export interface MergedProject {
  id: string | number
  slug: string
  githubSlug: string | null
  name: string
  description: string
  link: { href: string; label: string }
  github: string | null
  logo: { type: 'image' | 'icon'; src?: string; name?: string; className?: string } | null
  timeframe: string
  tech: string[]
  featured: boolean
  priority: number
  badges: string[]
  source: 'github' | 'custom'
  visibility: string
  stats: GithubRepo['stats'] | null
  updatedAt: string
  createdAt: string
  topics: string[]
  homepage: string | null
}

function applyOverride(repo: GithubRepo, override: ProjectEntryRow): MergedProject {
  return {
    id: repo.id,
    slug: repo.slug,
    githubSlug: repo.githubSlug,
    name: override.name ?? repo.name,
    description: override.description ?? repo.description,
    link: override.linkHref
      ? { href: override.linkHref, label: override.linkLabel ?? override.linkHref }
      : repo.link,
    github: override.githubUrl ?? repo.github,
    logo: override.logoSrc || override.logoIconName
      ? {
          type: ((override.logoType as 'image' | 'icon' | null) ?? (override.logoSrc ? 'image' : 'icon')) as 'image' | 'icon',
          src: override.logoSrc ?? undefined,
          name: override.logoIconName ?? undefined,
          className: override.logoClassName ?? undefined,
        }
      : null,
    timeframe: override.timeframe ?? repo.timeframe,
    tech: override.tech.length > 0 ? override.tech : repo.tech,
    featured: override.featured,
    priority: override.priority,
    badges: override.badges.length > 0 ? override.badges : repo.badges,
    source: 'github',
    visibility: override.visibility || repo.visibility,
    stats: repo.stats,
    updatedAt: repo.updatedAt,
    createdAt: repo.createdAt,
    topics: repo.topics,
    homepage: repo.homepage,
  }
}

function customToMerged(entry: ProjectEntryRow): MergedProject {
  return {
    id: entry.id,
    slug: entry.slug,
    githubSlug: null,
    name: entry.name ?? entry.slug,
    description: entry.description ?? '',
    link: {
      href: entry.linkHref ?? '#',
      label: entry.linkLabel ?? entry.linkHref ?? '',
    },
    github: entry.githubUrl,
    logo: entry.logoSrc || entry.logoIconName
      ? {
          type: ((entry.logoType as 'image' | 'icon' | null) ?? (entry.logoSrc ? 'image' : 'icon')) as 'image' | 'icon',
          src: entry.logoSrc ?? undefined,
          name: entry.logoIconName ?? undefined,
          className: entry.logoClassName ?? undefined,
        }
      : null,
    timeframe: entry.timeframe ?? 'Ongoing',
    tech: entry.tech,
    featured: entry.featured,
    priority: entry.priority,
    badges: entry.badges,
    source: 'custom',
    visibility: entry.visibility,
    stats: null,
    updatedAt: toIsoString(entry.updatedAt),
    createdAt: toIsoString(entry.createdAt),
    topics: [],
    homepage: entry.linkHref,
  }
}

export function mergeProjects(
  githubRepos: GithubRepo[],
  dbEntries: ProjectEntryRow[]
): MergedProject[] {
  const overrideBySlug = new Map<string, ProjectEntryRow>()
  const customs: ProjectEntryRow[] = []

  for (const entry of dbEntries) {
    if (entry.source === 'GITHUB' && entry.githubSlug) {
      overrideBySlug.set(entry.githubSlug.toLowerCase(), entry)
    } else if (entry.source === 'CUSTOM') {
      customs.push(entry)
    }
  }

  const merged: MergedProject[] = []
  const customSlugs = new Set(customs.filter((c) => c.visible).map((c) => c.slug.toLowerCase()))
  const matchedOverrideSlugs = new Set<string>()

  for (const repo of githubRepos) {
    // If a CUSTOM entry already claims this slug, skip the github-only row.
    if (customSlugs.has(repo.slug.toLowerCase())) continue
    const override = overrideBySlug.get(repo.githubSlug.toLowerCase())
    if (override && !override.visible) continue
    if (override) matchedOverrideSlugs.add(override.githubSlug!.toLowerCase())
    merged.push(override ? applyOverride(repo, override) : githubToMerged(repo))
  }

  // Orphan GITHUB overrides (repo not returned by fetch, e.g. private) render on their own.
  for (const [slug, override] of overrideBySlug.entries()) {
    if (matchedOverrideSlugs.has(slug)) continue
    if (!override.visible) continue
    if (customSlugs.has(override.slug.toLowerCase())) continue
    merged.push(customToMerged(override))
  }

  for (const entry of customs) {
    if (!entry.visible) continue
    merged.push(customToMerged(entry))
  }

  merged.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    if (a.priority !== b.priority) return a.priority - b.priority
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  return merged
}

function toIsoString(value: Date | string): string {
  if (typeof value === 'string') return value
  if (value instanceof Date) return value.toISOString()
  return String(value)
}

function githubToMerged(repo: GithubRepo): MergedProject {
  return {
    id: repo.id,
    slug: repo.slug,
    githubSlug: repo.githubSlug,
    name: repo.name,
    description: repo.description,
    link: repo.link,
    github: repo.github,
    logo: null,
    timeframe: repo.timeframe,
    tech: repo.tech,
    featured: repo.featured,
    priority: repo.priority,
    badges: repo.badges,
    source: 'github',
    visibility: repo.visibility,
    stats: repo.stats,
    updatedAt: repo.updatedAt,
    createdAt: repo.createdAt,
    topics: repo.topics,
    homepage: repo.homepage,
  }
}
