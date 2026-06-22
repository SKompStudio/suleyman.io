import { StatusEyebrow } from './StatusEyebrow'

// The anti-portfolio thesis hero. Top-left anchored, server-rendered. The
// headline is the LCP node and is visible at paint, never animated from
// opacity:0. Line 2 carries the cyan to gold payoff gradient. There is no
// centered avatar, no bio paragraph as the lead, no greeting.

export function Hero({ lastDeploy }: { lastDeploy: string }) {
  return (
    <div className="max-w-3xl">
      <StatusEyebrow lastDeploy={lastDeploy} />

      <h1 className="mt-7 text-4xl font-bold leading-[1.02] tracking-tight text-ink-text sm:text-5xl lg:text-6xl">
        I don&apos;t have a portfolio.
        <br />
        <span className="bg-[linear-gradient(100deg,#5BC8FF,#A9E4FF_60%,#E8B84B)] bg-clip-text text-transparent">
          I have a running system.
        </span>
      </h1>

      <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-ink-muted sm:text-[16.5px]">
        Software engineer and founder of{' '}
        <span className="font-semibold text-ink-text">Skomp Studio</span>. I
        build agentic systems that ship themselves: a self-hosted{' '}
        <span className="font-semibold text-ink-text">agentic OS</span>, an
        autonomous{' '}
        <span className="font-semibold text-ink-text">career engine</span>, an{' '}
        <span className="font-semibold text-ink-text">autobuilder</span> that
        researches, codes, tests and deploys projects while I sleep. Everything
        below is live in production right now, not a case study.
      </p>
    </div>
  )
}
