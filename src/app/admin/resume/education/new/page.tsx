import Link from 'next/link'
import { EducationForm } from '@/components/admin/EducationForm'

export const metadata = { title: 'New education — Admin', robots: { index: false, follow: false } }

export default function NewEducationPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link href="/admin/resume" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">← Back to resume</Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">New education</h1>
        </div>
        <EducationForm />
      </div>
    </div>
  )
}
