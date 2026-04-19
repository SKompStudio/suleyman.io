'use client'

import Image from 'next/image'
import { useState } from 'react'

type Media = {
  id: string
  url: string
  pathname: string
  contentType: string
  size: number
  uploadedAt: string
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

export function MediaList({ media }: { media: Media[] }) {
  const [copied, setCopied] = useState<string | null>(null)

  if (media.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
        No uploads yet. Upload an image from the Project or Post editor to see it here.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {media.map((m) => (
        <div key={m.id} className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="relative aspect-square overflow-hidden rounded-md bg-zinc-50 dark:bg-zinc-950">
            {m.contentType.startsWith('image/') ? (
              <Image src={m.url} alt={m.pathname} fill className="object-contain" unoptimized />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                {m.contentType}
              </div>
            )}
          </div>
          <div className="mt-2 truncate text-xs font-medium text-zinc-900 dark:text-zinc-100" title={m.pathname}>
            {m.pathname.split('/').pop()}
          </div>
          <div className="mt-0.5 text-xs text-zinc-500">
            {formatBytes(m.size)} · {new Date(m.uploadedAt).toLocaleDateString()}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(m.url)
              setCopied(m.id)
              setTimeout(() => setCopied(null), 1500)
            }}
            className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            {copied === m.id ? 'Copied!' : 'Copy URL'}
          </button>
        </div>
      ))}
    </div>
  )
}
