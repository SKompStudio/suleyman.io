'use client'

import { useEffect, useRef } from 'react'

import { Terminal } from './Terminal'
import type { OutputLine } from './types'

interface CommandPaletteProps {
  onClose: () => void
  prefetch?: () => void
}

const GREETING: OutputLine[] = [
  { text: "suleyman.io ▸ command terminal. type 'help' or just say hi.", tone: 'accent' },
]

// LAZY overlay wrapper — dialog semantics, focus trap, ESC, scroll lock, and
// return-focus. Shares the Terminal engine + registry with the inline hero.
export default function CommandPalette({ onClose }: CommandPaletteProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<Element | null>(null)

  useEffect(() => {
    // capture the element that had focus when we opened, to restore on close
    triggerRef.current = document.activeElement
    // body scroll lock
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'

    return () => {
      html.style.overflow = prevOverflow
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus()
      }
    }
  }, [])

  // focus trap: keep Tab within the dialog
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const root = dialogRef.current
      if (!root) return
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Command terminal"
    >
      {/* backdrop */}
      <button
        aria-hidden
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        className="hud-brackets relative mt-[8vh] w-full max-w-2xl rounded-lg border border-accent/30 bg-ink-surface/95 p-4 shadow-2xl shadow-black/60 sm:mt-0"
      >
        <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-ink-muted">
          <span>
            <span className="text-accent">●</span> operator console
          </span>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-accent"
            aria-label="Close terminal"
          >
            esc ✕
          </button>
        </div>
        <Terminal variant="overlay" greeting={GREETING} onRequestClose={onClose} />
      </div>
    </div>
  )
}
