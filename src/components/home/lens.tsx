'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'

export type Lens = 'fin' | 'eng' | 'both'

const LENS_KEY = 'lens'
const VALID: Lens[] = ['fin', 'eng', 'both']

type LensContextValue = {
  lens: Lens
  setLens: (next: Lens) => void
  ready: boolean
}

const LensContext = createContext<LensContextValue>({
  lens: 'both',
  setLens: () => {},
  ready: false,
})

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function LensProvider({ children }: { children: ReactNode }) {
  const [lens, setLensState] = useState<Lens>('both')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(LENS_KEY)
    if (stored && (VALID as string[]).includes(stored)) {
      setLensState(stored as Lens)
    }
    setReady(true)
  }, [])

  const setLens = useCallback((next: Lens) => {
    window.localStorage.setItem(LENS_KEY, next)

    const apply = () => setLensState(next)

    // Signature interaction: named-group View Transition where supported, a
    // CSS opacity/transform fallback everywhere else (iOS 16/17). Reduced
    // motion jumps straight to the final order.
    if (prefersReducedMotion()) {
      apply()
      return
    }

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => unknown
    }

    if (typeof doc.startViewTransition === 'function') {
      // Commit the reorder synchronously inside the VT callback so the
      // named groups capture before/after positions and FLIP/slide.
      doc.startViewTransition(() => {
        flushSync(apply)
      })
    } else {
      // Fallback: toggle a class that the reorderable elements transition on.
      const root = document.documentElement
      root.classList.add('lens-shifting')
      apply()
      window.setTimeout(() => root.classList.remove('lens-shifting'), 420)
    }
  }, [])

  return (
    <LensContext.Provider value={{ lens, setLens, ready }}>
      {children}
    </LensContext.Provider>
  )
}

export function useLens() {
  return useContext(LensContext)
}

// Ordering helpers. Each consumer receives a stable list of keys and asks the
// lens for the order. CSS `order` does the visual reorder (transform/opacity
// only, never height), so layout never shifts the IO root.
export function orderFor(lens: Lens, keys: readonly string[], ranks: Record<Lens, readonly string[]>) {
  const rank = ranks[lens]
  const indexOf = (k: string) => {
    const i = rank.indexOf(k)
    return i === -1 ? keys.length + keys.indexOf(k) : i
  }
  return keys.reduce<Record<string, number>>((acc, k) => {
    acc[k] = indexOf(k)
    return acc
  }, {})
}
