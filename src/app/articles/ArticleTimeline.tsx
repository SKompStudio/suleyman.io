// Signature graphic for the /articles index: a publishing-activity timeline
// built from the real article dates. Server component, pure SVG. One subtle
// traveling pulse along the axis (transform/opacity via the shared
// data-pulse keyframe, killed by the global reduced-motion floor). No
// fabricated data — every dot is a real post.

type Point = { t: number; title: string }

export function ArticleTimeline({ points }: { points: Point[] }) {
  if (points.length < 2) return null

  const times = points.map((p) => p.t)
  const min = Math.min(...times)
  const max = Math.max(...times)
  const span = max - min || 1

  const W = 880
  const H = 140
  const padX = 36
  const axisY = 92
  const innerW = W - padX * 2
  const xFor = (t: number) => padX + ((t - min) / span) * innerW

  const yearOf = (t: number) => new Date(t).getUTCFullYear()
  const firstYear = yearOf(min)
  const lastYear = yearOf(max)
  const years: number[] = []
  for (let y = firstYear; y <= lastYear; y++) years.push(y)
  const yearX = (y: number) => xFor(Date.UTC(y, 0, 1))

  return (
    <div className="hud-brackets relative overflow-hidden rounded-xl border border-accent/25 bg-ink-surface/40 p-5 sm:p-7">
      <div className="hud-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
          <span className="text-accent">~/archive · activity</span>
          <span className="text-ink-muted">
            {points.length} records · {firstYear}–{lastYear}
          </span>
        </div>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mt-4 w-full"
          role="img"
          aria-label={`Publishing-activity timeline: ${points.length} posts between ${firstYear} and ${lastYear}.`}
        >
          {/* baseline axis */}
          <line x1={padX} y1={axisY} x2={W - padX} y2={axisY} stroke="#5BC8FF" strokeOpacity={0.25} strokeWidth={1} />
          {/* traveling pulse along the axis */}
          <line
            x1={padX}
            y1={axisY}
            x2={W - padX}
            y2={axisY}
            stroke="#5BC8FF"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeDasharray="14 60"
            className="hud-pulse animate-data-pulse"
            style={{ filter: 'drop-shadow(0 0 3px #5BC8FF)' }}
          />

          {/* year ticks + labels */}
          {years.map((y) => (
            <g key={y}>
              <line x1={yearX(y)} y1={axisY - 8} x2={yearX(y)} y2={axisY + 8} stroke="#5BC8FF" strokeOpacity={0.3} strokeWidth={1} />
              <text x={yearX(y)} y={axisY + 26} textAnchor="middle" className="font-mono" fontSize={12} fill="#8893A0">
                {y}
              </text>
            </g>
          ))}

          {/* a dot per article, alternating above/below the axis to reveal cadence */}
          {points.map((p, i) => {
            const x = xFor(p.t)
            const up = i % 2 === 0
            const y = up ? axisY - 22 : axisY + 22
            return (
              <g key={`${p.t}-${i}`}>
                <line x1={x} y1={axisY} x2={x} y2={y} stroke="#5BC8FF" strokeOpacity={0.2} strokeWidth={1} />
                <circle cx={x} cy={y} r={3.5} fill="#06080B" stroke="#5BC8FF" strokeWidth={1.4} style={{ filter: 'drop-shadow(0 0 3px #5BC8FF)' }}>
                  <title>{p.title}</title>
                </circle>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
