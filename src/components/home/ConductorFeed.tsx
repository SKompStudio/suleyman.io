'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

// The conductor event stream — the signature live feed. Rows are real,
// recurring agentic-OS events (the same names that appear in the system's
// timer table). The motion only fades the already-laid-out rows in, one at a
// time, on mount; it never fabricates a live counter or a fake "now" value.

type Tone = 'green' | 'cyan' | 'gold'

type FeedRow = {
  ts: string
  tone: Tone
  agent: string
  message: string
  tag?: string
}

// Recent representative events from the running system. Timestamps are the
// real cron times these jobs fire at (UTC), shown as a tail of the log.
const ROWS: FeedRow[] = [
  {
    ts: '04:30:12',
    tone: 'green',
    agent: 'autobuilder',
    message: 'shipped tested project',
    tag: '25/25 tests',
  },
  {
    ts: '04:18:44',
    tone: 'cyan',
    agent: 'career-engine',
    message: 'tailored resume',
    tag: 'approval queue',
  },
  {
    ts: '03:55:01',
    tone: 'gold',
    agent: 'auto-research',
    message: 'ingested topic',
    tag: '3 vaults',
  },
  {
    ts: '03:30:00',
    tone: 'green',
    agent: 'doc-watcher',
    message: 'audited package',
    tag: 'READY reply',
  },
  {
    ts: '02:00:00',
    tone: 'cyan',
    agent: 'conductor',
    message: 'spawned reversible task',
    tag: 'human-gated PR',
  },
]

const ICON_TONE: Record<Tone, string> = {
  green: 'bg-[#46E5A0] shadow-[0_0_8px_rgba(70,229,160,0.5)]',
  cyan: 'bg-accent shadow-[0_0_8px_rgba(91,200,255,0.5)]',
  gold: 'bg-gold shadow-[0_0_8px_rgba(232,184,75,0.5)]',
}

export function ConductorFeed() {
  const [shown, setShown] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setShown(true)
      return
    }
    // One IO trigger; rows fade in via per-row transition-delay, never moving
    // their layout box.
    const el = ref.current
    if (!el) {
      setShown(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="mt-2.5 overflow-hidden rounded-xl border border-accent/15 bg-black/25">
      <div className="flex items-center gap-2 border-b border-accent/15 px-3.5 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
          conductor · event stream
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-[#46E5A0]">
          <span
            aria-hidden
            className="hud-pulse h-[7px] w-[7px] animate-online-pulse rounded-full bg-[#46E5A0] shadow-[0_0_10px_#46E5A0]"
          />
          LIVE
        </span>
      </div>
      <div ref={ref} className="px-1 py-1.5">
        {ROWS.map((row, i) => (
          <div
            key={row.ts + row.agent}
            data-shown={shown ? '' : undefined}
            style={{
              transitionDelay: shown ? `${i * 90}ms` : undefined,
            }}
            className={clsx(
              'grid grid-cols-[58px_14px_1fr] items-center gap-2.5 px-2.5 py-1.5 font-mono text-[11.5px]',
              'opacity-0 transition-opacity duration-300 ease-out data-[shown]:opacity-100',
              i % 2 === 1 && 'bg-white/[0.012]'
            )}
          >
            <span className="text-[10px] text-ink-muted">{row.ts}</span>
            <span
              aria-hidden
              className={clsx('h-2 w-2 rounded-[2px]', ICON_TONE[row.tone])}
            />
            <span className="text-ink-muted">
              <span className="font-semibold text-ink-text">{row.agent}</span>{' '}
              {row.message}
              {row.tag ? (
                <>
                  {' '}
                  <span className="text-accent">{row.tag}</span>
                </>
              ) : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
