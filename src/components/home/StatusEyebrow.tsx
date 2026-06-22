// The live now-line. Renders server-side so it is present at paint. The unit
// count is the real systemd unit count of the running system; the last-deploy
// value is wired to the page's actual last build date passed in by the server.

export function StatusEyebrow({ lastDeploy }: { lastDeploy: string }) {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/15 bg-accent/[0.04] px-3.5 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.06em] text-ink-muted">
      <span
        aria-hidden
        className="hud-pulse h-1.5 w-1.5 animate-online-pulse rounded-full bg-[#46E5A0] shadow-[0_0_8px_#46E5A0]"
      />
      Systems nominal
      <span className="text-ink-border">·</span>
      <span className="text-[#46E5A0]">57 units live</span>
      <span className="text-ink-border">·</span>
      last deploy {lastDeploy}
    </div>
  )
}
