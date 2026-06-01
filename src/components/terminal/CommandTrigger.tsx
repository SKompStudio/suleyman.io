'use client'

import { useEffect, useState } from 'react'

import {
  detectIsMac,
  hasFinePointer,
  openPalette,
  prefetchEngine,
  registerPrefetch,
} from './useCommandPalette'

// EAGER · the only visible terminal affordance in the initial bundle. A single
// button with a platform-aware label that prefetches the engine on intent
// (hover/focus) and opens the palette on click/tap. No registry, no data.

interface CommandTriggerProps {
  // Allows the dynamic-import prefetch to be wired from the global mount.
  prefetch?: () => void
  className?: string
}

export function CommandTrigger({ prefetch, className }: CommandTriggerProps) {
  // Server renders a neutral label to avoid hydration mismatch; client narrows.
  const [label, setLabel] = useState<'neutral' | 'mac' | 'win' | 'touch'>(
    'neutral'
  )

  useEffect(() => {
    if (prefetch) registerPrefetch(prefetch)
    if (!hasFinePointer()) setLabel('touch')
    else setLabel(detectIsMac() ? 'mac' : 'win')
  }, [prefetch])

  const keycap = label === 'mac' ? '⌘K' : label === 'win' ? 'Ctrl K' : null

  return (
    <button
      type="button"
      onClick={openPalette}
      onPointerEnter={prefetchEngine}
      onFocus={prefetchEngine}
      aria-label="Open command terminal"
      aria-keyshortcuts="Meta+K Control+K"
      title="Command terminal"
      className={
        'group inline-flex h-9 shrink-0 items-center gap-1.5 self-center whitespace-nowrap rounded-md border border-accent/25 bg-ink-surface/70 px-2.5 font-mono text-xs text-ink-muted backdrop-blur transition-colors hover:border-accent/50 hover:text-accent ' +
        (className ?? '')
      }
    >
      <span className="text-accent">▸_</span>
      {keycap ? (
        <kbd className="font-mono text-[11px] text-accent">{keycap}</kbd>
      ) : (
        <span>commands</span>
      )}
    </button>
  )
}
