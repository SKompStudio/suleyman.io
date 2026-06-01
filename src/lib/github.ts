import { slugify } from './slugify'

const GITHUB_USERNAME =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME || process.env.GITHUB_USERNAME || 'kianis4'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN || ''
const DEFAULT_LIMIT = 40

// Orgs whose repos count toward the language footprint alongside the user's own.
// Aggregated server-side; only rolled-up language totals (never repo names) reach
// the client, so private repos under these owners stay private.
const GITHUB_ORGS = ['SKompStudio', 'E-S-Solutions', 'CAS735-F25']

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  private: boolean
  fork: boolean
  archived: boolean
  updated_at: string
  pushed_at: string
  created_at: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  watchers_count: number
  topics: string[]
  homepage: string | null
  default_branch: string
  language: string | null
}

export interface NormalizedRepo {
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

interface FetchOptions {
  limit?: number
  includeForks?: boolean
  includePrivate?: boolean
}

export async function fetchGitHubRepos({
  limit = DEFAULT_LIMIT,
  includeForks = false,
  includePrivate = false,
}: FetchOptions = {}): Promise<NormalizedRepo[]> {
  const baseUrl = includePrivate
    ? 'https://api.github.com/installation/repositories'
    : `https://api.github.com/users/${GITHUB_USERNAME}/repos`
  const url = new URL(baseUrl)
  url.searchParams.set('per_page', '100')
  if (!includePrivate) {
    url.searchParams.set('sort', 'updated')
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
  }

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`
  } else if (includePrivate) {
    throw new Error('GITHUB_TOKEN is required to include private repositories')
  }

  const response = await fetch(url.toString(), { headers })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(`GitHub API error: ${response.status} ${payload.message || ''}`.trim())
  }

  const payload = await response.json()
  const repos: GitHubRepo[] = includePrivate ? payload.repositories || [] : payload

  const filtered = repos
    .filter((repo) => includePrivate || !repo.private)
    .filter((repo) => includeForks || !repo.fork)
    .filter((repo) => !repo.archived)
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())

  return filtered.slice(0, limit).map(normalizeRepo)
}

function normalizeRepo(repo: GitHubRepo): NormalizedRepo {
  return {
    id: repo.id,
    slug: slugify(repo.name),
    githubSlug: repo.full_name.toLowerCase(),
    name: prettifyName(repo.name),
    description:
      repo.description ||
      'Open-source project currently being documented. Check back soon for more details.',
    link: deriveLink(repo),
    github: repo.html_url,
    logo: null,
    timeframe: `Updated ${formatMonthYear(repo.pushed_at)}`,
    tech: buildTechList(repo),
    featured: false,
    priority: 99,
    badges: ['Open Source'],
    source: 'github',
    visibility: repo.private ? 'private' : 'public',
    stats: {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
      watchers: repo.watchers_count,
    },
    updatedAt: repo.pushed_at,
    createdAt: repo.created_at,
    topics: repo.topics || [],
    homepage: repo.homepage,
    defaultBranch: repo.default_branch,
  }
}

function prettifyName(name: string = ''): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim()
}

function deriveLink(repo: GitHubRepo): { href: string; label: string } {
  if (repo.homepage) {
    try {
      const url = new URL(repo.homepage)
      return { href: repo.homepage, label: url.host }
    } catch (e) {
      return { href: repo.html_url, label: repo.full_name }
    }
  }

  return { href: repo.html_url, label: repo.full_name }
}

function buildTechList(repo: GitHubRepo): string[] {
  const tags = new Set<string>()

  if (repo.language) {
    tags.add(repo.language)
  }

  if (Array.isArray(repo.topics)) {
    repo.topics.forEach((topic) => {
      if (topic) {
        tags.add(formatTag(topic))
      }
    })
  }

  return Array.from(tags)
}

function formatTag(tag: string): string {
  return tag
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatMonthYear(dateString: string): string {
  if (!dateString) return 'Recently updated'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

// ── Language footprint (the Tech Constellation data source) ──────────────────
//
// Aggregates Linguist language data across the user's non-fork, non-archived
// repos plus the GITHUB_ORGS, using one paginated GraphQL query per owner.
// Private repos ARE counted in the aggregate, but only the rolled-up
// { language, repoCount, bytes } array crosses to the client — repo names never
// leave the server. With a `repo`+`read:org` token this reproduces the full
// 91-repo footprint; with a public-only token it lands on the ~40-repo public set.

export interface LanguageStat {
  language: string // GitHub's canonical Linguist name, e.g. "TypeScript"
  repoCount: number // # repos whose /languages map contains this language
  bytes: number // summed bytes across those repos (secondary weight)
}

const GITHUB_GRAPHQL = 'https://api.github.com/graphql'

interface LangEdge {
  size: number
  node: { name: string }
}
interface RepoNode {
  name: string
  isArchived: boolean
  isFork: boolean
  languages: { edges: LangEdge[] }
}
interface RepoConnection {
  pageInfo: { hasNextPage: boolean; endCursor: string | null }
  nodes: RepoNode[]
}

const VIEWER_QUERY = `
query($cursor: String) {
  viewer {
    repositories(first: 50, after: $cursor, ownerAffiliations: [OWNER], isFork: false) {
      pageInfo { hasNextPage endCursor }
      nodes {
        name isArchived isFork
        languages(first: 50) { edges { size node { name } } }
      }
    }
  }
}`

const ORG_QUERY = `
query($login: String!, $cursor: String) {
  organization(login: $login) {
    repositories(first: 50, after: $cursor, ownerAffiliations: [OWNER], isFork: false) {
      pageInfo { hasNextPage endCursor }
      nodes {
        name isArchived isFork
        languages(first: 50) { edges { size node { name } } }
      }
    }
  }
}`

async function graphql(query: string, variables: Record<string, unknown>): Promise<any> {
  const res = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
    // Language footprint changes slowly and this is N paginated calls; cache at
    // the fetch layer (matching spotify.ts) so visitors never trigger a GitHub
    // call even though the page is force-dynamic. Tag allows future revalidation.
    next: { revalidate: 21600, tags: ['github-languages'] },
  })
  if (!res.ok) {
    throw new Error(`GitHub GraphQL error: ${res.status}`)
  }
  const json = await res.json()
  if (json.errors) {
    throw new Error(`GitHub GraphQL error: ${JSON.stringify(json.errors).slice(0, 200)}`)
  }
  return json.data
}

async function collectOwnerRepos(
  query: string,
  baseVars: Record<string, unknown>,
  pick: (data: any) => RepoConnection | null | undefined
): Promise<RepoNode[]> {
  const out: RepoNode[] = []
  let cursor: string | null = null
  // Bounded loop; 50/page against ~83 repos is at most a couple of pages.
  for (let page = 0; page < 20; page++) {
    const data = await graphql(query, { ...baseVars, cursor })
    const conn = pick(data)
    if (!conn) break
    out.push(...conn.nodes)
    if (!conn.pageInfo.hasNextPage) break
    cursor = conn.pageInfo.endCursor
    if (!cursor) break
  }
  return out
}

export async function getLanguageStats(
  opts: { topN?: number; minRepos?: number } = {}
): Promise<LanguageStat[]> {
  const topN = opts.topN ?? 24
  const minRepos = opts.minRepos ?? 1

  if (!GITHUB_TOKEN) {
    // GraphQL requires auth; without a token return empty so the constellation
    // gracefully falls back to the project-tag derivation.
    throw new Error('GITHUB_TOKEN is required for GraphQL language stats')
  }

  const ownerFetches: Promise<RepoNode[]>[] = [
    collectOwnerRepos(VIEWER_QUERY, {}, (d) => d?.viewer?.repositories),
    ...GITHUB_ORGS.map((login) =>
      collectOwnerRepos(ORG_QUERY, { login }, (d) => d?.organization?.repositories)
    ),
  ]

  // Tolerate a single org going missing/inaccessible without failing the whole
  // footprint — the user's own repos are the dominant signal.
  const settled = await Promise.allSettled(ownerFetches)
  const repos: RepoNode[] = settled
    .filter((r): r is PromiseFulfilledResult<RepoNode[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .filter((repo) => !repo.isArchived && !repo.isFork)

  const byLang = new Map<string, { repoCount: number; bytes: number }>()
  for (const repo of repos) {
    const seen = new Set<string>()
    for (const edge of repo.languages?.edges ?? []) {
      const name = edge.node?.name
      if (!name) continue
      const cur = byLang.get(name) ?? { repoCount: 0, bytes: 0 }
      cur.bytes += edge.size || 0
      if (!seen.has(name)) {
        cur.repoCount += 1
        seen.add(name)
      }
      byLang.set(name, cur)
    }
  }

  return Array.from(byLang.entries())
    .map(([language, v]) => ({ language, repoCount: v.repoCount, bytes: v.bytes }))
    .filter((s) => s.repoCount >= minRepos)
    .sort((a, b) => b.bytes - a.bytes || b.repoCount - a.repoCount)
    .slice(0, topN)
}

// ── Recent public commits (the `git log` terminal command) ───────────────────
//
// Reads the user's public PushEvents (no token required, but we send the token
// when present to raise the rate limit), flattens payload.commits[], and
// returns the newest few with a 7-char sha, first-line message, repo name, and
// a relative age. Server-side only; cached at the fetch layer.

export interface RecentCommit {
  sha7: string
  message: string
  repo: string
  ageRelative: string
}

function relativeAge(iso: string): string {
  const then = new Date(iso).getTime()
  const secs = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (secs < 60) return `${secs}s ago`
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

export async function fetchRecentCommits(limit = 8): Promise<RecentCommit[]> {
  // With a token, the authenticated events feed surfaces the user's own
  // private-repo PushEvents (most recent commits are to private repos like
  // skomp-studio). Without one, only the public feed is available.
  const path = GITHUB_TOKEN ? 'events' : 'events/public'
  const url = `https://api.github.com/users/${GITHUB_USERNAME}/${path}?per_page=100`
  const headers: HeadersInit = { Accept: 'application/vnd.github+json' }
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`

  const res = await fetch(url, {
    headers,
    next: { revalidate: 900, tags: ['github-events'] },
  })
  if (!res.ok) throw new Error(`GitHub events error: ${res.status}`)

  const events = (await res.json()) as Array<{
    type: string
    created_at: string
    repo: { name: string }
    payload: { commits?: Array<{ sha: string; message: string }> }
  }>

  const out: RecentCommit[] = []
  for (const ev of events) {
    if (ev.type !== 'PushEvent') continue
    const repo = ev.repo.name.split('/').pop() || ev.repo.name
    // newest commit in a push is last; walk in reverse for recency.
    for (const c of (ev.payload.commits ?? []).slice().reverse()) {
      out.push({
        sha7: c.sha.slice(0, 7),
        message: (c.message || '').split('\n')[0],
        repo,
        ageRelative: relativeAge(ev.created_at),
      })
      if (out.length >= limit) return out
    }
  }
  return out
}
