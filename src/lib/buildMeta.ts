import type { Metadata } from 'next'

interface BuildMetaArgs {
  title: string
  description: string
  path: string
}

// Emits per-route OG/Twitter text + canonical from a route's own title and
// description so every page gets distinct social-card text (the per-route
// opengraph-image.png is auto-wired by Next file metadata).
export function buildMeta({ title, description, path }: BuildMetaArgs): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { card: 'summary_large_image', title, description },
  }
}
