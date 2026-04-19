import type { ReactNode } from 'react'
import { SessionProvider } from '@/components/admin/SessionProvider'

export const metadata = {
  title: 'Admin — suleyman.io',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
