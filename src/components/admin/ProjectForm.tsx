'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProjectEntry } from '@prisma/client'
import { upsertProject } from '@/app/admin/projects/actions'

type Props = {
  initial?: Partial<ProjectEntry>
  mode: 'create' | 'edit'
}

export function ProjectForm({ initial, mode }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    slug: initial?.slug ?? '',
    source: (initial?.source ?? 'CUSTOM') as 'GITHUB' | 'CUSTOM',
    githubSlug: initial?.githubSlug ?? '',
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    linkHref: initial?.linkHref ?? '',
    linkLabel: initial?.linkLabel ?? '',
    githubUrl: initial?.githubUrl ?? '',
    logoSrc: initial?.logoSrc ?? '',
    logoType: (initial?.logoType ?? 'image') as 'image' | 'icon',
    logoIconName: initial?.logoIconName ?? '',
    logoClassName: initial?.logoClassName ?? '',
    timeframe: initial?.timeframe ?? '',
    tech: (initial?.tech ?? []).join(', '),
    badges: (initial?.badges ?? []).join(', '),
    featured: initial?.featured ?? false,
    priority: initial?.priority ?? 99,
    visibility: (initial?.visibility ?? 'public') as 'public' | 'private',
    visible: initial?.visible ?? true,
  })

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleLogoUpload(file: File) {
    setUploading(true)
    try {
      const res = await fetch(`/api/admin/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      })
      if (!res.ok) throw new Error(`upload failed: ${res.status}`)
      const { url } = (await res.json()) as { url: string }
      update('logoSrc', url)
      update('logoType', 'image')
    } catch (err: any) {
      setError(err.message ?? 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const input = {
      slug: form.slug.trim(),
      source: form.source,
      githubSlug: form.githubSlug.trim() || null,
      name: form.name.trim() || null,
      description: form.description.trim() || null,
      linkHref: form.linkHref.trim() || null,
      linkLabel: form.linkLabel.trim() || null,
      githubUrl: form.githubUrl.trim() || null,
      logoSrc: form.logoSrc.trim() || null,
      logoType: form.logoType,
      logoIconName: form.logoIconName.trim() || null,
      logoClassName: form.logoClassName.trim() || null,
      timeframe: form.timeframe.trim() || null,
      tech: form.tech.split(',').map((t) => t.trim()).filter(Boolean),
      badges: form.badges.split(',').map((t) => t.trim()).filter(Boolean),
      featured: form.featured,
      priority: Number(form.priority),
      visibility: form.visibility,
      visible: form.visible,
    }

    const res = await upsertProject(input)
    setSaving(false)

    if (!res.ok) {
      setError(res.error)
      return
    }

    router.push('/admin/projects')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Slug (URL-safe)" required>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => update('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
            disabled={mode === 'edit'}
            className="input"
          />
        </Field>

        <Field label="Source">
          <select value={form.source} onChange={(e) => update('source', e.target.value as any)} className="input">
            <option value="CUSTOM">Custom (not a GitHub repo)</option>
            <option value="GITHUB">GitHub (override + live data)</option>
          </select>
        </Field>

        {form.source === 'GITHUB' && (
          <Field label="GitHub slug (owner/repo)" required>
            <input type="text" required value={form.githubSlug} onChange={(e) => update('githubSlug', e.target.value)} className="input" />
          </Field>
        )}

        <Field label="Name (display)">
          <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} className="input" />
        </Field>
      </div>

      <Field label="Description">
        <textarea rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} className="input" />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Link href (live URL)">
          <input type="url" value={form.linkHref} onChange={(e) => update('linkHref', e.target.value)} placeholder="https://..." className="input" />
        </Field>
        <Field label="Link label">
          <input type="text" value={form.linkLabel} onChange={(e) => update('linkLabel', e.target.value)} className="input" />
        </Field>
      </div>

      <Field label="GitHub URL (optional, for private repos)">
        <input type="url" value={form.githubUrl} onChange={(e) => update('githubUrl', e.target.value)} placeholder="https://github.com/..." className="input" />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Timeframe">
          <input type="text" placeholder="Feb 2025 - Present" value={form.timeframe} onChange={(e) => update('timeframe', e.target.value)} className="input" />
        </Field>
        <Field label="Priority (lower = higher in list)">
          <input type="number" min={0} max={999} value={form.priority} onChange={(e) => update('priority', Number(e.target.value))} className="input" />
        </Field>
      </div>

      <Field label="Tech (comma-separated)">
        <input type="text" value={form.tech} onChange={(e) => update('tech', e.target.value)} placeholder="Next.js, Prisma, Postgres" className="input" />
      </Field>
      <Field label="Badges (comma-separated)">
        <input type="text" value={form.badges} onChange={(e) => update('badges', e.target.value)} placeholder="Production, SaaS" className="input" />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Logo type">
          <select value={form.logoType} onChange={(e) => update('logoType', e.target.value as any)} className="input">
            <option value="image">Image (Blob URL or /path)</option>
            <option value="icon">Icon name</option>
          </select>
        </Field>
        {form.logoType === 'image' ? (
          <Field label="Logo image">
            <div className="flex gap-2">
              <input type="text" value={form.logoSrc} onChange={(e) => update('logoSrc', e.target.value)} placeholder="/ApplifyLogo.svg or https://blob..." className="input flex-1" />
              <label className="cursor-pointer rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                {uploading ? 'Uploading…' : 'Upload'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                />
              </label>
            </div>
          </Field>
        ) : (
          <Field label="Icon name + class">
            <div className="flex gap-2">
              <input type="text" value={form.logoIconName} onChange={(e) => update('logoIconName', e.target.value)} placeholder="django / react / ai" className="input flex-1" />
              <input type="text" value={form.logoClassName} onChange={(e) => update('logoClassName', e.target.value)} placeholder="text-green-700" className="input flex-1" />
            </div>
          </Field>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.visible} onChange={(e) => update('visible', e.target.checked)} />
          Visible on portfolio
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} />
          Featured
        </label>
        <Field label="Visibility badge">
          <select value={form.visibility} onChange={(e) => update('visibility', e.target.value as any)} className="input">
            <option value="public">Public</option>
            <option value="private">Private (repo)</option>
          </select>
        </Field>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <button type="button" onClick={() => router.back()} className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 disabled:opacity-50">
          {saving ? 'Saving…' : mode === 'create' ? 'Create project' : 'Save changes'}
        </button>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid rgb(212 212 216);
          background: white;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
        :global(.dark) .input {
          border-color: rgb(63 63 70);
          background: rgb(39 39 42);
          color: rgb(244 244 245);
        }
        .input:focus {
          outline: none;
          border-color: rgb(20 184 166);
          box-shadow: 0 0 0 1px rgb(20 184 166);
        }
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
