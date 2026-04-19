import Link from 'next/link'
import { fetchGitHubRepos } from '@/lib/github'
import { getAllProjectEntriesForAdmin } from '@/lib/projects'
import { ProjectsTable } from '@/components/admin/ProjectsTable'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Projects — Admin',
  robots: { index: false, follow: false },
}

export default async function AdminProjectsPage() {
  const [dbEntries, githubRepos] = await Promise.all([
    getAllProjectEntriesForAdmin(),
    fetchGitHubRepos({ limit: 80 }).catch(() => []),
  ])

  const dbByGithubSlug = new Map(
    dbEntries.filter((e) => e.githubSlug).map((e) => [e.githubSlug!.toLowerCase(), e])
  )

  // Rows: DB entries (GITHUB or CUSTOM) + GitHub repos not yet in DB
  const rows = [
    ...dbEntries.map((e) => ({
      kind: 'db' as const,
      entry: e,
      github: e.githubSlug ? githubRepos.find((r) => r.githubSlug.toLowerCase() === e.githubSlug!.toLowerCase()) : undefined,
    })),
    ...githubRepos
      .filter((r) => !dbByGithubSlug.has(r.githubSlug.toLowerCase()))
      .map((r) => ({ kind: 'github-only' as const, github: r })),
  ]

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
              ← Back to dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Projects
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {dbEntries.length} in DB · {githubRepos.length} live from GitHub
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
          >
            + New custom project
          </Link>
        </header>

        <ProjectsTable rows={rows as any} />
      </div>
    </div>
  )
}
