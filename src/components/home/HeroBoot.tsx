'use client'

import { useEffect, useState } from 'react'

// One-shot "system online" boot enhancement that sits ON TOP of the already-
// painted, server-rendered LCP headline (it never animates the headline from
// opacity:0). A thin cyan sweep crosses once (~700ms) and a mono status line
// resolves from `booting` to `online`. Reduced motion → instant final state,
// no sweep. Transform/opacity only.

const RESOLVED = 'system: online · operator: suleyman kiani'

export function HeroBoot() {
  const [reduced, setReduced] = useState(false)
  const [resolved, setResolved] = useState(false)
  const [swept, setSwept] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
      setResolved(true)
      return
    }
    // Resolve the status line just after the sweep clears.
    const t = window.setTimeout(() => setResolved(true), 620)
    const t2 = window.setTimeout(() => setSwept(true), 760)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(t2)
    }
  }, [])

  return (
    <div className="mt-7" aria-hidden>
      {/* Sweep track: 1px tall, fixed height, never shifts layout. */}
      <div className="relative h-px w-full max-w-xl overflow-hidden">
        <div
          className="h-px w-full"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(91,200,255,0.35), transparent)',
          }}
        />
        {!reduced && !swept && (
          <div
            className="absolute inset-y-0 left-0 w-24 animate-boot-sweep"
            style={{
              background:
                'linear-gradient(90deg, transparent, #5BC8FF 50%, transparent)',
              boxShadow: '0 0 8px rgba(91,200,255,0.6)',
            }}
          />
        )}
      </div>

      <p className="mt-3 font-mono text-xs text-accent/90">
        <span className="text-accent">●</span>{' '}
        <span
          className={
            resolved
              ? 'opacity-100 transition-opacity duration-300'
              : 'opacity-60'
          }
        >
          {resolved ? RESOLVED : 'system: booting'}
        </span>
      </p>
    </div>
  )
}
