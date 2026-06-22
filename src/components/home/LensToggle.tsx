'use client'

import clsx from 'clsx'
import { useLens, type Lens } from './lens'

const SEGMENTS: { key: Lens; label: string }[] = [
  { key: 'fin', label: 'fin' },
  { key: 'eng', label: 'eng' },
  { key: 'both', label: 'both' },
]

export function LensToggle({ className }: { className?: string }) {
  const { lens, setLens } = useLens()

  return (
    <div
      role="group"
      aria-label="Lens"
      className={clsx(
        'inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white/60 p-1 font-mono text-sm dark:border-ink-border dark:bg-ink-surface/60',
        className
      )}
    >
      {SEGMENTS.map(({ key, label }) => {
        const active = lens === key
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => setLens(key)}
            className={clsx(
              'flex min-h-[44px] min-w-[64px] items-center justify-center rounded px-3 transition-colors',
              active
                ? 'bg-accent/15 text-accent'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-ink-muted dark:hover:text-ink-text'
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
