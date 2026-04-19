import { prisma } from '@/lib/prisma'
import { fetchGitHubRepos, type NormalizedRepo } from './github'
import { mergeProjects, type MergedProject } from './mergeProjects'

const INCLUDE_PRIVATE_REPOS =
  (process.env.GITHUB_INCLUDE_PRIVATE || process.env.NEXT_PUBLIC_GITHUB_INCLUDE_PRIVATE || '').toLowerCase() ===
  'true'

export type Project = MergedProject

export async function getProjectsData(): Promise<Project[]> {
  let githubProjects: NormalizedRepo[] = []

  try {
    githubProjects = await fetchGitHubRepos({
      limit: 80,
      includePrivate: INCLUDE_PRIVATE_REPOS,
    })
  } catch (error: any) {
    console.warn('[projects] GitHub fetch failed:', error.message)
    if (INCLUDE_PRIVATE_REPOS) {
      try {
        githubProjects = await fetchGitHubRepos({ limit: 80, includePrivate: false })
      } catch {
        githubProjects = []
      }
    } else {
      githubProjects = []
    }
  }

  const dbEntries = await prisma.projectEntry.findMany()
  return mergeProjects(githubProjects as any, dbEntries)
}

export async function getAllProjectEntriesForAdmin() {
  return prisma.projectEntry.findMany({
    orderBy: [{ featured: 'desc' }, { priority: 'asc' }, { updatedAt: 'desc' }],
  })
}

export async function getProjectEntryBySlug(slug: string) {
  return prisma.projectEntry.findUnique({ where: { slug } })
}
