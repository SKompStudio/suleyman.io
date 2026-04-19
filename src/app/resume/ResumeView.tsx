'use client'

import type {
  ResumeDocument,
  ResumeExperience,
  ResumeEducation,
  ResumeSkill,
  ResumeCertification,
} from '@prisma/client'
import { FiArrowUpRight, FiDownload, FiPrinter } from 'react-icons/fi'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'

type Props = {
  doc: ResumeDocument | null
  experiences: ResumeExperience[]
  educations: ResumeEducation[]
  skills: ResumeSkill[]
  certifications: ResumeCertification[]
}

function formatDateRange(start: string, end: string | null, current: boolean) {
  if (current) return `${start} — Present`
  if (end) return `${start} — ${end}`
  return start
}

function groupSkills(skills: ResumeSkill[]) {
  const groups = new Map<string, ResumeSkill[]>()
  for (const s of skills) {
    const g = groups.get(s.category) ?? []
    g.push(s)
    groups.set(s.category, g)
  }
  return Array.from(groups.entries())
}

export function ResumeView({ doc, experiences, educations, skills, certifications }: Props) {
  const hasAnyContent =
    experiences.length + educations.length + skills.length + certifications.length > 0 ||
    (doc?.summary && doc.summary.trim().length > 0)
  const hasPdf = Boolean(doc?.pdfUrl)

  if (!hasAnyContent && !hasPdf) {
    return (
      <div className="mx-auto mt-32 max-w-2xl px-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Resume</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          The resume is being updated. Check back shortly.
        </p>
      </div>
    )
  }

  // PDF uploaded but no structured content yet → render an embedded PDF view.
  if (hasPdf && !hasAnyContent) {
    return <PdfOnlyView doc={doc!} />
  }

  const skillGroups = groupSkills(skills)
  const updatedAt = doc?.updatedAt ? new Date(doc.updatedAt) : null

  return (
    <div className="print-root mx-auto my-12 max-w-5xl px-4 sm:px-6 lg:px-8 print:my-0 print:max-w-none print:px-0">
      {/* Actions bar */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {doc?.title ?? 'Resume'}
          </h1>
          {updatedAt && (
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
              Updated {updatedAt.toLocaleDateString('en', { month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasPdf && (
            <a
              href={doc!.pdfUrl!}
              download
              className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              <FiDownload className="h-4 w-4" />
              Download PDF
            </a>
          )}
          <button
            onClick={() => typeof window !== 'undefined' && window.print()}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <FiPrinter className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      {/* Header / summary */}
      <header className="mb-10 print:mb-6">
        <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 print:text-3xl">
          {doc?.title && doc.title !== 'Resume' ? doc.title : 'Suleyman Kiani'}
        </h2>
        {doc?.subtitle && (
          <p className="mt-1 text-lg text-zinc-600 dark:text-zinc-400 print:text-base">
            {doc.subtitle}
          </p>
        )}
        {(doc?.location || doc?.email || doc?.phone) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {doc.location && <span>{doc.location}</span>}
            {doc.email && (
              <a href={`mailto:${doc.email}`} className="hover:text-teal-600 dark:hover:text-teal-400">
                {doc.email}
              </a>
            )}
            {doc.phone && <span>{doc.phone}</span>}
          </div>
        )}
        {doc?.summary && (
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300 print:text-sm">
            {doc.summary}
          </p>
        )}
      </header>

      {/* Two-column grid: left rail (skills/education/certs), main (experience) */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 print:grid-cols-3 print:gap-6">
        {/* MAIN: experience */}
        <section className="lg:col-span-2 print:col-span-2">
          {experiences.length > 0 && (
            <>
              <SectionHeading>Experience</SectionHeading>
              <div className="space-y-8 print:space-y-4">
                {experiences.map((exp) => (
                  <article
                    key={exp.id}
                    className="border-l-2 border-teal-500 pl-5 print:pl-3"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="text-[17px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 print:text-[15px]">
                        {exp.role}
                      </h3>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {exp.companyUrl ? (
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-zinc-700 hover:text-teal-600 dark:text-zinc-300 dark:hover:text-teal-400"
                        >
                          {exp.company}
                          <FiArrowUpRight className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">{exp.company}</span>
                      )}
                      {exp.location && (
                        <>
                          <span className="text-zinc-400">·</span>
                          <span>{exp.location}</span>
                        </>
                      )}
                    </div>
                    {exp.bullets.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-[14.5px] leading-relaxed text-zinc-700 dark:text-zinc-300 print:text-[12.5px]">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="relative pl-4 before:absolute before:left-0 before:top-[0.55em] before:h-1 before:w-1 before:rounded-full before:bg-teal-500">
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                    {exp.tech.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-x-0 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                        {exp.tech.map((t, i) => (
                          <span key={t}>
                            {t}
                            {i < exp.tech.length - 1 && <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">·</span>}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {/* LEFT RAIL: skills + education + certs */}
        <aside className="space-y-10 print:space-y-4">
          {skillGroups.length > 0 && (
            <div>
              <SectionHeading>Skills</SectionHeading>
              <div className="space-y-4">
                {skillGroups.map(([category, items]) => (
                  <div key={category}>
                    <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-600">
                      {category}
                    </div>
                    <div className="font-mono text-[12.5px] text-zinc-700 dark:text-zinc-300">
                      {items.map((s, i) => (
                        <span key={s.id}>
                          {s.name}
                          {i < items.length - 1 && <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">·</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {educations.length > 0 && (
            <div>
              <SectionHeading>Education</SectionHeading>
              <div className="space-y-4">
                {educations.map((e) => (
                  <div key={e.id}>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{e.degree}</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      {e.school}
                      {e.location && <span className="text-zinc-400"> · {e.location}</span>}
                    </div>
                    <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-wider text-zinc-400">
                      {formatDateRange(e.startDate, e.endDate, false)}
                    </div>
                    {e.details && (
                      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{e.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <SectionHeading>Certifications</SectionHeading>
              <ul className="space-y-3">
                {certifications.map((c) => (
                  <li key={c.id}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {c.credentialUrl ? (
                            <a
                              href={c.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400"
                            >
                              {c.name}
                              <FiArrowUpRight className="h-3 w-3" />
                            </a>
                          ) : (
                            c.name
                          )}
                        </div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-400">{c.issuer}</div>
                      </div>
                      {c.issuedAt && (
                        <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-wider text-zinc-400">
                          {c.issuedAt}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* Print CSS */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          header, footer, nav { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-root { margin: 0 !important; padding: 0.4in !important; }
          a { color: inherit !important; text-decoration: none !important; }
          .border-teal-500 { border-color: #0f766e !important; }
        }
      `}</style>
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 print:mb-2">
      {children}
    </h2>
  )
}

function PdfOnlyView({ doc }: { doc: ResumeDocument }) {
  const updatedAt = doc.pdfUploadedAt ? new Date(doc.pdfUploadedAt) : doc.updatedAt ? new Date(doc.updatedAt) : null

  return (
    <div className="mx-auto my-12 max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {doc.title || 'Resume'}
          </h1>
          {doc.subtitle && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{doc.subtitle}</p>
          )}
          {updatedAt && (
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
              Updated {updatedAt.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={doc.pdfUrl!}
            download
            className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            <FiDownload className="h-4 w-4" />
            Download PDF
          </a>
          <a
            href={doc.pdfUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <FiArrowUpRight className="h-4 w-4" />
            Open in new tab
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <object
          data={`${doc.pdfUrl}#view=FitH`}
          type="application/pdf"
          className="block h-[85vh] w-full"
          aria-label={doc.pdfFilename || 'Resume PDF'}
        >
          <div className="flex h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Your browser can&apos;t render the PDF inline — download it to view.
            </p>
            <a
              href={doc.pdfUrl!}
              download
              className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              <FiDownload className="h-4 w-4" />
              Download {doc.pdfFilename || 'resume.pdf'}
            </a>
          </div>
        </object>
      </div>
    </div>
  )
}
