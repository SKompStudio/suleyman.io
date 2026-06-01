'use client'

import { useEffect, useRef, useState } from 'react'

// Game A — "Crack the Access Code". A JARVIS bypass-the-lock number guess with
// hot/cold telemetry. Zero animation dependency, keyboard + SR friendly,
// reduced-motion safe by construction. Lazy-imported on invocation.

interface GameProps {
  hard?: boolean
  onExit: (summary: string) => void
}

interface Telemetry {
  guess: number
  band: string
  meter: number // 0..10
  tone: 'win' | 'gold' | 'muted'
  dir: string
}

function readBest(): number | null {
  if (typeof localStorage === 'undefined') return null
  const v = Number(localStorage.getItem('crackBest'))
  return Number.isFinite(v) && v > 0 ? v : null
}

export default function CrackTheCode({ hard = false, onExit }: GameProps) {
  const max = hard ? 9999 : 999
  const [code] = useState(() => Math.floor(Math.random() * (max + 1)))
  const [log, setLog] = useState<Telemetry[]>([])
  const [attempts, setAttempts] = useState(0)
  const [won, setWon] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [best, setBest] = useState<number | null>(null)
  const [note, setNote] = useState('')

  useEffect(() => {
    setBest(readBest())
    inputRef.current?.focus()
  }, [])

  function evaluate(guess: number): Telemetry {
    const dist = Math.abs(guess - code)
    const dir = hard ? '' : guess < code ? '↑ higher' : guess > code ? '↓ lower' : ''
    if (dist === 0) return { guess, band: '✔ ACCESS GRANTED', meter: 10, tone: 'win', dir: '' }
    if (dist <= 10) return { guess, band: 'CRITICAL — almost in', meter: 9, tone: 'gold', dir }
    if (dist <= 40) return { guess, band: 'warm', meter: 6, tone: 'muted', dir }
    if (dist <= 120) return { guess, band: 'cool', meter: 3, tone: 'muted', dir }
    return { guess, band: 'cold', meter: 1, tone: 'muted', dir }
  }

  function submit() {
    const raw = draft.trim()
    if (raw === 'q') {
      onExit(`session ended · attempts ${attempts} · best ${best ?? '—'}`)
      return
    }
    if (raw === '?') {
      setNote(`rules: enter a 0–${max} guess. q quits. warmer = closer.`)
      setDraft('')
      return
    }
    if (!/^\d+$/.test(raw) || Number(raw) > max) {
      setNote(`digits only, 0–${max}`)
      setDraft('')
      return
    }
    const guess = Number(raw)
    const t = evaluate(guess)
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    setLog((l) => [...l, t])
    setDraft('')
    setNote('')
    if (t.tone === 'win') {
      setWon(true)
      const newBest = best === null || nextAttempts < best ? nextAttempts : best
      setBest(newBest)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('crackBest', String(newBest))
      }
      setNote(
        `✔ ACCESS GRANTED in ${nextAttempts} guess${nextAttempts === 1 ? '' : 'es'} · personal best ${newBest}`
      )
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    e.stopPropagation()
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onExit(`session ended · attempts ${attempts} · best ${best ?? '—'}`)
    }
  }

  return (
    <div className="mt-2 border-l-2 border-accent/40 pl-3 font-mono text-xs">
      <p className="text-accent">
        crack ▸ lock engaged · {hard ? '4' : '3'}-digit code · warmer = closer ·
        q quits
      </p>
      <div className="mt-1 space-y-0.5" aria-live="polite">
        {log.map((t, i) => (
          <p
            key={i}
            className={
              t.tone === 'win'
                ? 'text-accent'
                : t.tone === 'gold'
                  ? 'text-gold'
                  : 'text-ink-muted'
            }
          >
            crack ▸ {t.guess}
            {'  '}[{'▓'.repeat(t.meter)}{'░'.repeat(10 - t.meter)}] {t.band}
            {t.dir ? `  ${t.dir}` : ''}
          </p>
        ))}
      </div>
      {note && <p className="mt-1 text-gold">{note}</p>}
      {!won && (
        <div className="mt-1 flex items-center gap-2">
          <span className="text-accent">crack ▸</span>
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            inputMode="numeric"
            aria-label="Enter your guess"
            className="flex-1 bg-transparent text-ink-text outline-none placeholder:text-ink-border"
            placeholder={`0–${max}  (q quits, ? rules)`}
          />
        </div>
      )}
      {won && (
        <button
          onClick={() => onExit(`solved in ${attempts} · best ${best ?? attempts}`)}
          className="mt-1 text-ink-muted underline-offset-2 hover:text-accent hover:underline"
        >
          ↵ exit game
        </button>
      )}
    </div>
  )
}
