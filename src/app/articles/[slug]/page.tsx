import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/Container'
import { formatDate } from '@/lib/formatDate'
import { getArticle } from '@/lib/getAllArticles'
import { MarkdownArticle } from '@/components/MarkdownArticle'
import { articleStats } from '../readingTime'
import '../article.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return {}
  return { title: article.title, description: article.description }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article || !article.body) {
    notFound()
  }

  const { words, minutes } = articleStats(article.body)

  return (
    <Container className="mt-16 lg:mt-32">
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          {/* Back to archive */}
          <Link
            href="/articles"
            className="group inline-flex items-center gap-2 font-mono text-xs text-ink-muted transition-colors hover:text-accent"
          >
            <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">
              ←
            </span>
            ~/articles
          </Link>

          <article>
            {/* HUD-framed header with a one-shot scan sweep on load. */}
            <header className="article-scan hud-brackets relative mt-6 overflow-hidden rounded-xl border border-accent/25 bg-ink-surface/40 p-6 sm:p-8">
              <div className="hud-glow pointer-events-none absolute inset-0" aria-hidden />
              <div className="relative">
                <p className="font-mono text-xs text-accent/70">~/articles/{article.slug}</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-text sm:text-4xl">
                  {article.title}
                </h1>
                <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-accent/10 pt-4 font-mono text-xs text-ink-muted">
                  <div className="inline-flex items-center gap-1.5">
                    <dt className="text-accent/60">date</dt>
                    <dd>
                      <time dateTime={article.date}>{formatDate(article.date)}</time>
                    </dd>
                  </div>
                  <span aria-hidden className="text-ink-border">·</span>
                  <div className="inline-flex items-center gap-1.5">
                    <dt className="text-accent/60">read</dt>
                    <dd className="tabular-nums">{minutes} min</dd>
                  </div>
                  <span aria-hidden className="text-ink-border">·</span>
                  <div className="inline-flex items-center gap-1.5">
                    <dt className="text-accent/60">words</dt>
                    <dd className="tabular-nums">{words.toLocaleString()}</dd>
                  </div>
                </dl>
              </div>
            </header>

            {/* Reading body — JARVIS dark prose theme (scoped via .jarvis-prose). */}
            <div className="jarvis-prose mt-10">
              <MarkdownArticle body={article.body} />
            </div>
          </article>
        </div>
      </div>
    </Container>
  )
}
