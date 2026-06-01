'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import { Container } from '@/components/Container'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container className="flex min-h-[70vh] items-center justify-center">
      <div className="hud-brackets w-full max-w-lg border border-gold/30 bg-ink-surface/40 px-8 py-12 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
          <span className="animate-online-pulse motion-reduce:animate-none">
            ▲
          </span>{' '}
          system fault
        </p>

        <p className="mt-6 font-mono text-6xl font-bold tracking-tight text-gold sm:text-7xl">
          500
        </p>

        {/* Gold hairline + one-pass sweep */}
        <div className="relative mx-auto mt-6 h-px w-40 overflow-hidden">
          <div
            className="h-px w-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(232,184,75,0.3), transparent)',
            }}
          />
          <div
            className="absolute inset-y-0 left-0 w-16 animate-boot-sweep motion-reduce:hidden"
            style={{
              background:
                'linear-gradient(90deg, transparent, #E8B84B 50%, transparent)',
              boxShadow: '0 0 8px rgba(232,184,75,0.55)',
            }}
          />
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink-text">
          Subsystem error
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          An unexpected fault interrupted this view. You can re-run the segment
          or return to base.
        </p>

        {error?.digest && (
          <p className="mt-4 font-mono text-[11px] text-ink-muted/70">
            ref: {error.digest}
          </p>
        )}

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 border border-gold/50 px-4 py-2 font-mono text-xs text-gold transition-colors hover:bg-gold/10"
          >
            ↻ retry
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-ink-border px-4 py-2 font-mono text-xs text-ink-muted transition-colors hover:border-accent/40 hover:text-ink-text"
          >
            return to base →
          </Link>
        </div>
      </div>
    </Container>
  )
}
