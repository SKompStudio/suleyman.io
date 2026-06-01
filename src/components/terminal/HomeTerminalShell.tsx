import { HomeTerminalEnhance } from './HomeTerminalEnhance'

// RSC — server-rendered shell chrome. The client enhancer renders a static,
// LCP-safe prompt + caret on first paint (never an empty box, never animated
// from opacity:0), then swaps the interactive engine in place. The reserved
// min-height holds the box stable across that swap → minimal layout shift.
export function HomeTerminalShell() {
  return (
    <div className="mt-8 rounded-lg border border-ink-border bg-ink-surface/30 p-4">
      <div className="mb-2 font-mono text-[11px] text-ink-muted">
        <span className="text-accent">●</span> interactive console
      </div>
      <div className="min-h-[176px]">
        <HomeTerminalEnhance />
      </div>
    </div>
  )
}
