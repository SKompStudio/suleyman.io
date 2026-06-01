'use client'

import { LensToggle } from './LensToggle'

const NAV: { id: string; label: string }[] = [
  { id: 'system', label: 'system' },
  { id: 'work', label: 'work' },
  { id: 'experience', label: 'experience' },
  { id: 'signals', label: 'signals' },
  { id: 'education', label: 'education' },
  { id: 'contact', label: 'contact' },
]

export function MetaRail({ lastBuild }: { lastBuild: string }) {
  return (
    <aside className="sticky top-28 hidden h-fit w-[260px] flex-none lg:block">
      <div className="font-mono text-sm text-ink-text">Suleyman Kiani</div>
      <p className="mt-1 text-sm text-ink-muted">Software Engineer · Equipment Finance</p>

      <div className="mt-6">
        <LensToggle />
      </div>

      <nav className="mt-8">
        <ul className="space-y-2 font-mono text-sm">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className="text-ink-muted transition-colors hover:text-accent"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 font-mono text-xs text-ink-muted">
        <span className="text-accent hud-pulse animate-online-pulse">●</span> agents:
        online · build {lastBuild}
      </div>
    </aside>
  )
}
