'use client'

import Link from 'next/link'
import { Reveal } from '@/components/home/Reveal'
import { formatDate } from '@/lib/formatDate'

type Props = {
  slug: string
  title: string
  description: string
  date: string
  index: number
  total: number
  delay: number
}

// A JARVIS archive record: mono index + date on the left rail, title + one-line
// description as the payload, a mono `read →` cue. Subtle hover lift via a faint
// cyan edge — transform/opacity only.
export function ArticleRecord({
  slug,
  title,
  description,
  date,
  index,
  total,
  delay,
}: Props) {
  const ord = String(total - index).padStart(2, '0')

  return (
    <Reveal as="article" delay={delay}>
      <Link
        href={`/articles/${slug}`}
        className="group relative block rounded-lg border border-ink-border/70 bg-ink-surface/30 px-5 py-5 transition-colors duration-300 hover:border-accent/40 sm:px-7 sm:py-6"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-px bg-accent/0 transition-colors duration-300 group-hover:bg-accent/60"
        />
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-6">
          <div className="flex shrink-0 items-baseline gap-3 font-mono text-xs text-ink-muted sm:w-44 sm:flex-col sm:gap-1">
            <span className="text-accent/60">REC-{ord}</span>
            <time dateTime={date} className="tabular-nums">
              {formatDate(date)}
            </time>
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-ink-text transition-colors duration-300 group-hover:text-accent">
              {title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              {description}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-accent/70 transition-colors duration-300 group-hover:text-accent">
              read
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}
