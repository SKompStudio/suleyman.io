'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image, { type StaticImageData } from 'next/image'
import clsx from 'clsx'

// Small client islands for the /about dossier. The page itself stays a Server
// Component; only the scroll-reveal and the one-shot portrait boot-scan need
// the client. All motion is transform/opacity with a reduced-motion floor.

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
}

// Mirrors the homepage Reveal: occupies its final layout box from frame 1
// (no layout shift), promotes to its own layer only while animating, and
// clears will-change on transitionend so GPU layers never pile up.
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.style.willChange = 'transform, opacity'
            setShown(true)
            obs.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const onTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target === ref.current) {
      ;(e.currentTarget as HTMLElement).style.willChange = 'auto'
    }
  }

  const Tag = as as any

  return (
    <Tag
      ref={ref as any}
      data-shown={shown ? '' : undefined}
      onTransitionEnd={onTransitionEnd}
      style={{ transitionDelay: shown && delay ? `${delay * 70}ms` : undefined }}
      className={clsx(
        'translate-y-4 opacity-0 transition-[opacity,transform] duration-500 ease-out data-[shown]:translate-y-0 data-[shown]:opacity-100',
        className
      )}
    >
      {children}
    </Tag>
  )
}

// The signature element: an "operator ID" portrait. A thin cyan HUD panel with
// corner brackets, a soft cyan radial glow, an overlaid live status chip, and a
// one-shot cyan scan sweep that crosses the portrait once on mount — JARVIS
// pulling up the operator's profile. Reduced motion → no sweep, static frame.
export function OperatorPortrait({ image }: { image: StaticImageData }) {
  const [scan, setScan] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const t = setTimeout(() => setScan(true), 220)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="hud-brackets relative max-w-xs rounded-xl border border-accent/25 bg-ink-surface/40 p-3 sm:max-w-sm">
      <div className="hud-glow pointer-events-none absolute inset-0 rounded-xl" aria-hidden />

      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/40">
        {/* Operator header strip */}
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <span className="font-mono text-[11px] text-accent/80">operator.id</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-accent">
            <span aria-hidden className="hud-pulse animate-online-pulse">
              ●
            </span>
            online
          </span>
        </div>

        <div className="relative aspect-square w-full">
          <Image
            src={image}
            alt="Suleyman Kiani"
            sizes="(min-width: 1024px) 24rem, 80vw"
            placeholder="blur"
            className="object-cover"
            fill
          />

          {/* Corner reticle marks */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-accent/50"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-accent/50"
          />

          {/* One-shot cyan scan sweep across the portrait on mount. Reuses the
              shared boot-sweep keyframe (transform translateX, one-shot). */}
          <span
            aria-hidden
            className={clsx(
              'pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-accent/30 to-transparent',
              scan && 'animate-boot-sweep'
            )}
            style={{ opacity: 0 }}
          />
        </div>

        {/* Identity readout footer */}
        <dl className="grid grid-cols-1 gap-y-1.5 border-t border-white/10 px-3 py-3 font-mono text-[11px]">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-accent/70">role</dt>
            <dd className="text-right text-ink-text">engineer · equipment finance</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-accent/70">location</dt>
            <dd className="text-right text-ink-text">Ontario, Canada</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-accent/70">status</dt>
            <dd className="text-right text-ink-text">shipping · funding · MEng</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
