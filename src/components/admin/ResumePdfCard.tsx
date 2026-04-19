'use client'

import { FormEvent, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { ResumeDocument } from '@prisma/client'
import { uploadResumePdf, removeResumePdf } from '@/app/admin/resume/actions'

export function ResumePdfCard({ doc }: { doc: ResumeDocument }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  async function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const file = inputRef.current?.files?.[0]
    if (!file) return
    setError(null)
    const fd = new FormData()
    fd.set('file', file)
    startTransition(async () => {
      const res = await uploadResumePdf(fd)
      if (res.ok) {
        setFlash('PDF uploaded')
        router.refresh()
        if (inputRef.current) inputRef.current.value = ''
        setTimeout(() => setFlash(null), 2000)
      } else {
        setError(res.error)
      }
    })
  }

  function handleRemove() {
    if (!confirm('Remove the current PDF?')) return
    setError(null)
    startTransition(async () => {
      const res = await removeResumePdf()
      if (res.ok) {
        setFlash('PDF removed')
        router.refresh()
        setTimeout(() => setFlash(null), 2000)
      } else {
        setError(res.error)
      }
    })
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Downloadable PDF</h2>
        {flash && <span className="text-xs text-teal-600 dark:text-teal-400">{flash}</span>}
      </div>
      {error && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</p>}

      {doc.pdfUrl ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{doc.pdfFilename ?? 'resume.pdf'}</div>
            <div className="text-xs text-zinc-500">
              Uploaded {doc.pdfUploadedAt ? new Date(doc.pdfUploadedAt).toLocaleString() : 'recently'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-teal-600 hover:underline dark:text-teal-400">Open</a>
            <button onClick={handleRemove} disabled={pending} className="text-xs font-medium text-red-600 hover:underline dark:text-red-400 disabled:opacity-50">Remove</button>
          </div>
        </div>
      ) : (
        <p className="mb-4 text-sm text-zinc-500">No PDF uploaded. The /resume page will render the structured sections only.</p>
      )}

      <form onSubmit={handleUpload} className="flex items-center gap-3">
        <input ref={inputRef} type="file" accept="application/pdf" className="text-sm text-zinc-600 dark:text-zinc-400" />
        <button type="submit" disabled={pending} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50">
          {pending ? 'Uploading…' : doc.pdfUrl ? 'Replace PDF' : 'Upload PDF'}
        </button>
      </form>
      <p className="mt-2 text-xs text-zinc-500">Max 10 MB · PDF only</p>
    </div>
  )
}
