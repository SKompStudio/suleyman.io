'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Thin client enhancer — LAZY boundary #2. Renders the static, LCP-safe skeleton
// on the server / before mount, then dynamic-imports the interactive engine and
// SWAPS it in place (normal flow, not an overlay). One opaque layer at a time:
// the box grows to fit the live output up to its max-height, then scrolls — no
// translucent ghosting, no absolute pinning. The heavy engine still arrives
// deferred (ssr:false), so first paint is the server HTML. No LCP/CLS impact.
const HomeTerminal = dynamic(() => import('./HomeTerminal'), {
  ssr: false,
  loading: () => null,
})

export function HomeTerminalEnhance() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="font-mono text-xs" aria-hidden="true">
        <p className="whitespace-pre-wrap text-accent">
          suleyman.io ▸ operator console. type &apos;help&apos;, or start typing.
        </p>
        <p className="mt-2 text-ink-muted">
          <span className="text-accent">▸</span>{' '}
          <span className="animate-caret-blink motion-reduce:animate-none text-accent">
            █
          </span>
        </p>
      </div>
    )
  }

  return <HomeTerminal />
}
