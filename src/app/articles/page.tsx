import { Container } from '@/components/Container'
import { getAllArticles } from '@/lib/getAllArticles'
import { ArticleRecord } from './ArticleRecord'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Articles',
  description:
    'A collection of my thoughts and experiences as I navigate my fitness, academic, and professional journey, from setbacks to successes.',
}

export default async function ArticlesIndex() {
  const articles = await getAllArticles()
  const count = articles.length

  return (
    <Container className="mt-16 sm:mt-32">
      {/* HUD header */}
      <header className="hud-brackets relative max-w-2xl rounded-xl border border-accent/25 bg-ink-surface/40 p-6 sm:p-8">
        <div className="hud-glow pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
            <span className="text-accent">~/articles</span>
            <span className="inline-flex items-center gap-1.5 text-ink-muted">
              <span aria-hidden className="hud-pulse animate-online-pulse text-accent">
                ●
              </span>
              {count} {count === 1 ? 'record' : 'records'}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-text sm:text-5xl">
            Writing &amp; reflections
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            A chronological archive of what I&apos;ve been thinking through —
            across fitness, academics, and the work of building things. Setbacks
            and what came after.
          </p>
        </div>
      </header>

      {/* Record stream */}
      <div className="mt-12 sm:mt-16">
        {count === 0 ? (
          <div className="max-w-2xl rounded-lg border border-ink-border/70 bg-ink-surface/20 px-6 py-12 text-center">
            <p className="font-mono text-sm text-ink-muted">
              no records — the archive is empty
            </p>
          </div>
        ) : (
          <div className="flex max-w-2xl flex-col gap-4">
            {articles.map((article, i) => (
              <ArticleRecord
                key={article.slug}
                slug={article.slug}
                title={article.title}
                description={article.description}
                date={article.date}
                index={i}
                total={count}
                delay={Math.min(i, 6)}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
