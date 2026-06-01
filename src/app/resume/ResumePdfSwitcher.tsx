'use client'

import { useState } from 'react'
import { FiDownload, FiArrowUpRight } from 'react-icons/fi'

export type ResumeVariant = {
  id: string
  label: string
  file: string
  caption: string
}

// Static variants — the three compiled PDFs live in public/, independent of the
// single DB pdfUrl. The switcher selects, embeds, downloads, and opens each.
export const RESUME_VARIANTS: ResumeVariant[] = [
  {
    id: '1page',
    label: '1-page',
    file: '/resume-1page.pdf',
    caption: 'Tightest cut: the default one-page scan for fast review.',
  },
  {
    id: '2page',
    label: '2-page',
    file: '/resume-2page.pdf',
    caption: 'Fuller detail: extended bullets, projects, and stack depth.',
  },
  {
    id: 'finance',
    label: 'finance-first',
    file: '/resume-finance.pdf',
    caption: 'Finance-first framing for credit, structuring, and AM roles.',
  },
]

export function ResumePdfSwitcher() {
  const [activeId, setActiveId] = useState(RESUME_VARIANTS[0].id)
  const active = RESUME_VARIANTS.find((v) => v.id === activeId) ?? RESUME_VARIANTS[0]

  return (
    <div className="hud-brackets rounded-xl border border-accent/25 bg-ink-surface/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-sm text-ink-text">
          <span className="text-accent">~/resume</span>
          <span className="ml-3 text-xs text-ink-muted">document variants</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={active.file}
            download
            className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-xs text-accent transition-colors hover:bg-accent/20"
          >
            <FiDownload className="h-3.5 w-3.5" />
            download
          </a>
          <a
            href={active.file}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-ink-border bg-ink-surface/60 px-3 py-1.5 font-mono text-xs text-ink-muted transition-colors hover:border-accent/40 hover:text-ink-text"
          >
            <FiArrowUpRight className="h-3.5 w-3.5" />
            open
          </a>
        </div>
      </div>

      {/* Segmented control */}
      <div
        role="tablist"
        aria-label="Resume variants"
        className="mt-4 inline-flex flex-wrap gap-1 rounded-lg border border-ink-border bg-ink-bg/60 p-1"
      >
        {RESUME_VARIANTS.map((v) => {
          const selected = v.id === activeId
          return (
            <button
              key={v.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(v.id)}
              className={
                'rounded-md px-3.5 py-1.5 font-mono text-xs transition-colors ' +
                (selected
                  ? 'bg-accent/15 text-accent shadow-[inset_0_0_0_1px_rgba(91,200,255,0.4)]'
                  : 'text-ink-muted hover:text-ink-text')
              }
            >
              {v.label}
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{active.caption}</p>

      {/* Inline embed — switches with the active tab */}
      <div className="mt-4 overflow-hidden rounded-lg border border-ink-border bg-ink-bg/80">
        <object
          key={active.file}
          data={`${active.file}#view=FitH`}
          type="application/pdf"
          className="block h-[78vh] w-full"
          aria-label={`${active.label} resume PDF`}
        >
          <div className="flex h-[40vh] flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-sm text-ink-muted">
              Your browser can&apos;t render the PDF inline. Download or open it instead.
            </p>
            <a
              href={active.file}
              download
              className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-xs text-accent hover:bg-accent/20"
            >
              <FiDownload className="h-4 w-4" />
              download {active.label}
            </a>
          </div>
        </object>
      </div>
    </div>
  )
}
