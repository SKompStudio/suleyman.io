import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PostsTable } from '@/components/admin/PostsTable'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Posts — Admin',
  robots: { index: false, follow: false },
}

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      publishedAt: true,
      scheduledAt: true,
      updatedAt: true,
      tags: true,
    },
  })

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
              ← Back to dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Posts
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {posts.length} total
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
          >
            + New post
          </Link>
        </header>

        <PostsTable posts={posts as any} />
      </div>
    </div>
  )
}
