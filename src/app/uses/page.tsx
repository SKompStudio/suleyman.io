import { Container } from '@/components/Container'
import { Reveal } from '@/components/home/Reveal'
import { CadenceTimeline, ComputeSplit, SystemMesh } from './SetupClient'

export const metadata = {
  title: 'Uses',
  description:
    'The setup behind the work: a 4-device Tailscale mesh, an always-on Linux server running local AI, and a personal multi-agent OS built on Claude.',
}

// ── Stack, grouped. Real, non-proprietary tooling. ─────────────────────────
const STACK: { group: string; items: string[] }[] = [
  { group: 'languages', items: ['TypeScript', 'Python', 'C# / .NET', 'SQL'] },
  { group: 'frameworks', items: ['Next.js 16', 'React 19', 'Tailwind', 'FastAPI'] },
  { group: 'data', items: ['Postgres / Neon', 'Prisma', 'LanceDB', 'BGE-M3', 'Docling'] },
  { group: 'infra', items: ['Vercel', 'AWS', 'Docker', 'Tailscale', 'Syncthing', 'systemd'] },
  { group: 'ai', items: ['Claude (Opus/Sonnet/Haiku)', 'Ollama · qwen2.5', 'Whisper'] },
  { group: 'payments', items: ['Square'] },
  { group: 'testing', items: ['Vitest', 'Playwright'] },
  { group: 'workflow', items: ['tmux', 'Git', 'Claude Code'] },
]

const HARDWARE: { k: string; v: string }[] = [
  { k: 'server', v: 'ryzen 9 5900x · 64gb · always-on linux' },
  { k: 'gpu', v: 'rtx 3080 · whisper + ollama qwen2.5' },
  { k: 'primary', v: 'm5 macbook pro' },
  { k: 'mobile', v: 'iphone 15 pro max · control surface' },
]

// ── The agentic-OS capabilities, conceptual only (no IP, no internals). ────
const CAPABILITIES: { k: string; v: string }[] = [
  { k: 'skills / automations', v: '~22' },
  { k: 'watchers', v: 'email-triggered · ~30s' },
  { k: 'briefings', v: 'nightly health · weekday brief + EOD' },
  { k: 'research', v: 'weekly deep-research → RAG vaults' },
  { k: 'orchestration', v: 'orchestrator → workers · fail-closed gates' },
  { k: 'reliability', v: 'self-monitoring · auto-recovers' },
  { k: 'memory', v: 'layered: session → project → vaults' },
  { k: 'lineage', v: "after Karpathy's LLM-OS / LLM-Wiki" },
]

function Eyebrow({ children }: { children: string }) {
  return <p className="mb-5 font-mono text-sm text-accent">{children}</p>
}

export default function Uses() {
  return (
    <Container className="relative z-10 mt-16 sm:mt-24">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative py-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-clip"
        >
          <div className="hud-grid absolute inset-0" />
          <div className="hud-glow absolute inset-0" />
        </div>

        <div className="hud-brackets relative max-w-3xl py-2">
          <p className="font-mono text-sm text-accent">~/setup</p>
          <h1 className="mt-4 text-4xl font-normal tracking-tight text-ink-text sm:text-5xl lg:text-6xl lg:leading-[1.05]">
            I engineered my whole workflow.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-400">
            Not a list of apps — a system. Four devices on a private mesh, an
            always-on server running local AI, and a personal multi-agent OS
            built on Claude that compounds my research, ops, and engineering
            while I sleep.
          </p>
          <p className="mt-6 font-mono text-sm text-ink-muted">
            <span className="text-ink-text">4</span> devices{' '}
            <span className="text-ink-border">·</span>{' '}
            <span className="text-ink-text">1</span> always-on hub{' '}
            <span className="text-ink-border">·</span>{' '}
            <span className="text-ink-text">~22</span> automations{' '}
            <span className="text-ink-border">·</span>{' '}
            <span className="text-ink-text">2</span> local models
          </p>
        </div>
      </section>

      {/* ── The system mesh — signature ──────────────────────────────────── */}
      <section className="py-14">
        <Eyebrow>~/mesh</Eyebrow>
        <Reveal>
          <div className="hud-brackets relative overflow-hidden rounded-xl border border-accent/25 bg-ink-surface/40 p-5 sm:p-7">
            <div className="hud-glow pointer-events-none absolute inset-0" aria-hidden />
            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-mono text-sm leading-tight text-ink-text">
                  <span className="text-accent">~/agentic-os</span>
                  <span className="ml-3 text-xs text-ink-muted">
                    private mesh · local + cloud compute
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-accent">
                  <span aria-hidden className="hud-pulse animate-online-pulse">
                    ●
                  </span>
                  online
                </span>
              </div>

              <div className="mt-6 rounded-lg border border-white/5 bg-black/30 p-4 sm:p-6">
                <div className="mx-auto max-w-3xl">
                  <SystemMesh />
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-1 gap-x-10 font-mono text-xs sm:grid-cols-2">
                {CAPABILITIES.map((r) => (
                  <div
                    key={r.k}
                    className="flex items-baseline justify-between gap-4 border-b border-white/5 py-2"
                  >
                    <dt className="text-accent/70">{r.k}</dt>
                    <dd className="text-right font-medium text-ink-text">{r.v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 max-w-2xl font-sans text-base text-zinc-300">
                The server is the brain: it never sleeps, watches itself,
                recovers stuck or failed runs automatically, and ships
                autonomous work only behind deterministic, fail-closed gates.
                Cheap and private work — voice transcription, voice-note
                filtering, local LLM tasks — runs on the RTX 3080. Heavy
                reasoning and multi-agent orchestration run on Claude. Built
                after Andrej Karpathy&apos;s LLM-OS and his LLM-Wiki memory
                pattern.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Charts: cadence + compute split ──────────────────────────────── */}
      <section className="py-14">
        <Eyebrow>~/cadence</Eyebrow>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="hud-brackets relative h-full rounded-xl border border-accent/25 bg-ink-surface/40 p-5 sm:p-6">
              <div className="mb-5 font-mono text-sm text-ink-text">
                <span className="text-accent">~/automation-day</span>
                <span className="ml-3 text-xs text-ink-muted">24h · real cadences</span>
              </div>
              <CadenceTimeline />
            </div>
          </Reveal>

          <Reveal delay={1} className="lg:col-span-2">
            <div className="hud-brackets relative h-full rounded-xl border border-accent/25 bg-ink-surface/40 p-5 sm:p-6">
              <div className="mb-5 font-mono text-sm text-ink-text">
                <span className="text-accent">~/where-compute-goes</span>
              </div>
              <ComputeSplit />
              <p className="mt-6 font-mono text-[11px] leading-relaxed text-ink-muted">
                A deliberate split, not a meter: the 3080 absorbs the cheap,
                private, high-volume work so the cloud budget goes to reasoning.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Stack ────────────────────────────────────────────────────────── */}
      <section className="py-14">
        <Eyebrow>~/stack</Eyebrow>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map((cat, i) => (
            <Reveal key={cat.group} delay={i % 4}>
              <div className="rounded-xl border border-ink-border bg-ink-surface/30 p-5">
                <div className="font-mono text-xs uppercase tracking-wide text-accent/70">
                  {cat.group}
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {cat.items.map((it) => (
                    <li
                      key={it}
                      className="rounded-md border border-white/5 bg-black/30 px-2.5 py-1 font-mono text-xs text-zinc-300"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Hardware readout ─────────────────────────────────────────────── */}
      <section className="py-14">
        <Eyebrow>~/hardware</Eyebrow>
        <Reveal>
          <dl className="grid grid-cols-1 gap-x-10 rounded-xl border border-ink-border bg-ink-surface/30 p-6 font-mono text-sm sm:grid-cols-2">
            {HARDWARE.map((h) => (
              <div
                key={h.k}
                className="flex items-baseline justify-between gap-4 border-b border-white/5 py-2.5"
              >
                <dt className="text-accent/70">{h.k}</dt>
                <dd className="text-right text-ink-text">{h.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>
    </Container>
  )
}
