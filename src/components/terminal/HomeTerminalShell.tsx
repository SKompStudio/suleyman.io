import { HomeTerminalEnhance } from './HomeTerminalEnhance'

// RSC — server-rendered, fixed-height shell. Renders a static, LCP-safe prompt
// line + caret immediately (never an empty box, never animated from opacity:0),
// then the thin client enhancer dynamic-imports the interactive engine on top.
// The reserved min-height means hydration/enhancement swaps content inside a
// fixed box → zero layout shift.
export function HomeTerminalShell() {
  return (
    <div className="mt-8 rounded-lg border border-ink-border bg-ink-surface/30 p-4">
      <div className="mb-2 font-mono text-[11px] text-ink-muted">
        <span className="text-accent">●</span> interactive console
      </div>
      <div className="relative min-h-[140px]">
        {/* Static server-rendered fallback (the LCP-safe initial paint). The
            client enhancer overlays the live engine and hides this once ready. */}
        <div className="font-mono text-xs" aria-hidden="true">
          <p className="whitespace-pre-wrap text-accent">
            suleyman.io ▸ hi — i&apos;m an interactive console. type
            &apos;help&apos; or just say hi.
          </p>
          <p className="mt-2 text-ink-muted">
            <span className="text-accent">▸</span>{' '}
            <span className="animate-caret-blink motion-reduce:animate-none text-accent">
              █
            </span>
          </p>
        </div>
        <HomeTerminalEnhance />
      </div>
    </div>
  )
}
