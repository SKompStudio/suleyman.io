'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import clsx from 'clsx'

type RevealProps = {
  children: ReactNode
  className?: string
  /** stagger index, multiplied into a transition-delay */
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
}

export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
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
    ;(e.currentTarget as HTMLElement).style.willChange = 'auto'
  }

  const Tag = as as any

  return (
    <Tag
      ref={ref as any}
      data-shown={shown ? '' : undefined}
      onTransitionEnd={onTransitionEnd}
      style={{ transitionDelay: shown && delay ? `${delay * 70}ms` : undefined }}
      className={clsx(
        'translate-y-4 opacity-0 transition-[opacity,transform] duration-500 ease-out [will-change:transform,opacity] data-[shown]:translate-y-0 data-[shown]:opacity-100',
        className
      )}
    >
      {children}
    </Tag>
  )
}
