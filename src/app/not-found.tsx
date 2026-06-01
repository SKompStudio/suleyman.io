import Link from 'next/link'

import { Container } from '@/components/Container'

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center">
      <div className="hud-brackets w-full max-w-lg border border-ink-border bg-ink-surface/40 px-8 py-12 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-muted">
          <span className="text-gold">▲</span> signal lost
        </p>

        <p className="mt-6 font-mono text-6xl font-bold tracking-tight text-accent sm:text-7xl">
          404
        </p>

        {/* Hairline + one-pass cyan sweep under the code */}
        <div className="relative mx-auto mt-6 h-px w-40 overflow-hidden">
          <div
            className="h-px w-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(91,200,255,0.3), transparent)',
            }}
          />
          <div
            className="absolute inset-y-0 left-0 w-16 animate-boot-sweep motion-reduce:hidden"
            style={{
              background:
                'linear-gradient(90deg, transparent, #5BC8FF 50%, transparent)',
              boxShadow: '0 0 8px rgba(91,200,255,0.6)',
            }}
          />
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink-text">
          No route at these coordinates
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          The page you requested is off-grid or has been decommissioned.
        </p>

        <Link
          href="/"
          className="group mt-8 inline-flex items-center gap-2 border border-accent/40 px-4 py-2 font-mono text-xs text-accent transition-colors hover:bg-accent/10"
        >
          <span className="animate-online-pulse motion-reduce:animate-none">
            ●
          </span>
          return to base
          <span className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </Container>
  )
}
