import Link from 'next/link'
import { getAllSettings } from '@/lib/siteSettings'
import { SettingsForm } from '@/components/admin/SettingsForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Settings — Admin',
  robots: { index: false, follow: false },
}

export default async function AdminSettingsPage() {
  const settings = await getAllSettings()

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <Link href="/admin" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Site settings
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Homepage hero and social links. Blank fields fall back to built-in defaults.
          </p>
        </header>

        <SettingsForm initial={settings} />
      </div>
    </div>
  )
}
