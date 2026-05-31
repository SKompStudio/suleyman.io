const COURSES: { grade: string; name: string }[] = [
  { grade: 'A+', name: 'Simple Type Theory' },
  { grade: 'A+', name: 'Microservices-Oriented Architectures' },
]

export function EducationLedger() {
  return (
    <div className="font-mono">
      <div className="text-sm text-zinc-500 dark:text-ink-muted">education</div>
      <p className="mt-4 text-base text-zinc-800 dark:text-ink-text">
        MEng, Computing and Software{' '}
        <span className="text-zinc-400 dark:text-ink-muted">·</span> McMaster{' '}
        <span className="text-zinc-400 dark:text-ink-muted">·</span> Year 1 complete{' '}
        <span className="text-zinc-400 dark:text-ink-muted">·</span> exp. Dec 2026
      </p>
      <dl className="mt-4 space-y-2">
        {COURSES.map((c) => (
          <div key={c.name} className="flex gap-4 text-sm">
            <dt className="w-8 text-signal">{c.grade}</dt>
            <dd className="text-zinc-600 dark:text-zinc-300">{c.name}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
