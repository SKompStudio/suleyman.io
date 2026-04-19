import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PostEditor } from '@/components/admin/PostEditor'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Edit post — Admin',
  robots: { index: false, follow: false },
}

type Params = Promise<{ id: string }>

export default async function EditPostPage({ params }: { params: Params }) {
  const { id } = await params
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <Link href="/admin/posts" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
            ← Back to posts
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Edit: {post.title || post.slug}
          </h1>
        </div>
        <PostEditor mode="edit" initial={post} />
      </div>
    </div>
  )
}
