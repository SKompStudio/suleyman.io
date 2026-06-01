'use client'

import { memo } from 'react'

import type { OutputLine, Tone } from './types'

const TONE_CLASS: Record<Tone, string> = {
  normal: 'text-ink-text',
  accent: 'text-accent',
  muted: 'text-ink-muted',
  gold: 'text-gold',
  error: 'text-red-400',
}

interface LineViewProps {
  line: OutputLine
  onRun: (command: string) => void
}

// Renders one output line. If the line has clickable `runs` tokens, the text is
// split around each token and the token becomes a button. `href` makes the
// whole line an anchor. Otherwise it's plain toned text. Memoized so appending a
// new entry doesn't re-render the entire scrollback (onRun is a stable ref).
export const LineView = memo(function LineView({ line, onRun }: LineViewProps) {
  const cls = TONE_CLASS[line.tone ?? 'normal']

  if (line.href) {
    return (
      <a
        href={line.href}
        target={line.external ? '_blank' : undefined}
        rel={line.external ? 'noopener noreferrer' : undefined}
        className={`block whitespace-pre-wrap ${cls} underline-offset-2 hover:underline`}
      >
        {line.text}
      </a>
    )
  }

  if (line.runs && line.runs.length) {
    return (
      <p className={`whitespace-pre-wrap ${cls}`}>{renderWithRuns(line, onRun)}</p>
    )
  }

  return <p className={`whitespace-pre-wrap ${cls}`}>{line.text || ' '}</p>
})

function renderWithRuns(line: OutputLine, onRun: (cmd: string) => void) {
  const runs = line.runs ?? []
  const nodes: React.ReactNode[] = []
  let rest = line.text
  let key = 0
  for (const r of runs) {
    const idx = rest.indexOf(r.token)
    if (idx === -1) continue
    if (idx > 0) nodes.push(<span key={key++}>{rest.slice(0, idx)}</span>)
    nodes.push(
      <button
        key={key++}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onRun(r.command)}
        className="text-accent underline-offset-2 hover:underline focus:underline focus:outline-none"
      >
        {r.token}
      </button>
    )
    rest = rest.slice(idx + r.token.length)
  }
  if (rest) nodes.push(<span key={key++}>{rest}</span>)
  return nodes
}
