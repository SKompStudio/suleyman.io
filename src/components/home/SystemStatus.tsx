// Agentic OS readout. The one wired-real number is `last build`, the actual
// deploy timestamp captured at build time (see page.tsx). No fabricated
// telemetry: the agent cadence is shown as static prose, not faked counters.

export function SystemStatus({ lastBuild }: { lastBuild: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white/40 p-6 font-mono dark:border-ink-border dark:bg-ink-surface/40">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="inline-flex items-center gap-1.5 text-signal">
          <span aria-hidden>●</span>agents: online
        </span>
        <span className="text-zinc-400 dark:text-ink-muted">·</span>
        <span className="text-zinc-500 dark:text-ink-muted">last build: {lastBuild}</span>
      </div>
      <p className="mt-3 font-sans text-base text-zinc-700 dark:text-zinc-300">
        A multi-agent system I run for myself. Research, drafting, ops.
      </p>
    </div>
  )
}
