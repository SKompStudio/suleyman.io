'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import clsx from 'clsx'

type Props = {
  children: ReactNode
  className?: string
  /** stagger index, multiplied into a transition-delay */
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'header'
}

// Resume-local reveal: a scan-in on scroll, transform/opacity only, occupying
// its final layout box from frame 1 (no layout shift). Reduced-motion → instant
// final state. Mirrors the homepage Reveal but kept inside the resume island so
// shared components stay untouched.
export function ResumeReveal({ children, className, delay = 0, as = 'div' }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
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
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
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
        'translate-y-3 opacity-0 transition-[opacity,transform] duration-500 ease-out data-[shown]:translate-y-0 data-[shown]:opacity-100',
        className
      )}
    >
      {children}
    </Tag>
  )
}
