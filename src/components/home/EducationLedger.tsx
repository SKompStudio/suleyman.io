const COURSES: { grade: string; name: string }[] = [
  { grade: 'A+', name: 'Simple Type Theory' },
  { grade: 'A+', name: 'Microservices-Oriented Architectures' },
]

function Degree({
  degree,
  detail,
  timeline,
  current,
  children,
}: {
  degree: string
  detail: string
  timeline: string
  current?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="border-l-2 border-accent/40 pl-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="font-mono text-base font-medium text-ink-text">{degree}</h3>
        <span className="font-mono text-xs text-ink-muted">{timeline}</span>
      </div>
      <p className="mt-1 font-mono text-sm text-ink-muted">
        {detail}
        {current && <span className="ml-2 text-accent">● in progress</span>}
      </p>
      {children}
    </div>
  )
}

export function EducationLedger() {
  return (
    <div className="hud-brackets rounded-xl border border-accent/25 bg-ink-surface/40 p-6 sm:p-8">
      <div className="font-mono text-sm text-ink-text">
        <span className="text-accent">~/education</span>
        <span className="ml-3 text-xs text-ink-muted">McMaster University</span>
      </div>

      <div className="mt-6 space-y-7">
        <Degree
          degree="MEng, Computing & Software"
          detail="Year 1 complete · expected Dec 2026"
          timeline="2025 — present"
          current
        >
          <dl className="mt-3 space-y-1.5">
            {COURSES.map((c) => (
              <div key={c.name} className="flex items-baseline gap-4 font-mono text-sm">
                <dt className="w-9 font-semibold text-accent">{c.grade}</dt>
                <dd className="text-zinc-300">{c.name}</dd>
              </div>
            ))}
          </dl>
        </Degree>

        <Degree
          degree="BASc (Honours), Computer Science"
          detail="Bachelor of Applied Science"
          timeline="2018 — 2024"
        />
      </div>
    </div>
  )
}
