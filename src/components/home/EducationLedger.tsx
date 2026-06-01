const COURSES: { grade: string; name: string }[] = [
  { grade: 'A+', name: 'Simple Type Theory' },
  { grade: 'A+', name: 'Microservices-Oriented Architectures' },
]

export function EducationLedger() {
  return (
    <div className="rounded-xl border border-ink-border bg-ink-surface/30 p-6 font-mono">
      <div className="text-sm text-ink-muted">education</div>
      <p className="mt-4 text-base text-ink-text">
        MEng, Computing and Software <span className="text-ink-muted">·</span> McMaster{' '}
        <span className="text-ink-muted">·</span> Year 1 complete{' '}
        <span className="text-ink-muted">·</span> exp. Dec 2026
      </p>
      <dl className="mt-4 space-y-2">
        {COURSES.map((c) => (
          <div key={c.name} className="flex gap-4 text-sm">
            <dt className="w-8 text-accent">{c.grade}</dt>
            <dd className="text-zinc-300">{c.name}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
