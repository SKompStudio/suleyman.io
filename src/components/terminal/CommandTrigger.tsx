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

  const shortcut =
    label === 'mac' ? (
      <kbd className="font-mono text-[11px] text-accent">⌘K</kbd>
    ) : label === 'win' ? (
      <kbd className="font-mono text-[11px] text-accent">Ctrl K</kbd>
    ) : null

  return (
    <button
      type="button"
      onClick={openPalette}
      onPointerEnter={prefetchEngine}
      onFocus={prefetchEngine}
      aria-label="Open command terminal"
      aria-keyshortcuts="Meta+K Control+K"
      className={
        'group inline-flex min-h-[44px] items-center gap-2 rounded-md border border-accent/25 bg-ink-surface/70 px-3 py-2 font-mono text-xs text-ink-muted backdrop-blur transition-colors hover:border-accent/50 hover:text-accent ' +
        (className ?? '')
      }
    >
      <span className="text-accent">▸</span>
      {label === 'touch' ? (
        <span>tap to run commands</span>
      ) : (
        <span>
          press {shortcut} <span className="text-ink-border">·</span> or tap
        </span>
      )}
    </button>
  )
}
