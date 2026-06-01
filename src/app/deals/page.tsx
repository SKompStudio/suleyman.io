import { Metadata } from 'next'
import DealsClient from './DealsClient'

export const metadata: Metadata = {
  title: 'Deals',
  description: 'Private deal-management workspace (disabled demo).',
  robots: { index: false, follow: false },
}

export default function DealsPage() {
  return <DealsClient />
}
