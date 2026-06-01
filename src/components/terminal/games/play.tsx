'use client'

import { useEffect, useRef, useState } from 'react'

// Game B — "Boot Sequence". A 20s command-speed sprint that doubles as a
// stealth tutorial: real registry commands flash, you type them fast. Lazy
// imported on invocation. reduced-motion → discrete per-second countdown.

const TOKENS = [
  'whoami',
  'langs',
  'git log',
  'ls',
  'stack',
  'uptime',
  'leetcode',
  'contact',
  'theme',
  'reactor',
]

const DURATION = 20

interface GameProps {
  reduced: boolean
  onExit: (summary: string) => void
}

function pickToken(prev: string): string {
  let t = prev
  while (t === prev) t = TOKENS[Math.floor(Math.random() * TOKENS.length)]
  return t
}

function readBest(): number | null {
  if (typeof localStorage === 'undefined') return null
  const v = Number(localStorage.getItem('bootBest'))
  return Number.isFinite(v) && v > 0 ? v : null
}

export default function BootSequence({ reduced, onExit }: GameProps) {
  const [target, setTarget] = useState(() => TOKENS[0])
  const [draft, setDraft] = useState('')
  const [score, setScore] = useState(0)
  const [left, setLeft] = useState(DURATION)
  const [done, setDone] = useState(false)
  const [miss, setMiss] = useState(false)
  const [best, setBest] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const startRef = useRef<number>(Date.now())

  useEffect(() => {
    setBest(readBest())
    inputRef.current?.focus()
    const tick = window.setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000
      const remaining = Math.max(0, DURATION - elapsed)
      setLeft(reduced ? Math.ceil(remaining) : Math.round(remaining * 10) / 10)
      if (remaining <= 0) {
        window.clearInterval(tick)
        finish()
      }
    }, reduced ? 1000 : 100)
    return () => window.clearInterval(tick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  function finish() {
    setDone(true)
    setScore((s) => {
      const newBest = best === null || s > best ? s : best
      setBest(newBest)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('bootBest', String(newBest))
      }
      return s
    })
  }

  function onKeyDown(e: React.KeyboardEvent) {
    e.stopPropagation()
    if (e.key === 'Escape') {
      e.preventDefault()
      onExit(`session ended · score ${score} · best ${best ?? score}`)
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (done) {
        onExit(`score ${score} · best ${best ?? score}`)
        return
      }
      if (draft.trim().toLowerCase() === target.toLowerCase()) {
        setScore((s) => s + 1)
        setTarget((t) => pickToken(t))
        setMiss(false)
      } else {
        setMiss(true)
      }
      setDraft('')
    }
  }

  const cells = Math.round((left / DURATION) * 10)
  const cpm = done ? Math.round((score / DURATION) * 60) : 0
  const grade = score >= 8 ? ' · reflexes: stark-grade' : ''

  return (
    <div className="mt-2 border-l-2 border-accent/40 pl-3 font-mono text-xs">
      <p className="text-accent">play ▸ BOOT SEQUENCE — type each command. 20s. go.</p>
      {!done ? (
        <p className="mt-1" aria-live="polite">
          <span className="text-ink-muted">target → </span>
          <span className="text-accent">{target}</span>
          {'   '}
          <span className="text-ink-muted">
            [{'▓'.repeat(cells)}{'░'.repeat(10 - cells)}] {Math.ceil(left)}s
          </span>
          {'   '}
          <span className={miss ? 'text-gold' : 'text-accent'}>
            {miss ? '✗' : '✔'} {score}
          </span>
        </p>
      ) : (
        <p className="mt-1 text-accent" aria-live="polite">
          done · {score} commands · {cpm}/min · best {best ?? score}
          {grade}
        </p>
      )}
      <div className="mt-1 flex items-center gap-2">
        <span className="text-accent">▸</span>
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Type the target command"
          className="flex-1 bg-transparent text-ink-text outline-none placeholder:text-ink-border"
          placeholder={done ? 'press ↵ to exit' : 'type it · q/Esc quits'}
        />
      </div>
    </div>
  )
}
