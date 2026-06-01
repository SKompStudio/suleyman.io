import type {
  ResumeDocument,
  ResumeExperience,
  ResumeEducation,
  ResumeSkill,
  ResumeCertification,
} from '@prisma/client'
import { FiArrowUpRight } from 'react-icons/fi'
import { ResumeReveal } from './ResumeReveal'
import { ResumePdfSwitcher } from './ResumePdfSwitcher'

type Props = {
  doc: ResumeDocument | null
  experiences: ResumeExperience[]
  educations: ResumeEducation[]
  skills: ResumeSkill[]
  certifications: ResumeCertification[]
}

function formatDateRange(start: string, end: string | null, current: boolean) {
  if (current) return `${start} - present`
  if (end) return `${start} - ${end}`
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

// A+ (or A) grades get the cyan highlight in the education ledger. We detect a
// leading "GRADE — rest" shape in the details lines; anything else renders plain.
function parseGradeLine(line: string): { grade: string | null; rest: string } {
  const m = line.match(/^\s*(A\+|A|A-)\s*[—–\-:]\s*(.+)$/)
  if (m) return { grade: m[1], rest: m[2].trim() }
  return { grade: null, rest: line.trim() }
}

export function ResumeView({ doc, experiences, educations, skills, certifications }: Props) {
  const hasAnyContent =
    experiences.length + educations.length + skills.length + certifications.length > 0 ||
    Boolean(doc?.summary && doc.summary.trim().length > 0)

  if (!hasAnyContent) {
    return (
      <div className="mx-auto mt-32 max-w-2xl px-4 text-center">
        <h1 className="font-mono text-3xl font-semibold tracking-tight text-ink-text">~/resume</h1>
        <p className="mt-4 text-ink-muted">The resume is being updated. Check back shortly.</p>
      </div>
    )
  }

  const skillGroups = groupSkills(skills)
  const updatedAt = doc?.updatedAt ? new Date(doc.updatedAt) : null
  const name = doc?.title && doc.title !== 'Resume' ? doc.title : 'Suleyman Kiani'

  return (
    <div className="relative mx-auto my-12 max-w-5xl px-4 sm:px-6 lg:px-8">
      {/* Ambient HUD glow behind the header — single soft cyan radial, static. */}
      <div className="hud-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-72" aria-hidden />

      {/* ── Terminal header ─────────────────────────────────────────────── */}
      <ResumeReveal as="header" className="hud-brackets rounded-xl border border-accent/25 bg-ink-surface/40 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 font-mono text-xs">
          <div className="flex items-center gap-3 text-ink-muted">
            <span className="text-accent">~/resume</span>
            {updatedAt && (
              <span>
                updated {updatedAt.toLocaleDateString('en', { month: 'short', year: 'numeric' }).toLowerCase()}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 text-accent">
            <span className="h-1.5 w-1.5 animate-online-pulse rounded-full bg-accent shadow-[0_0_8px_rgba(91,200,255,0.8)]" />
            ready
          </span>
        </div>

        <h1 className="mt-5 text-4xl font-bold tracking-tight text-ink-text sm:text-5xl">{name}</h1>
        {doc?.subtitle && (
          <p className="mt-2 font-mono text-sm text-accent sm:text-base">{doc.subtitle}</p>
        )}

        {(doc?.location || doc?.email || doc?.phone) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-wider text-ink-muted">
            {doc!.location && <span>{doc!.location}</span>}
            {doc!.email && (
              <a href={`mailto:${doc!.email}`} className="transition-colors hover:text-accent">
                {doc!.email}
              </a>
            )}
            {doc!.phone && <span>{doc!.phone}</span>}
          </div>
        )}

        {doc?.summary && (
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-zinc-300">{doc.summary}</p>
        )}
      </ResumeReveal>

      {/* ── PDF variant switcher (client island) ────────────────────────── */}
      <ResumeReveal className="mt-8" delay={1}>
        <ResumePdfSwitcher />
      </ResumeReveal>

      {/* ── Body grid: experience (main) + skills/education/certs (rail) ── */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* MAIN: experience as HUD record blocks */}
        <section className="lg:col-span-2">
          {experiences.length > 0 && (
            <>
              <SectionHeading>experience</SectionHeading>
              <div className="space-y-5">
                {experiences.map((exp, i) => (
                  <ResumeReveal
                    as="article"
                    key={exp.id}
                    delay={i}
                    className="hud-brackets rounded-xl border border-ink-border bg-ink-surface/30 p-5 transition-colors hover:border-accent/40 sm:p-6"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <h3 className="text-lg font-semibold tracking-tight text-ink-text">{exp.role}</h3>
                      <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-baseline gap-x-2 font-mono text-sm text-ink-muted">
                      {exp.companyUrl ? (
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-accent transition-colors hover:text-accent/80"
                        >
                          {exp.company}
                          <FiArrowUpRight className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-zinc-300">{exp.company}</span>
                      )}
                      {exp.location && (
                        <>
                          <span className="text-ink-border">·</span>
                          <span>{exp.location}</span>
                        </>
                      )}
                    </div>

                    {exp.bullets.length > 0 && (
                      <ul className="mt-4 space-y-2 text-[14.5px] leading-relaxed text-zinc-300">
                        {exp.bullets.map((b, bi) => (
                          <li
                            key={bi}
                            className="relative pl-5 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent before:shadow-[0_0_6px_rgba(91,200,255,0.7)]"
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}

                    {exp.tech.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {exp.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-ink-border bg-ink-bg/60 px-2 py-0.5 font-mono text-[11px] text-ink-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </ResumeReveal>
                ))}
              </div>
            </>
          )}
        </section>

        {/* RAIL: skills (mono chips by category) + education ledger + certs */}
        <aside className="space-y-10">
          {skillGroups.length > 0 && (
            <ResumeReveal>
              <SectionHeading>skills</SectionHeading>
              <div className="hud-brackets space-y-4 rounded-xl border border-ink-border bg-ink-surface/30 p-5">
                {skillGroups.map(([category, items]) => (
                  <div key={category}>
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">
                      {category}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((s) => (
                        <span
                          key={s.id}
                          className="rounded-md border border-accent/20 bg-accent/[0.06] px-2 py-0.5 font-mono text-[12px] text-zinc-300"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ResumeReveal>
          )}

          {educations.length > 0 && (
            <ResumeReveal delay={1}>
              <SectionHeading>education</SectionHeading>
              <div className="hud-brackets space-y-6 rounded-xl border border-ink-border bg-ink-surface/30 p-5">
                {educations.map((e) => {
                  const lines = e.details
                    ? e.details.split('\n').map((l) => l.trim()).filter(Boolean)
                    : []
                  return (
                    <div key={e.id} className="border-l-2 border-accent/40 pl-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <h3 className="font-mono text-sm font-medium text-ink-text">{e.degree}</h3>
                        <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-muted">
                          {formatDateRange(e.startDate, e.endDate, false)}
                        </span>
                      </div>
                      <div className="mt-0.5 font-mono text-xs text-ink-muted">
                        {e.school}
                        {e.location && <span> · {e.location}</span>}
                      </div>
                      {lines.length > 0 && (
                        <dl className="mt-2 space-y-1">
                          {lines.map((line, li) => {
                            const { grade, rest } = parseGradeLine(line)
                            return grade ? (
                              <div key={li} className="flex items-baseline gap-3 font-mono text-xs">
                                <dt className="w-9 font-semibold text-accent">{grade}</dt>
                                <dd className="text-zinc-300">{rest}</dd>
                              </div>
                            ) : (
                              <p key={li} className="font-mono text-xs text-ink-muted">
                                {rest}
                              </p>
                            )
                          })}
                        </dl>
                      )}
                    </div>
                  )
                })}
              </div>
            </ResumeReveal>
          )}

          {certifications.length > 0 && (
            <ResumeReveal delay={2}>
              <SectionHeading>certifications</SectionHeading>
              <ul className="hud-brackets space-y-3 rounded-xl border border-ink-border bg-ink-surface/30 p-5">
                {certifications.map((c) => (
                  <li key={c.id} className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-medium text-ink-text">
                        {c.credentialUrl ? (
                          <a
                            href={c.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 transition-colors hover:text-accent"
                          >
                            {c.name}
                            <FiArrowUpRight className="h-3 w-3" />
                          </a>
                        ) : (
                          c.name
                        )}
                      </div>
                      <div className="font-mono text-xs text-ink-muted">{c.issuer}</div>
                    </div>
                    {c.issuedAt && (
                      <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-wider text-ink-muted">
                        {c.issuedAt}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </ResumeReveal>
          )}
        </aside>
      </div>
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
      <span className="text-ink-muted">// </span>
      {children}
    </h2>
  )
}
