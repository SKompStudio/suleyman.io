'use client'

import { useEffect, useState } from 'react'

// Single source of truth for the motion floor, shared by boot/overlay/hero.
// Server renders the "motion-on" default; client narrows after mount to avoid
// a hydration mismatch. (The CSS global floor still hard-kills animation under
// reduced motion regardless; this is for JS-driven typing/spinner behaviour.)
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
