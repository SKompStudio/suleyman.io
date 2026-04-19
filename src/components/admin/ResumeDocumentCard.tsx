'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { ResumeDocument } from '@prisma/client'
import { updateResumeDocument } from '@/app/admin/resume/actions'

export function ResumeDocumentCard({ doc }: { doc: ResumeDocument }) {
  const router = useRouter()
  const [saving, startSaving] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: doc.title ?? 'Resume',
    subtitle: doc.subtitle ?? '',
    summary: doc.summary ?? '',
    location: doc.location ?? '',
    email: doc.email ?? '',
    phone: doc.phone ?? '',
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    startSaving(async () => {
      const res = await updateResumeDocument(form)
      if (res.ok) {
        setFlash('Saved')
        router.refresh()
        setTimeout(() => setFlash(null), 2000)
      } else {
        setError(res.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Document</h2>
        {flash && <span className="text-xs text-teal-600 dark:text-teal-400">{flash}</span>}
      </div>

      {error && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</p>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <Input label="Subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} placeholder="Full-stack builder · Toronto, ON" />
        <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
        <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
      </div>
      <div className="mt-3">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Summary (shown at top of /resume)</label>
        <textarea
          rows={3}
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save document'}
        </button>
      </div>
    </form>
  )
}

function Input({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
      />
    </div>
  )
}
