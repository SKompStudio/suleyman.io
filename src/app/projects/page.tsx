import { ProjectsClient } from './ProjectsClient'
import { getProjectsData } from '@/lib/projects'
import { getLanguageStats } from '@/lib/github'
import { buildMeta } from '@/lib/buildMeta'

export const dynamic = 'force-dynamic'

export const metadata = buildMeta({
  title: 'Projects',
  description: 'Things I’ve made trying to put my dent in the universe.',
  path: '/projects',
})

export default async function Projects() {
  // Real GitHub language footprint feeds the constellation; on any failure
  // (no token, rate limit, API error) it resolves to [] and the constellation
  // falls back to the project-tag derivation so the page never breaks.
  const [projects, languageStats] = await Promise.all([
    getProjectsData(),
    getLanguageStats().catch(() => []),
  ])

  return <ProjectsClient projects={projects} languageStats={languageStats} />
}
