'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setPostStatus, deletePost } from '@/app/admin/posts/actions'

type Post = {
  id: string
  slug: string
  title: string
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'
  publishedAt: string | null
  scheduledAt: string | null
  updatedAt: string
  tags: string[]
}

const STATUS_STYLES: Record<Post['status'], string> = {
  DRAFT: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  SCHEDULED: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  PUBLISHED: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  ARCHIVED: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-500',
}

export function PostsTable({ posts }: { posts: Post[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [flash, setFlash] = useState<string | null>(null)

  function run(promise: Promise<{ ok: boolean; error?: string }>, msg: string) {
    startTransition(async () => {
      const res = await promise
      setFlash(res.ok ? msg : `Error: ${res.error ?? 'unknown'}`)
      router.refresh()
      setTimeout(() => setFlash(null), 2500)
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {flash && (
        <div className="border-b border-zinc-200 bg-teal-50 px-4 py-2 text-sm text-teal-800 dark:border-zinc-800 dark:bg-teal-900/20 dark:text-teal-300">
          {flash}
        </div>
      )}
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
        <thead className="bg-zinc-50 dark:bg-zinc-950/50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Title</th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Status</th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Published</th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Updated</th>
            <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-zinc-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {posts.map((p) => (
            <tr key={p.id}>
              <td className="px-3 py-2">
                <div className="font-medium text-zinc-900 dark:text-zinc-100">{p.title || p.slug}</div>
                <div className="text-xs text-zinc-500">/articles/{p.slug}</div>
              </td>
              <td className="px-3 py-2">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[p.status]}`}>
                  {p.status}
                </span>
              </td>
              <td className="px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400">
                {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : '—'}
              </td>
              <td className="px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400">
                {new Date(p.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-3 py-2 text-right space-x-2">
                <Link href={`/admin/posts/${p.id}`} className="text-xs font-medium text-teal-600 hover:underline dark:text-teal-400">
                  Edit
                </Link>
                {p.status !== 'PUBLISHED' && (
                  <button
                    disabled={pending}
                    onClick={() => run(setPostStatus({ slug: p.slug, status: 'PUBLISHED' }), `${p.slug} published`)}
                    className="text-xs font-medium text-teal-600 hover:underline dark:text-teal-400 disabled:opacity-50"
                  >
                    Publish
                  </button>
                )}
                {p.status === 'PUBLISHED' && (
                  <button
                    disabled={pending}
                    onClick={() => run(setPostStatus({ slug: p.slug, status: 'DRAFT' }), `${p.slug} unpublished`)}
                    className="text-xs font-medium text-amber-600 hover:underline dark:text-amber-400 disabled:opacity-50"
                  >
                    Unpublish
                  </button>
                )}
                <button
                  disabled={pending}
                  onClick={() => {
                    if (confirm(`Delete "${p.title || p.slug}"?`)) {
                      run(deletePost(p.slug), `${p.slug} deleted`)
                    }
                  }}
                  className="text-xs font-medium text-red-600 hover:underline dark:text-red-400 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
