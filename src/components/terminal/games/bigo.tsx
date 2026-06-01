'use client'

import { useEffect, useRef, useState } from 'react'

// Game C — "Guess the Big-O". Five rounds, four choices each, score the streak.
// Pure static data, discrete state, zero animation → reduced-motion safe and
// screen-reader friendly by construction. Lazy-imported on invocation.

interface GameProps {
  onExit: (summary: string) => void
}

interface Round {
  snippet: string[]
  options: string[]
  answer: number
}

const BANK: Round[] = [
  {
    snippet: ['for (const x of arr) {', '  sum += x', '}'],
    options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
    answer: 1,
  },
  {
    snippet: ['for (const a of arr)', '  for (const b of arr)', '    pairs.push([a, b])'],
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
    answer: 2,
  },
  {
    snippet: ['while (lo <= hi) {', '  const mid = (lo + hi) >> 1', '  if (a[mid] === t) return mid', '  ...', '}'],
    options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'],
    answer: 0,
  },
  {
    snippet: ['const seen = new Set(arr)', 'return seen.has(target)'],
    options: ['O(n²)', 'O(log n)', 'O(n)', 'O(n!)'],
    answer: 2,
  },
  {
    snippet: ['function fib(n) {', '  if (n < 2) return n', '  return fib(n-1) + fib(n-2)', '}'],
    options: ['O(n)', 'O(n²)', 'O(2ⁿ)', 'O(log n)'],
    answer: 2,
  },
  {
    snippet: ['arr.sort((a, b) => a - b)'],
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    answer: 1,
  },
  {
    snippet: ['return arr[0]'],
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    answer: 0,
  },
  {
    snippet: ['function permute(s) {', '  // generate every ordering', '  ...', '}'],
    options: ['O(n²)', 'O(2ⁿ)', 'O(n!)', 'O(n log n)'],
    answer: 2,
  },
]

const ROUNDS = 5

function shuffle<T>(src: T[]): T[] {
  const a = [...src]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function readBest(): number | null {
  if (typeof localStorage === 'undefined') return null
  const v = Number(localStorage.getItem('bigoBest'))
  return Number.isFinite(v) && v > 0 ? v : null
}

export default function BigO({ onExit }: GameProps) {
  const [deck] = useState(() => shuffle(BANK).slice(0, ROUNDS))
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const [best, setBest] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setBest(readBest())
    inputRef.current?.focus()
  }, [])

  const round = deck[idx]

  function choose(choice: number) {
    if (picked !== null || done) return
    const correct = choice === round.answer
    const nextScore = correct ? score + 1 : score
    setPicked(choice)
    setScore(nextScore)
    window.setTimeout(() => {
      if (idx + 1 >= deck.length) {
        setDone(true)
        const newBest = best === null || nextScore > best ? nextScore : best
        setBest(newBest)
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('bigoBest', String(newBest))
        }
      } else {
        setIdx(idx + 1)
        setPicked(null)
      }
    }, 650)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    e.stopPropagation()
    if (e.key === 'Escape' || e.key.toLowerCase() === 'q') {
      e.preventDefault()
      onExit(`session ended · score ${score}/${deck.length} · best ${best ?? score}`)
      return
    }
    if (done && e.key === 'Enter') {
      e.preventDefault()
      onExit(`score ${score}/${deck.length} · best ${best ?? score}`)
      return
    }
    const n = Number(e.key)
    if (n >= 1 && n <= round.options.length) {
      e.preventDefault()
      choose(n - 1)
    }
  }

  function optionClass(i: number): string {
    if (picked === null) return 'text-ink-muted'
    if (i === round.answer) return 'text-accent'
    if (i === picked) return 'text-red-400'
    return 'text-ink-muted'
  }

  return (
    <div className="mt-2 border-l-2 border-accent/40 pl-3 font-mono text-xs">
      <p className="text-accent">bigo ▸ guess the complexity · 1–4 to answer · q quits</p>
      {!done ? (
        <div className="mt-1 space-y-0.5" aria-live="polite">
          <p className="text-ink-muted">
            round {idx + 1}/{deck.length} · score {score}
          </p>
          <div className="my-1 border-l border-ink-border/60 pl-2">
            {round.snippet.map((s, i) => (
              <p key={i} className="whitespace-pre text-ink-text">
                {s}
              </p>
            ))}
          </div>
          {round.options.map((opt, i) => (
            <button
              key={i}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
              disabled={picked !== null}
              className={`block text-left ${optionClass(i)} hover:text-accent disabled:hover:text-inherit`}
            >
              {i + 1}. {opt}
              {picked !== null && i === round.answer ? '  ✔' : ''}
              {picked !== null && i === picked && i !== round.answer ? '  ✗' : ''}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-1 text-accent" aria-live="polite">
          done · {score}/{deck.length} correct · best {best ?? score} · ↵ to exit
        </p>
      )}
      <input
        ref={inputRef}
        value=""
        onChange={() => {}}
        onKeyDown={onKeyDown}
        aria-label="Press 1 to 4 to answer, q to quit"
        className="mt-1 w-full bg-transparent text-ink-text caret-transparent outline-none placeholder:text-ink-border"
        placeholder={done ? 'press ↵ to exit' : 'press 1–4'}
      />
    </div>
  )
}
