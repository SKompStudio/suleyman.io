'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Thin client enhancer — LAZY boundary #2. Mounts nothing eager; after mount it
// dynamic-imports the interactive HomeTerminal and overlays it on the static
// shell (which it covers via absolute positioning), so first paint is the
// server HTML and the heavy engine arrives deferred. No LCP/CLS impact.
const HomeTerminal = dynamic(() => import('./HomeTerminal'), {
  ssr: false,
  loading: () => null,
})

export function HomeTerminalEnhance() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 bg-ink-surface/30">
      <HomeTerminal />
    </div>
  )
}
