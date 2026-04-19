import { describe, it, expect } from 'vitest'
import { mergeProjects, type ProjectEntryRow, type GithubRepo } from './mergeProjects'

const githubRepo: GithubRepo = {
  id: 1,
  slug: 'applify-ai',
  githubSlug: 'kianis4/applify-ai',
  name: 'Applify Ai',
  description: 'original github description',
  link: { href: 'https://github.com/kianis4/applify-ai', label: 'kianis4/applify-ai' },
  github: 'https://github.com/kianis4/applify-ai',
  logo: null,
  timeframe: 'Updated Apr 2026',
  tech: ['TypeScript', 'Nextjs'],
  featured: false,
  priority: 99,
  badges: ['Open Source'],
  source: 'github',
  visibility: 'public',
  stats: { stars: 0, forks: 0, issues: 0, watchers: 0 },
  updatedAt: '2026-04-18T00:00:00Z',
  createdAt: '2025-02-01T00:00:00Z',
  topics: [],
  homepage: null,
  defaultBranch: 'main',
}

const baseOverride: ProjectEntryRow = {
  id: 'entry1',
  slug: 'applify-ai',
  source: 'GITHUB',
  githubSlug: 'kianis4/applify-ai',
  name: null,
  description: null,
  linkHref: null,
  linkLabel: null,
  logoType: null,
  logoSrc: null,
  logoIconName: null,
  logoClassName: null,
  timeframe: null,
  tech: [],
  badges: [],
  featured: false,
  priority: 99,
  visibility: 'public',
  visible: true,
  githubUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('mergeProjects', () => {
  it('returns github repos unchanged when no override exists', () => {
    const result = mergeProjects([githubRepo], [])
    expect(result).toHaveLength(1)
    expect(result[0].description).toBe('original github description')
  })

  it('applies DB override fields on top of github data', () => {
    const override = { ...baseOverride, name: 'Applify AI', description: 'curated description', tech: ['Prisma', 'Neon'] }
    const [merged] = mergeProjects([githubRepo], [override])
    expect(merged.name).toBe('Applify AI')
    expect(merged.description).toBe('curated description')
    expect(merged.tech).toEqual(['Prisma', 'Neon'])
  })

  it('preserves github fields when override field is null', () => {
    const override = { ...baseOverride, description: 'curated' }
    const [merged] = mergeProjects([githubRepo], [override])
    expect(merged.description).toBe('curated')
    expect(merged.name).toBe('Applify Ai') // unchanged from github
    expect(merged.tech).toEqual(['TypeScript', 'Nextjs']) // override.tech is []
  })

  it('hides github repos when override.visible is false', () => {
    const override = { ...baseOverride, visible: false }
    const result = mergeProjects([githubRepo], [override])
    expect(result).toHaveLength(0)
  })

  it('keeps github repos without override visible by default', () => {
    const result = mergeProjects([githubRepo], [])
    expect(result).toHaveLength(1)
  })

  it('includes CUSTOM entries not present in github fetch', () => {
    const custom: ProjectEntryRow = {
      ...baseOverride,
      id: 'c1',
      slug: 'skomp-studio',
      source: 'CUSTOM',
      githubSlug: null,
      name: 'Skomp Studio',
      description: 'Multi-tenant Pilates SaaS',
      linkHref: 'https://skomp.studio',
      linkLabel: 'skomp.studio',
      tech: ['Next.js', 'Prisma', 'Square'],
      featured: true,
      priority: 1,
    }
    const result = mergeProjects([], [custom])
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Skomp Studio')
    expect(result[0].source).toBe('custom')
    expect(result[0].link.href).toBe('https://skomp.studio')
  })

  it('custom entries with visible=false are excluded', () => {
    const custom: ProjectEntryRow = {
      ...baseOverride,
      slug: 'hidden-custom',
      source: 'CUSTOM',
      githubSlug: null,
      name: 'Hidden',
      visible: false,
    }
    const result = mergeProjects([], [custom])
    expect(result).toHaveLength(0)
  })

  it('sorts featured first, then by priority ascending, then by most recent', () => {
    const repo2: GithubRepo = { ...githubRepo, slug: 'repo2', githubSlug: 'kianis4/repo2', updatedAt: '2026-04-01T00:00:00Z' }
    const repo3: GithubRepo = { ...githubRepo, slug: 'repo3', githubSlug: 'kianis4/repo3', updatedAt: '2026-04-19T00:00:00Z' }

    const featured: ProjectEntryRow = {
      ...baseOverride,
      id: 'f',
      slug: 'featured-repo',
      source: 'CUSTOM',
      githubSlug: null,
      name: 'Featured',
      featured: true,
      priority: 2,
    }
    const pinned: ProjectEntryRow = {
      ...baseOverride,
      id: 'p',
      slug: 'pinned-repo',
      source: 'CUSTOM',
      githubSlug: null,
      name: 'Pinned',
      featured: true,
      priority: 1,
    }

    const result = mergeProjects([repo2, repo3], [featured, pinned])
    expect(result.map((r) => r.slug)).toEqual([
      'pinned-repo',   // featured + priority 1
      'featured-repo', // featured + priority 2
      'repo3',         // not featured, latest updatedAt
      'repo2',         // not featured, older
    ])
  })

  it('uses githubSlug to match case-insensitively', () => {
    const override = { ...baseOverride, githubSlug: 'Kianis4/Applify-AI' }
    const [merged] = mergeProjects([githubRepo], [override])
    expect(merged.slug).toBe('applify-ai')
  })

  it('renders an orphan GITHUB override (repo not in live fetch) using its own data', () => {
    const override: ProjectEntryRow = {
      ...baseOverride,
      id: 'orphan',
      slug: 'applify-ai',
      source: 'GITHUB',
      githubSlug: 'kianis4/applify-ai',
      name: 'Applify AI',
      description: 'Production SaaS for AI resume tailoring',
      linkHref: 'https://applify-ai.com',
      linkLabel: 'applify-ai.com',
      tech: ['Next.js', 'Prisma'],
      featured: true,
      priority: 1,
    }
    // No matching repo in the github fetch (repo is private) — override should still render
    const result = mergeProjects([], [override])
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Applify AI')
    expect(result[0].featured).toBe(true)
    expect(result[0].link.href).toBe('https://applify-ai.com')
  })

  it('dedupes when a GitHub repo and a CUSTOM entry share the same slug (custom wins)', () => {
    const repo: GithubRepo = { ...githubRepo, slug: 'evergreen-renos', githubSlug: 'kianis4/evergreen-renos', name: 'Evergreen Renos' }
    const custom: ProjectEntryRow = {
      ...baseOverride,
      id: 'c-evergreen',
      slug: 'evergreen-renos',
      source: 'CUSTOM',
      githubSlug: null,
      name: 'Evergreen Renos',
      description: 'curated custom description',
    }
    const result = mergeProjects([repo], [custom])
    expect(result).toHaveLength(1)
    expect(result[0].source).toBe('custom')
    expect(result[0].description).toBe('curated custom description')
  })

  it('handles string dates from cache (not just Date objects)', () => {
    const custom = {
      ...baseOverride,
      slug: 'custom-with-string-date',
      source: 'CUSTOM' as const,
      githubSlug: null,
      name: 'Str Date',
      // Simulate what unstable_cache returns after JSON serialization:
      createdAt: '2026-04-01T00:00:00.000Z' as unknown as Date,
      updatedAt: '2026-04-18T00:00:00.000Z' as unknown as Date,
    }
    const result = mergeProjects([], [custom])
    expect(result).toHaveLength(1)
    expect(result[0].updatedAt).toBe('2026-04-18T00:00:00.000Z')
  })
})
