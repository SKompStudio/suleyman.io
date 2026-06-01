'use client'

import type {
  ContributionSummary,
  LeetcodeSummary,
  TerminalCommit,
  TerminalProject,
} from './types'

// Client fetchers → the cached API routes. Each is memoized for the lifetime of
// the engine so repeated commands don't re-hit the network. The token stays
// server-side; these only ever see public-safe JSON.

function memo<T>(fn: () => Promise<T>): () => Promise<T> {
  let p: Promise<T> | null = null
  return () => {
    if (!p) p = fn()
    return p
  }
}

export const fetchProjects = memo(async (): Promise<TerminalProject[]> => {
  const res = await fetch('/api/terminal/projects')
  if (!res.ok) throw new Error('projects')
  const data = await res.json()
  return data.projects ?? []
})

export const fetchLangs = memo(
  async (): Promise<{ langs: { language: string; repoCount: number; bytes: number }[]; totalRepos: number }> => {
    const res = await fetch('/api/terminal/langs')
    if (!res.ok) throw new Error('langs')
    const data = await res.json()
    return { langs: data.langs ?? [], totalRepos: data.totalRepos ?? 0 }
  }
)

export const fetchCommits = memo(async (): Promise<TerminalCommit[]> => {
  const res = await fetch('/api/git-log')
  if (!res.ok) throw new Error('commits')
  const data = await res.json()
  return data.commits ?? []
})

interface ContribDay {
  date: string
  count: number
}

function computeStreaks(days: ContribDay[]): {
  currentStreak: number
  longestStreak: number
  lastActive: string
} {
  let longest = 0
  let run = 0
  for (const d of days) {
    if (d.count > 0) {
      run += 1
      longest = Math.max(longest, run)
    } else {
      run = 0
    }
  }
  // current streak: walk from the most recent day backward
  let current = 0
  let lastActive = '—'
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) {
      if (current === 0) lastActive = days[i].date
      current += 1
    } else if (current > 0) {
      break
    } else {
      // allow today to be empty without breaking the streak start
      continue
    }
  }
  return { currentStreak: current, longestStreak: longest, lastActive }
}

export const fetchContributions = memo(async (): Promise<ContributionSummary> => {
  const res = await fetch('/api/github-contributions')
  if (!res.ok) throw new Error('contributions')
  const data = await res.json()
  const days: ContribDay[] = data.days ?? []
  const { currentStreak, longestStreak, lastActive } = computeStreaks(days)
  return {
    total: data.total ?? 0,
    currentStreak,
    longestStreak,
    lastActive: lastActive === '—' ? '—' : relativeDate(lastActive),
  }
})

function relativeDate(iso: string): string {
  const then = new Date(iso + 'T00:00:00').getTime()
  const days = Math.floor((Date.now() - then) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days}d ago`
}

export const fetchLeetcode = memo(async (): Promise<LeetcodeSummary> => {
  const res = await fetch('/api/leetcode')
  if (!res.ok) throw new Error('leetcode')
  const data = await res.json()
  return {
    totalSolved: data.totalSolved ?? 0,
    easySolved: data.easySolved ?? 0,
    mediumSolved: data.mediumSolved ?? 0,
    hardSolved: data.hardSolved ?? 0,
    ranking: typeof data.ranking === 'number' ? data.ranking : null,
  }
})
