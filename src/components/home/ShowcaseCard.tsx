'use client'

import { useRef, useState } from 'react'
import Image, { type StaticImageData } from 'next/image'

export type ShowcaseData = {
  key: string
  href: string
  url: string
  title: string
  outcome: string
  detail: string
  tech: string[]
  image: StaticImageData
  warm?: boolean
}

// Minimal browser frame + screenshot. Desktop hover: subtle scale(1.02), a few
// degrees of cursor-driven tilt, and a soft cyan edge glow. Mobile: static,
// fully legible, no tilt (pointer-driven only, so touch never triggers it).
export function ShowcaseCard({ data, warm }: { data: ShowcaseData; warm: boolean }) {
  const ref = useRef<HTMLAnchorElement | null>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false })

  const accent = warm ? 'rgba(230,217,184,0.5)' : 'rgba(91,200,255,0.55)'

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ rx: py * -4, ry: px * 4, active: true })
  }

  const onLeave = () => setTilt({ rx: 0, ry: 0, active: false })

  return (
    <a
      ref={ref}
      href={data.href}
      target="_blank"
      rel="noopener noreferrer"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ viewTransitionName: `project-${data.key}` }}
      className="group block [perspective:1200px]"
    >
      <div
        className="overflow-hidden rounded-xl border border-white/10 bg-ink-surface/60 transition-[transform,box-shadow,border-color] duration-300 ease-out group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
        style={{
          transform: tilt.active
            ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
            : undefined,
          boxShadow: tilt.active ? `0 0 0 1px ${accent}, 0 20px 50px -20px ${accent}` : undefined,
        }}
      >
        {/* Browser chrome bar */}
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-2 truncate font-mono text-[11px] text-ink-muted">
            {data.url}
          </span>
        </div>

        {/* Screenshot — explicit dimensions, no layout shift */}
        <div className="relative aspect-[16/10] w-full bg-black/30">
          <Image
            src={data.image}
            alt={`${data.title} screenshot`}
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover object-top"
            placeholder="blur"
          />
        </div>
      </div>

      <div className="px-1 pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-sm text-ink-text">{data.title}</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-accent">
            <span aria-hidden>●</span>live
          </span>
        </div>
        <p className="mt-2 text-base text-zinc-300">{data.outcome}</p>
        <p className="mt-1 text-sm text-ink-muted">{data.detail}</p>
        <div className="mt-3 font-mono text-xs text-ink-muted">
          {data.tech.join(' · ')}
        </div>
      </div>
    </a>
  )
}
