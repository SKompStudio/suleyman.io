'use client'

import clsx from 'clsx'
import Link from 'next/link'

export type ProjectRecordData = {
  key: string
  path: string
  href: string
  status?: 'live' | 'private'
  statusLabel?: string
  outcome: string
  detail: string
  tech: string[]
  hover?: string
  diagram?: boolean
}

function DealFlowDiagram() {
  const steps = ['order', 'validate', 'credit', 'event-bus', 'fund', 'ledger']
  return (
    <svg
      viewBox="0 0 720 48"
      role="img"
      aria-label="order to validate to credit to event-bus to fund to ledger"
      className="mt-4 w-full max-w-2xl"
    >
      {steps.map((label, i) => {
        const x = i * 120
        return (
          <g key={label}>
            <rect
              x={x}
              y={12}
              width={96}
              height={24}
              rx={4}
              className="fill-transparent stroke-accent/50"
              strokeWidth={1}
            />
            <text
              x={x + 48}
              y={28}
              textAnchor="middle"
              className="fill-zinc-600 font-mono text-[11px] dark:fill-ink-muted"
            >
              {label}
            </text>
            {i < steps.length - 1 && (
              <path
                d={`M${x + 96} 24 L${x + 120} 24`}
                className="stroke-accent/50"
                strokeWidth={1}
                markerEnd="url(#arrow)"
              />
            )}
          </g>
        )
      })}
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" className="fill-accent/60" />
        </marker>
      </defs>
    </svg>
  )
}

export function ProjectRecord({
  data,
  className,
}: {
  data: ProjectRecordData
  className?: string
}) {
  return (
    <Link
      href={data.href}
      target={data.href.startsWith('http') ? '_blank' : undefined}
      rel={data.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      style={{ viewTransitionName: `project-${data.key}` }}
      className={clsx(
        'group flex h-full flex-col rounded-lg border border-zinc-200 bg-white/40 p-6 transition-colors hover:border-accent/40 dark:border-ink-border dark:bg-ink-surface/40 dark:hover:border-accent/50',
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-sm text-zinc-900 dark:text-ink-text">{data.path}</span>
        {data.status === 'live' ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-signal">
            <span aria-hidden className="text-signal">
              ●
            </span>
            live
          </span>
        ) : data.statusLabel ? (
          <span className="font-mono text-xs text-zinc-400 dark:text-ink-muted">
            {data.statusLabel}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-base text-zinc-700 dark:text-zinc-300">{data.outcome}</p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-ink-muted">{data.detail}</p>

      {data.diagram && <DealFlowDiagram />}

      <div className="mt-auto pt-5">
        <div className="font-mono text-xs text-zinc-400 dark:text-ink-muted">
          {data.tech.join(' · ')}
        </div>
        {data.hover && (
          <div className="mt-2 font-mono text-xs text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:opacity-100">
            {data.hover}
          </div>
        )}
      </div>
    </Link>
  )
}
