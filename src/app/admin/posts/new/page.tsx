import Link from 'next/link'
import { PostEditor } from '@/components/admin/PostEditor'

export const metadata = {
  title: 'New post — Admin',
  robots: { index: false, follow: false },
}

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <Link href="/admin/posts" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
            ← Back to posts
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            New post
          </h1>
        </div>
        <PostEditor mode="create" />
      </div>
    </div>
  )
}
