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
import { GAME_LOADERS, type CrackProps, type PlayProps } from './games'
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

  const [activeGame, setActiveGame] = useState<null | {
    kind: 'crack' | 'play'
    Comp: ComponentType<CrackProps> | ComponentType<PlayProps>
    hard?: boolean
  }>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
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

  // Autoscroll to bottom on new output.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries, activeGame])

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
    async (kind: 'crack' | 'play', hard?: boolean) => {
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

      const { command } = parse(raw)
      const echoInput = echo ? raw : undefined

      if (!command) {
        pushOutput(echoInput, [
          { text: `command not found: ${raw.split(/\s+/)[0]}. type 'help'.`, tone: 'error', runs: [{ token: 'help', command: 'help' }] },
        ])
        return
      }

      const { args } = parse(raw)
      const isAsync = command.run.constructor.name === 'AsyncFunction'
      let spinnerId = -1
      if (isAsync) {
        spinnerId = uid++
        setEntries((e) => [
          ...e,
          { id: spinnerId, input: echoInput, lines: [{ text: reduced ? '…' : '⠋ fetching …', tone: 'muted' }] },
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
        setEntries([
          { id: uid++, lines: [{ text: 'suleyman.io ▸ console cleared. type \'help\'.', tone: 'accent' }] },
        ])
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

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    [draft, ghost, history, histIdx, pendingDraft, runCommand, tabComplete, variant, onRequestClose]
  )

  const onRun = useCallback(
    (command: string) => {
      inputRef.current?.focus()
      void runCommand(command)
    },
    [runCommand]
  )

  const promptDisabled = busy || activeGame !== null

  return (
    <div
      className={
        'relative flex flex-col font-mono text-xs ' +
        (crt ? 'hud-crt ' : '') +
        (variant === 'overlay' ? 'h-full' : '')
      }
      onClick={() => !promptDisabled && inputRef.current?.focus()}
    >
      <div
        ref={scrollRef}
        className={
          'min-h-0 flex-1 space-y-1 overflow-y-auto pr-1 ' +
          (variant === 'overlay' ? 'max-h-[min(60vh,520px)]' : 'max-h-[280px]')
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
                      { text: `session ended · ${summary} · 'play' again?`, tone: 'muted', runs: [{ token: 'play', command: 'play' }] },
                    ])
                    inputRef.current?.focus()
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
                      { text: `session ended · ${summary} · 'play' again?`, tone: 'muted', runs: [{ token: 'play', command: 'play' }] },
                    ])
                    inputRef.current?.focus()
                  }}
                />
              )
            })()
          ))}
      </div>

      {!promptDisabled && (
        <div className="mt-2 flex items-center gap-2 border-t border-ink-border/60 pt-2">
          <span className="text-accent">▸</span>
          <div className="relative flex-1">
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
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              aria-label="Terminal input"
              className="relative w-full bg-transparent text-ink-text caret-transparent outline-none"
            />
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
          </div>
        </div>
      )}

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
