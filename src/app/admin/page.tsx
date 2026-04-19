import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import { SignOutButton } from '@/components/admin/SignOutButton'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin — suleyman.io',
  robots: { index: false, follow: false },
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  const [postCount, projectCount, mediaCount] = await Promise.all([
    prisma.post.count(),
    prisma.projectEntry.count(),
    prisma.media.count(),
  ])

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Admin dashboard
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Signed in as {session?.user?.email}
            </p>
          </div>
          <SignOutButton />
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/admin/posts"
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-teal-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-teal-600"
          >
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Posts</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{postCount} total</p>
            <p className="mt-3 text-sm text-teal-600 dark:text-teal-400">Manage blog →</p>
          </Link>

          <Link
            href="/admin/projects"
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-teal-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-teal-600"
          >
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Projects</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{projectCount} in DB</p>
            <p className="mt-3 text-sm text-teal-600 dark:text-teal-400">Manage portfolio →</p>
          </Link>

          <Link
            href="/admin/media"
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-teal-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-teal-600"
          >
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Media</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{mediaCount} files</p>
            <p className="mt-3 text-sm text-teal-600 dark:text-teal-400">Browse uploads →</p>
          </Link>
        </section>
      </div>
    </div>
  )
}
