'use client'

import { useSyncExternalStore } from 'react'

// EAGER store (no UI, no registry, no data). A tiny module-level boolean +
// ⌘K/Ctrl-K listener. Everything heavy is dynamic-imported by the consumer when
// `open` flips true. Implemented with useSyncExternalStore so it's zustand-free.

type Listener = () => void

let open = false
const listeners = new Set<Listener>()
let prefetched = false
let prefetcher: (() => void) | null = null

function emit() {
  for (const l of listeners) l()
}

function subscribe(l: Listener) {
  listeners.add(l)
  return () => listeners.delete(l)
}

function getSnapshot() {
  return open
}

function getServerSnapshot() {
  return false
}

export function openPalette() {
  if (!open) {
    open = true
    emit()
  }
}

export function closePalette() {
  if (open) {
    open = false
    emit()
  }
}

export function togglePalette() {
  open = !open
  emit()
}

// Consumers (the chip) register a prefetch fn; we fire it once on first intent
// so the dynamic chunk is resident before the actual open → instant paint.
export function registerPrefetch(fn: () => void) {
  prefetcher = fn
}

export function prefetchEngine() {
  if (prefetched) return
  prefetched = true
  prefetcher?.()
}

export function useCommandPalette() {
  const isOpen = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  return { isOpen, open: openPalette, close: closePalette, toggle: togglePalette }
}

// ── Platform detection (memoized once, client-only) ──────────────────────────

let cachedIsMac: boolean | null = null

export function detectIsMac(): boolean {
  if (cachedIsMac !== null) return cachedIsMac
  if (typeof navigator === 'undefined') return false
  const uaData = (navigator as unknown as { userAgentData?: { platform?: string } })
    .userAgentData
  const platform = uaData?.platform || navigator.platform || ''
  cachedIsMac = /mac/i.test(platform)
  return cachedIsMac
}

export function hasFinePointer(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return true
  return window.matchMedia('(pointer: fine)').matches
}

// ── Global ⌘K / Ctrl-K listener (installed once, idempotent) ─────────────────

let listenerInstalled = false

export function installGlobalShortcut() {
  if (listenerInstalled || typeof window === 'undefined') return
  listenerInstalled = true

  const onKeyDown = (e: KeyboardEvent) => {
    // Prefetch on first modifier press (intent), before the actual combo.
    if (e.metaKey || e.ctrlKey) prefetchEngine()
    const k = e.key.toLowerCase()
    if (k === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      togglePalette()
    }
  }

  window.addEventListener('keydown', onKeyDown)
}
