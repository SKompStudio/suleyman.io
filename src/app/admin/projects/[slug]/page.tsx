import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { getProjectEntryBySlug } from '@/lib/projects'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Edit project — Admin',
  robots: { index: false, follow: false },
}

type Params = Promise<{ slug: string }>

export default async function EditProjectPage({ params }: { params: Params }) {
  const { slug } = await params
  const entry = await getProjectEntryBySlug(slug)
  if (!entry) notFound()

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link href="/admin/projects" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
            ← Back to projects
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Edit {entry.name ?? entry.slug}
          </h1>
        </div>
        <ProjectForm mode="edit" initial={entry} />
      </div>
    </div>
  )
}
