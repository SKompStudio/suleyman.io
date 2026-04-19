import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { MediaList } from '@/components/admin/MediaList'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Media — Admin',
  robots: { index: false, follow: false },
}

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { uploadedAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <Link href="/admin" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Media library
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {media.length} files · uploads go to Vercel Blob via /api/admin/upload
          </p>
        </div>

        <MediaList media={media as any} />
      </div>
    </div>
  )
}
