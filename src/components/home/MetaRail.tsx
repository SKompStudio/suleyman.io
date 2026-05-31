'use client'

import { LensToggle } from './LensToggle'

const NAV: { id: string; label: string }[] = [
  { id: 'work', label: 'work' },
  { id: 'experience', label: 'experience' },
  { id: 'education', label: 'education' },
  { id: 'system', label: 'system' },
  { id: 'contact', label: 'contact' },
]

export function MetaRail({ lastBuild }: { lastBuild: string }) {
  return (
    <aside className="sticky top-28 hidden h-fit w-[260px] flex-none lg:block">
      <div className="font-mono text-sm text-zinc-900 dark:text-ink-text">Suleyman Kiani</div>
      <p className="mt-1 text-sm text-zinc-500 dark:text-ink-muted">
        Software Engineer · Equipment Finance
      </p>

      <div className="mt-6">
        <LensToggle />
      </div>

      <nav className="mt-8">
        <ul className="space-y-2 font-mono text-sm">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className="text-zinc-500 transition-colors hover:text-accent dark:text-ink-muted dark:hover:text-accent"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 font-mono text-xs text-zinc-400 dark:text-ink-muted">
        <span className="text-signal">●</span> agents: online · last build {lastBuild}
      </div>
    </aside>
  )
}
