'use client'

import { FormEvent, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { ResumeEducation } from '@prisma/client'
import { upsertEducation, deleteEducation } from '@/app/admin/resume/actions'

export function EducationForm({ initial }: { initial?: ResumeEducation }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    degree: initial?.degree ?? '',
    school: initial?.school ?? '',
    location: initial?.location ?? '',
    startDate: initial?.startDate ?? '',
    endDate: initial?.endDate ?? '',
    details: initial?.details ?? '',
    order: initial?.order ?? 0,
    visible: initial?.visible ?? true,
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const input = {
      degree: form.degree.trim(),
      school: form.school.trim(),
      location: form.location.trim() || null,
      startDate: form.startDate.trim(),
      endDate: form.endDate.trim() || null,
      details: form.details.trim() || null,
      order: Number(form.order) || 0,
      visible: form.visible,
    }
    startTransition(async () => {
      const res = await upsertEducation(input, initial?.id)
      if (res.ok) { router.push('/admin/resume'); router.refresh() } else setError(res.error)
    })
  }

  function handleDelete() {
    if (!initial) return
    if (!confirm(`Delete "${initial.degree} — ${initial.school}"?`)) return
    startTransition(async () => {
      const res = await deleteEducation(initial.id)
      if (res.ok) { router.push('/admin/resume'); router.refresh() } else setError(res.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Degree" required>
          <input required type="text" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} className="input" placeholder="MEng Systems and Technology" />
        </Field>
        <Field label="School" required>
          <input required type="text" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} className="input" placeholder="McMaster University" />
        </Field>
        <Field label="Location">
          <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input" placeholder="Hamilton, ON" />
        </Field>
        <div />
        <Field label="Start date" required>
          <input required type="text" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="input" placeholder="Sep 2025" />
        </Field>
        <Field label="End date">
          <input type="text" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="input" placeholder="Present or May 2027" />
        </Field>
      </div>

      <Field label="Details">
        <textarea rows={3} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className="input" placeholder="Honors, relevant coursework, GPA" />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Order">
          <input type="number" min={0} max={999} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="input" />
        </Field>
        <label className="flex items-end gap-2 text-sm">
          <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} />
          Visible
        </label>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
        {initial ? <button type="button" onClick={handleDelete} disabled={pending} className="text-sm text-red-600 hover:underline dark:text-red-400 disabled:opacity-50">Delete</button> : <span />}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="text-sm text-zinc-600 dark:text-zinc-400 hover:underline">Cancel</button>
          <button type="submit" disabled={pending} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50">
            {pending ? 'Saving…' : initial ? 'Save' : 'Create'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .input { width: 100%; border-radius: 0.375rem; border: 1px solid rgb(212 212 216); background: white; padding: 0.5rem 0.75rem; font-size: 0.875rem; }
        :global(.dark) .input { border-color: rgb(63 63 70); background: rgb(39 39 42); color: rgb(244 244 245); }
        .input:focus { outline: none; border-color: rgb(20 184 166); box-shadow: 0 0 0 1px rgb(20 184 166); }
      `}</style>
    </form>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  )
}
