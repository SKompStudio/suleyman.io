'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from 'react'
import { useRouter } from 'next/navigation'

import { LineView } from './Line'
import { useReducedMotion } from './useReducedMotion'
import {
  fetchCommits,
  fetchContributions,
  fetchLangs,
  fetchLeetcode,
  fetchProjects,
} from './fetchers'
import {
  COMMAND_WORDS,
  chainAfter,
  parse,
} from './commands'
import { GAME_LOADERS, type BigoProps, type CrackProps, type PlayProps } from './games'
import type { CommandContext, OutputLine } from './types'

type Variant = 'overlay' | 'inline'

interface Entry {
  id: number
  // The echoed input line (with prompt) — null for system output blocks.
  input?: string
  lines: OutputLine[]
}

interface TerminalProps {
  variant: Variant
  greeting?: OutputLine[]
  // overlay passes a close handler; inline ignores it.
  onRequestClose?: () => void
}

let uid = 0

// Animated braille spinner frames (transform/opacity-free, pure text swap).
const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

export function Terminal({ variant, greeting, onRequestClose }: TerminalProps) {
  const router = useRouter()
  const reduced = useReducedMotion()

  const [entries, setEntries] = useState<Entry[]>(() =>
    greeting ? [{ id: uid++, lines: greeting }] : []
  )
  const [draft, setDraft] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState<number | null>(null)
  const [pendingDraft, setPendingDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [crt, setCrt] = useState(false)
  const [hintDismissed, setHintDismissed] = useState(false)

  // Ctrl+R reverse-search mode.
  const [rsearch, setRsearch] = useState<string | null>(null)

  const [activeGame, setActiveGame] = useState<null | {
    kind: 'crack' | 'play' | 'bigo'
    Comp:
      | ComponentType<CrackProps>
      | ComponentType<PlayProps>
      | ComponentType<BigoProps>
    hard?: boolean
  }>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const konamiRef = useRef<string[]>([])

  // Load persisted history (sessionStorage) on mount.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('hudHistory')
      if (raw) setHistory(JSON.parse(raw))
    } catch {
      /* ignore */
    }
    inputRef.current?.focus()
  }, [])

  // Apply persisted accent on mount.
  useEffect(() => {
    try {
      const a = localStorage.getItem('hudAccent')
      if (a) document.documentElement.style.setProperty('--hud-accent', a)
    } catch {
      /* ignore */
    }
  }, [])

  // Autoscroll to bottom on new output — glides when motion is allowed, snaps
  // under the reduced-motion floor (the CSS floor also forces scroll-behavior).
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? 'auto' : 'smooth' })
  }, [entries, activeGame, reduced])

  // Animate the spinner braille frame while a command is in flight.
  const [spinFrame, setSpinFrame] = useState(0)
  useEffect(() => {
    if (!busy || reduced) return
    const t = window.setInterval(
      () => setSpinFrame((f) => (f + 1) % SPINNER.length),
      90
    )
    return () => window.clearInterval(t)
  }, [busy, reduced])

  // Authoritative refocus: after any output/state change, return the caret to
  // the prompt — unless a game/palette owns focus, the user is selecting text,
  // or focus is intentionally elsewhere (outside the terminal root).
  useEffect(() => {
    if (activeGame || rsearch !== null) return
    const sel = typeof window !== 'undefined' ? window.getSelection() : null
    if (sel && sel.type === 'Range' && !sel.isCollapsed) return
    const el = inputRef.current
    if (!el) return
    const active = document.activeElement
    if (active === el) return
    if (active === document.body || rootRef.current?.contains(active)) {
      el.focus({ preventScroll: true })
    }
  }, [entries, busy, activeGame, rsearch])

  const ctx: Omit<CommandContext, 'args' | 'raw'> = useMemo(
    () => ({
      fetchProjects,
      fetchLangs,
      fetchCommits,
      fetchContributions,
      fetchLeetcode,
      navigate: (path: string) => router.push(path),
    }),
    [router]
  )

  const pushOutput = useCallback((input: string | undefined, lines: OutputLine[]) => {
    setEntries((e) => [...e, { id: uid++, input, lines }])
  }, [])

  const startGame = useCallback(
    async (kind: 'crack' | 'play' | 'bigo', hard?: boolean) => {
      pushOutput(undefined, [{ text: `launching ${kind} …`, tone: 'muted' }])
      const Comp = await GAME_LOADERS[kind]()
      setActiveGame({ kind, Comp, hard })
    },
    [pushOutput]
  )

  const applyAccent = useCallback((value: string) => {
    if (value === 'crt-toggle') {
      setCrt((c) => !c)
      return
    }
    document.documentElement.style.setProperty('--hud-accent', value)
    try {
      localStorage.setItem('hudAccent', value)
    } catch {
      /* ignore */
    }
  }, [])

  const runCommand = useCallback(
    async (rawInput: string, echo = true) => {
      const raw = rawInput.trim()
      if (!raw) return
      if (!hintDismissed) setHintDismissed(true)

      const nextHistory = [...history, raw].slice(-50)
      setHistory(nextHistory)
      try {
        sessionStorage.setItem('hudHistory', JSON.stringify(nextHistory))
      } catch {
        /* ignore */
      }
      setHistIdx(null)

      const { command, name, args } = parse(raw)
      const echoInput = echo ? raw : undefined

      // ── Engine-handled commands (need engine state) ──────────────────────
      if (name === 'history') {
        if (!history.length) {
          pushOutput(echoInput, [{ text: 'no history yet.', tone: 'muted' }])
          return
        }
        const rows: OutputLine[] = history.map((h, i) => ({
          text: `  ${String(i + 1).padStart(3)}  ${h}`,
          tone: 'muted',
          runs: [{ token: h, command: h }],
        }))
        pushOutput(echoInput, [{ text: 'history', tone: 'accent' }, ...rows])
        return
      }
      if (name === 'grep') {
        const needle = args.join(' ').toLowerCase()
        if (!needle) {
          pushOutput(echoInput, [
            { text: "usage: grep <text>  — filters this session's history", tone: 'muted' },
          ])
          return
        }
        const hits = history.filter((h) => h.toLowerCase().includes(needle))
        if (!hits.length) {
          pushOutput(echoInput, [{ text: `grep: no match for '${needle}'`, tone: 'muted' }])
          return
        }
        pushOutput(
          echoInput,
          hits.map((h) => ({
            text: `  ${h}`,
            tone: 'muted' as const,
            runs: [{ token: h, command: h }],
          }))
        )
        return
      }

      if (!command) {
        // fuzzy "did you mean" against known command words
        const first = raw.split(/\s+/)[0].toLowerCase()
        const near = COMMAND_WORDS.find(
          (w) => w.startsWith(first.slice(0, 2)) && w !== first
        )
        const lines: OutputLine[] = [
          {
            text: `command not found: ${raw.split(/\s+/)[0]}. type 'help'.`,
            tone: 'error',
            runs: [{ token: 'help', command: 'help' }],
          },
        ]
        if (near) {
          lines.push({
            text: `  did you mean '${near}'?`,
            tone: 'muted',
            runs: [{ token: near, command: near }],
          })
        }
        pushOutput(echoInput, lines)
        return
      }

      const isAsync = command.run.constructor.name === 'AsyncFunction'
      let spinnerId = -1
      if (isAsync) {
        spinnerId = uid++
        setEntries((e) => [
          ...e,
          {
            id: spinnerId,
            input: echoInput,
            lines: [{ text: reduced ? '…' : `${SPINNER[0]} fetching …`, tone: 'muted' }],
          },
        ])
        setBusy(true)
      }

      let result
      try {
        result = await command.run({ ...ctx, args, raw })
      } catch {
        result = { lines: [{ text: 'command failed.', tone: 'error' as const }] }
      }
      setBusy(false)

      if (result.clear) {
        setEntries([])
      } else if (isAsync) {
        // replace the spinner entry
        setEntries((e) =>
          e.map((ent) =>
            ent.id === spinnerId ? { ...ent, lines: result.lines } : ent
          )
        )
      } else {
        pushOutput(echoInput, result.lines)
      }

      if (result.copy) {
        try {
          await navigator.clipboard.writeText(result.copy)
        } catch {
          /* clipboard blocked — the value is still printed above */
        }
      }
      if (result.setAccent) applyAccent(result.setAccent)
      if (result.openUrl) window.open(result.openUrl, '_blank', 'noopener')
      if (result.navigate) {
        router.push(result.navigate)
        onRequestClose?.()
      }
      if (result.startGame) {
        const hard = args.includes('--hard')
        await startGame(result.startGame, hard)
      }

      // chained command (sudo hire → contact)
      const chain = chainAfter(raw)
      if (chain) await runCommand(chain, false)
    },
    [history, ctx, reduced, pushOutput, applyAccent, router, onRequestClose, startGame, hintDismissed]
  )

  // ── Completion: ghost + tab ────────────────────────────────────────────────
  const ghost = useMemo(() => {
    const d = draft
    if (!d || d.includes(' ')) return ''
    const lower = d.toLowerCase()
    const match = COMMAND_WORDS.find((w) => w.startsWith(lower) && w !== lower)
    return match ? match.slice(d.length) : ''
  }, [draft])

  const tabComplete = useCallback(() => {
    if (draft.includes(' ')) return // arg completion handled by ghost/explicit later
    const lower = draft.toLowerCase()
    const matches = COMMAND_WORDS.filter((w) => w.startsWith(lower))
    if (matches.length === 1) {
      setDraft(matches[0] + ' ')
    } else if (matches.length > 1) {
      // longest common prefix
      let prefix = matches[0]
      for (const m of matches) {
        while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1)
      }
      setDraft(prefix)
      pushOutput(undefined, [{ text: matches.join('  '), tone: 'muted' }])
    }
  }, [draft, pushOutput])

  // Reverse-search match (most-recent first) for the current rsearch query.
  const rsearchMatch = useMemo(() => {
    if (rsearch === null || !rsearch) return ''
    const q = rsearch.toLowerCase()
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].toLowerCase().includes(q)) return history[i]
    }
    return ''
  }, [rsearch, history])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // ── Reverse-search mode intercepts everything ──────────────────────────
      if (rsearch !== null) {
        if (e.key === 'Escape') {
          e.preventDefault()
          setRsearch(null)
          return
        }
        if (e.key === 'Enter') {
          e.preventDefault()
          const match = rsearchMatch
          setRsearch(null)
          if (match) {
            setDraft('')
            void runCommand(match)
          }
          return
        }
        if (e.key === 'Backspace') {
          e.preventDefault()
          setRsearch((s) => (s ? s.slice(0, -1) : ''))
          return
        }
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
          e.preventDefault()
          setRsearch((s) => (s ?? '') + e.key)
          return
        }
        // ignore other keys while searching
        if (e.key !== 'r' || !(e.ctrlKey || e.metaKey)) return
      }

      // ── Readline control keys ──────────────────────────────────────────────
      if (e.ctrlKey || e.metaKey) {
        const k = e.key.toLowerCase()
        if (k === 'l') {
          e.preventDefault()
          setEntries([])
          return
        }
        if (k === 'u') {
          e.preventDefault()
          setDraft('')
          return
        }
        if (k === 'c') {
          // Don't hijack copy when text is selected.
          const sel = window.getSelection()
          if (sel && sel.type === 'Range' && !sel.isCollapsed) return
          e.preventDefault()
          pushOutput(draft ? `▸ ${draft}` : undefined, [{ text: '^C', tone: 'muted' }])
          setDraft('')
          setHistIdx(null)
          return
        }
        if (k === 'r') {
          e.preventDefault()
          setRsearch(draft) // seed with current draft
          return
        }
        // let ⌘K and other global shortcuts bubble
      }

      // konami detection at empty prompt
      konamiRef.current = [...konamiRef.current, e.key].slice(-KONAMI.length)
      if (
        draft === '' &&
        konamiRef.current.length === KONAMI.length &&
        konamiRef.current.every(
          (k, i) => k.toLowerCase() === KONAMI[i].toLowerCase()
        )
      ) {
        konamiRef.current = []
        void runCommand('konami', false)
        return
      }

      // Block command submission while a fetch is in flight (input stays mounted
      // and focused; we just ignore the queued action).
      if (busy && (e.key === 'Enter' || e.key === 'Tab')) {
        e.preventDefault()
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        const val = draft
        setDraft('')
        void runCommand(val)
        return
      }
      if (e.key === 'Tab') {
        e.preventDefault()
        if (ghost) setDraft(draft + ghost + ' ')
        else tabComplete()
        return
      }
      if (e.key === 'ArrowRight' && ghost) {
        const el = e.currentTarget
        if (el.selectionStart === draft.length) {
          e.preventDefault()
          setDraft(draft + ghost + ' ')
        }
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (!history.length) return
        // Prefix-search: if the draft is non-empty and we're starting a walk,
        // only step through history entries that start with it (zsh-style).
        if (histIdx === null && draft) {
          const prefix = draft.toLowerCase()
          for (let i = history.length - 1; i >= 0; i--) {
            if (history[i].toLowerCase().startsWith(prefix) && history[i] !== draft) {
              setPendingDraft(draft)
              setHistIdx(i)
              setDraft(history[i])
              return
            }
          }
          return
        }
        if (histIdx === null) {
          setPendingDraft(draft)
          setHistIdx(history.length - 1)
          setDraft(history[history.length - 1])
        } else if (histIdx > 0) {
          setHistIdx(histIdx - 1)
          setDraft(history[histIdx - 1])
        }
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (histIdx === null) return
        if (histIdx < history.length - 1) {
          setHistIdx(histIdx + 1)
          setDraft(history[histIdx + 1])
        } else {
          setHistIdx(null)
          setDraft(pendingDraft)
        }
        return
      }
      if (e.key === 'Escape' && variant === 'overlay') {
        onRequestClose?.()
      }
    },
    [
      draft,
      ghost,
      history,
      histIdx,
      pendingDraft,
      runCommand,
      tabComplete,
      variant,
      onRequestClose,
      busy,
      rsearch,
      rsearchMatch,
      pushOutput,
    ]
  )

  const onRun = useCallback(
    (command: string) => {
      inputRef.current?.focus({ preventScroll: true })
      void runCommand(command)
    },
    [runCommand]
  )

  // Type-anywhere: if a printable key is pressed while focus is loose inside the
  // terminal (e.g. after clicking output), route it to the prompt. The
  // authoritative refocus effect handles most cases; this covers the gap where
  // focus is on a non-input child and the user just starts typing.
  const onRootKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (activeGame) return
      if (document.activeElement === inputRef.current) return
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        inputRef.current?.focus({ preventScroll: true })
      }
    },
    [activeGame]
  )

  return (
    <div
      ref={rootRef}
      className={
        'relative flex flex-col font-mono text-xs ' +
        (crt ? 'hud-crt ' : '') +
        (variant === 'overlay' ? 'h-full' : '')
      }
      onMouseUp={() => {
        const sel = window.getSelection()
        if (sel && sel.type === 'Range' && !sel.isCollapsed) return
        if (activeGame) return
        inputRef.current?.focus({ preventScroll: true })
      }}
      onKeyDown={onRootKeyDown}
    >
      <div
        ref={scrollRef}
        className={
          'flex-1 space-y-1 overflow-y-auto overscroll-contain pr-1 ' +
          (variant === 'overlay'
            ? 'min-h-[200px] max-h-[min(60vh,520px)]'
            : 'min-h-[120px] max-h-[280px]')
        }
        aria-live="polite"
        aria-atomic="false"
      >
        {entries.map((entry) => (
          <div key={entry.id} className="space-y-0.5">
            {entry.input !== undefined && (
              <p className="whitespace-pre-wrap text-ink-muted">
                <span className="text-accent">▸</span> {entry.input}
              </p>
            )}
            {entry.lines.map((l, i) => (
              <LineView key={i} line={l} onRun={onRun} />
            ))}
          </div>
        ))}

        {activeGame &&
          (activeGame.kind === 'crack' ? (
            (() => {
              const Comp = activeGame.Comp as ComponentType<CrackProps>
              return (
                <Comp
                  hard={activeGame.hard}
                  onExit={(summary) => {
                    setActiveGame(null)
                    pushOutput(undefined, [
                      { text: `${summary} · 'play' again?`, tone: 'muted', runs: [{ token: 'play', command: 'play' }] },
                    ])
                    inputRef.current?.focus({ preventScroll: true })
                  }}
                />
              )
            })()
          ) : activeGame.kind === 'bigo' ? (
            (() => {
              const Comp = activeGame.Comp as ComponentType<BigoProps>
              return (
                <Comp
                  onExit={(summary) => {
                    setActiveGame(null)
                    pushOutput(undefined, [
                      { text: `${summary} · 'play' again?`, tone: 'muted', runs: [{ token: 'play', command: 'play' }] },
                    ])
                    inputRef.current?.focus({ preventScroll: true })
                  }}
                />
              )
            })()
          ) : (
            (() => {
              const Comp = activeGame.Comp as ComponentType<PlayProps>
              return (
                <Comp
                  reduced={reduced}
                  onExit={(summary) => {
                    setActiveGame(null)
                    pushOutput(undefined, [
                      { text: `${summary} · 'play' again?`, tone: 'muted', runs: [{ token: 'play', command: 'play' }] },
                    ])
                    inputRef.current?.focus({ preventScroll: true })
                  }}
                />
              )
            })()
          ))}
      </div>

      {/* Prompt row is ALWAYS mounted (hidden, not unmounted, during a game) so
          focus and the mobile keyboard survive the whole async command cycle. */}
      <div
        className={
          'mt-2 flex items-center gap-2 border-t border-ink-border/60 pt-2 ' +
          (activeGame ? 'hidden' : '')
        }
      >
        <span className="text-accent">
          {rsearch !== null ? '(r-search)' : '▸'}
        </span>
        <div className="relative flex-1">
          {rsearch !== null ? (
            <p className="whitespace-pre-wrap text-ink-muted">
              {`'${rsearch}': `}
              <span className="text-ink-text">{rsearchMatch || '(no match)'}</span>
            </p>
          ) : (
            <>
              {/* ghost suffix overlay */}
              {ghost && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 whitespace-pre text-ink-border"
                >
                  {draft}
                  {ghost}
                </span>
              )}
              {/* blinking caret rendered after the draft */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 whitespace-pre text-accent"
                style={{ left: `${draft.length}ch` }}
              >
                <span className="animate-caret-blink motion-reduce:animate-none">
                  █
                </span>
              </span>
            </>
          )}
          <input
            ref={inputRef}
            value={rsearch !== null ? '' : draft}
            onChange={(e) => {
              if (busy || rsearch !== null) return
              setDraft(e.target.value)
            }}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            aria-label="Terminal input"
            aria-busy={busy}
            className={
              'relative w-full bg-transparent text-ink-text caret-transparent outline-none ' +
              (rsearch !== null ? 'pointer-events-none opacity-0' : '')
            }
          />
        </div>
        {busy && (
          <span className="text-ink-muted" aria-hidden>
            {reduced ? '…' : SPINNER[spinFrame]}
          </span>
        )}
      </div>

      {!hintDismissed && variant === 'inline' && (
        <p className="mt-2 text-[11px] text-ink-muted">
          type{' '}
          <button onClick={() => onRun('help')} className="text-accent hover:underline">
            help
          </button>{' '}
          or press ⌘K · try{' '}
          <button onClick={() => onRun('sudo hire')} className="text-gold hover:underline">
            sudo hire
          </button>{' '}
          ·{' '}
          <button onClick={() => onRun('play')} className="text-accent hover:underline">
            play
          </button>{' '}
          a game
        </p>
      )}
    </div>
  )
}
