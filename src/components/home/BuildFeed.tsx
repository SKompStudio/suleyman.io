import clsx from 'clsx'

// Terminal-styled recent-heartbeat card. Lines are real recurring conductor
// jobs from the running system, framed as a log tail. The "last 30s" badge is
// honest decorative framing, not a fake live counter.

type Mark = 'ok' | 'building' | 'note'

type Line = {
  mark: Mark
  agent?: string
  rest: string
}

const LINES: Line[] = [
  { mark: 'note', rest: 'conductor@skomp-server ~ heartbeat' },
  { mark: 'ok', agent: 'career-tailor', rest: 'drained jobs → approval queue' },
  { mark: 'ok', agent: 'doc-watcher', rest: 'audit READY · ~4m reply' },
  { mark: 'building', agent: 'autobuilder', rest: 'building slug in isolated worktree' },
  { mark: 'ok', agent: 'kb-autocommit', rest: '3 vaults snapshotted' },
  { mark: 'ok', agent: 'restic backup', rest: '9 snapshots · B2 off-site' },
  { mark: 'note', rest: 'all gates fail-closed · publishes human-tapped' },
]

function Glyph({ mark }: { mark: Mark }) {
  if (mark === 'ok') return <span className="text-[#46E5A0]">✓</span>
  if (mark === 'building') return <span className="text-gold">▶</span>
  return <span className="text-ink-muted">·</span>
}

export function BuildFeed() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-accent/15 bg-gradient-to-b from-ink-surface to-[#0A0E14]">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
      />
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="font-mono text-xs uppercase tracking-[0.05em] text-ink-muted">
          // build feed <span className="text-accent">·live</span>
        </div>
        <div className="rounded-md border border-gold/20 bg-gold/[0.08] px-2 py-1 font-mono text-[10.5px] tracking-[0.04em] text-gold">
          last 30s
        </div>
      </div>
      <div className="px-5 py-4 font-mono text-[12.5px] leading-[1.85]">
        {LINES.map((l, i) => (
          <div key={i} className={clsx(l.mark === 'note' ? 'text-ink-muted' : 'text-ink-muted')}>
            <Glyph mark={l.mark} />{' '}
            {l.agent ? (
              <span className="text-ink-text">{l.agent}</span>
            ) : null}{' '}
            <span className={l.mark === 'note' ? 'text-ink-muted' : 'text-ink-muted'}>
              {l.rest}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
