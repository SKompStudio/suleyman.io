'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { ProjectEntry } from '@prisma/client'
import {
  toggleProjectField,
  setProjectPriority,
  upsertGithubOverride,
  deleteProject,
} from '@/app/admin/projects/actions'

type Row =
  | { kind: 'db'; entry: ProjectEntry; github?: { githubSlug: string; name: string; updatedAt: string } }
  | { kind: 'github-only'; github: { githubSlug: string; name: string; updatedAt: string; description: string } }

export function ProjectsTable({ rows }: { rows: Row[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [flash, setFlash] = useState<string | null>(null)

  function handle<T>(promise: Promise<{ ok: boolean; error?: string }>, successMsg: string) {
    startTransition(async () => {
      const res = await promise
      setFlash(res.ok ? successMsg : `Error: ${res.error ?? 'unknown'}`)
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
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Name</th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Source</th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Visible</th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Featured</th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">Priority</th>
            <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-zinc-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {rows.map((row) => {
            if (row.kind === 'github-only') {
              return (
                <tr key={row.github.githubSlug} className="bg-zinc-50/40 dark:bg-zinc-950/30">
                  <td className="px-3 py-2">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{row.github.name}</div>
                    <div className="text-xs text-zinc-500">{row.github.githubSlug}</div>
                  </td>
                  <td className="px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">GitHub (live, no override)</td>
                  <td className="px-3 py-2 text-xs text-zinc-500">auto</td>
                  <td className="px-3 py-2 text-xs text-zinc-500">—</td>
                  <td className="px-3 py-2 text-xs text-zinc-500">99</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      disabled={pending}
                      onClick={() =>
                        handle(upsertGithubOverride(row.github.githubSlug), `Override created for ${row.github.githubSlug}`)
                      }
                      className="text-xs font-medium text-teal-600 hover:underline dark:text-teal-400 disabled:opacity-50"
                    >
                      + Create override
                    </button>
                  </td>
                </tr>
              )
            }

            const e = row.entry
            return (
              <tr key={e.id}>
                <td className="px-3 py-2">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">{e.name ?? row.github?.name ?? e.slug}</div>
                  <div className="text-xs text-zinc-500">{e.githubSlug ?? e.slug}</div>
                </td>
                <td className="px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {e.source === 'GITHUB' ? 'GitHub + override' : 'Custom'}
                </td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={e.visible}
                    disabled={pending}
                    onChange={(ev) =>
                      handle(
                        toggleProjectField({ slug: e.slug, field: 'visible', value: ev.target.checked }),
                        `${e.slug} visible=${ev.target.checked}`
                      )
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={e.featured}
                    disabled={pending}
                    onChange={(ev) =>
                      handle(
                        toggleProjectField({ slug: e.slug, field: 'featured', value: ev.target.checked }),
                        `${e.slug} featured=${ev.target.checked}`
                      )
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    max={999}
                    defaultValue={e.priority}
                    disabled={pending}
                    onBlur={(ev) => {
                      const priority = parseInt(ev.target.value, 10)
                      if (!Number.isNaN(priority) && priority !== e.priority) {
                        handle(setProjectPriority({ slug: e.slug, priority }), `${e.slug} priority=${priority}`)
                      }
                    }}
                    className="w-16 rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                  />
                </td>
                <td className="px-3 py-2 text-right space-x-3">
                  <Link
                    href={`/admin/projects/${e.slug}`}
                    className="text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
                  >
                    Edit
                  </Link>
                  <button
                    disabled={pending}
                    onClick={() => {
                      if (confirm(`Delete ${e.slug}?`)) {
                        handle(deleteProject(e.slug), `${e.slug} deleted`)
                      }
                    }}
                    className="text-xs font-medium text-red-600 hover:underline dark:text-red-400 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
