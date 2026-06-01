import { Container } from '@/components/Container'
import { StatsConsole } from './StatsConsole'

export const metadata = {
  title: 'LeetCode',
  description:
    'Algorithm-training telemetry — live LeetCode solve counts, difficulty breakdown, ranking, and submission activity rendered as a command-center readout.',
}

export default function LeetCodePage() {
  return (
    <Container className="mt-16 sm:mt-24">
      <header className="max-w-2xl">
        <div className="font-mono text-sm text-accent">
          ~/leetcode
          <span className="ml-3 text-xs text-ink-muted">@kianis4</span>
        </div>
        <h1 className="mt-4 font-sans text-4xl font-semibold tracking-tight text-ink-text sm:text-5xl">
          Algorithm training, instrumented.
        </h1>
        <p className="mt-5 font-mono text-sm leading-relaxed text-ink-muted">
          A live diagnostic readout of my data-structures &amp; algorithms
          practice — solve counts by difficulty, ranking, and submission cadence,
          pulled straight from LeetCode. Real numbers only; if the feed is down
          the panel says so rather than guessing.
        </p>
      </header>

      <div className="mt-12">
        <StatsConsole />
      </div>

      <div className="mt-10 font-mono text-xs text-ink-muted">
        <a
          href="https://leetcode.com/kianis4"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline-offset-4 hover:underline"
        >
          full profile on leetcode →
        </a>
      </div>
    </Container>
  )
}
