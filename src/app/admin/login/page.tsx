import { Suspense } from 'react'
import { LoginForm } from '@/components/admin/LoginForm'

export const metadata = {
  title: 'Admin Login — suleyman.io',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            This area is restricted.
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
