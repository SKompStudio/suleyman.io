import { Container } from '@/components/Container'

// Server Component — no 'use client', no hooks, no data. Streams instantly as
// the route-segment fallback. Pure CSS animation; the global reduced-motion
// floor (tailwind.css) freezes all of it to a static final HUD state.
export default function Loading() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center">
      <div
        className="flex flex-col items-center"
        role="status"
        aria-label="Loading"
      >
        {/* Arc-reactor ring stage — fixed 96px box, never shifts. */}
        <div className="relative h-24 w-24">
          {/* Static dim track ring */}
          <div className="absolute inset-0 rounded-full border border-ink-border" />
          {/* Spinning cyan arc: a conic gradient masked to a ring via an inner
              cutout. transform: rotate only → GPU-cheap. */}
          <div
            className="absolute inset-0 rounded-full animate-boot-ring-spin motion-reduce:animate-none"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(91,200,255,0.9) 360deg)',
              WebkitMask:
                'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
            }}
          />
          {/* Core dot — arc-reactor center, soft pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="block h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(91,200,255,0.8)] animate-online-pulse motion-reduce:animate-none" />
          </div>
        </div>

        {/* Single cyan scanline sweep across a fixed-width track. */}
        <div className="relative mt-8 h-px w-56 overflow-hidden">
          <div
            className="h-px w-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(91,200,255,0.25), transparent)',
            }}
          />
          <div
            className="absolute inset-y-0 left-0 w-20 animate-boot-sweep motion-reduce:hidden"
            style={{
              background:
                'linear-gradient(90deg, transparent, #5BC8FF 50%, transparent)',
              boxShadow: '0 0 8px rgba(91,200,255,0.6)',
            }}
          />
        </div>

        {/* Three mono status lines, staggered resolve. Fixed height block so
            the stagger never reflows. */}
        <div className="mt-6 space-y-1.5 font-mono text-xs text-accent/80">
          <p className="animate-boot-line-in" style={{ animationDelay: '0ms' }}>
            <span className="text-ink-muted">›</span> initializing interface
          </p>
          <p
            className="animate-boot-line-in"
            style={{ animationDelay: '160ms' }}
          >
            <span className="text-ink-muted">›</span> mounting modules
          </p>
          <p
            className="animate-boot-line-in text-accent"
            style={{ animationDelay: '320ms' }}
          >
            <span className="animate-online-pulse motion-reduce:animate-none">
              ●
            </span>{' '}
            online
          </p>
        </div>
      </div>
    </Container>
  )
}
