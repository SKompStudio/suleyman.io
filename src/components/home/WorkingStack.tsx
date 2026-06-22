// The working stack: mono chips with cyan-bolded key technologies. Plain,
// non-interactive. Real material from the running setup.

type Chip = { key?: string; rest?: string }

const CHIPS: Chip[] = [
  { key: 'Next.js', rest: '16' },
  { key: 'TypeScript' },
  { rest: 'Python' },
  { key: 'Neon', rest: 'Postgres' },
  { rest: 'Prisma' },
  { rest: 'Vercel' },
  { rest: 'systemd' },
  { key: 'Anthropic' },
  { rest: 'LanceDB' },
  { rest: 'Playwright' },
]

export function WorkingStack() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-accent/15 bg-gradient-to-b from-ink-surface to-[#0A0E14]">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
      />
      <div className="border-b border-white/[0.06] px-5 py-3.5">
        <div className="font-mono text-xs uppercase tracking-[0.05em] text-ink-muted">
          // working <span className="text-accent">stack</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 px-5 py-4">
        {CHIPS.map((c, i) => (
          <span
            key={i}
            className="rounded-md border border-accent/15 bg-accent/[0.03] px-2.5 py-1.5 font-mono text-[11.5px] text-ink-muted"
          >
            {c.key ? <span className="font-semibold text-accent">{c.key}</span> : null}
            {c.key && c.rest ? ' ' : null}
            {c.rest ?? null}
          </span>
        ))}
      </div>
    </div>
  )
}
