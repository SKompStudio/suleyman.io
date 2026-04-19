export interface ParsedMdx {
  slug: string
  title: string
  description: string
  author: string
  date: string // ISO date
  body: string // markdown body with imports/export stripped
}

/**
 * Parses an MDX article file like the ones in src/content/articles into fields
 * suitable for inserting into the Post model.
 *
 * Format expected:
 *   import { ArticleLayout } from '@/components/ArticleLayout'
 *   ...other imports
 *
 *   export const meta = {
 *     author: 'Suleyman Kiani',
 *     date: '2025-05-02',
 *     title: 'Post title',
 *     description: 'Post description',
 *   }
 *
 *   export default (props) => <ArticleLayout meta={meta} {...props} />
 *
 *   [markdown body follows]
 */
export function parseMdxArticle(source: string, filenameBase: string): ParsedMdx {
  const meta = extractMeta(source)
  const body = stripImportsAndExports(source).trim()

  return {
    slug: slugify(filenameBase),
    title: meta.title || filenameBase,
    description: meta.description || '',
    author: meta.author || 'Suleyman Kiani',
    date: meta.date || new Date().toISOString().slice(0, 10),
    body,
  }
}

function extractMeta(source: string): { title?: string; description?: string; author?: string; date?: string } {
  const metaMatch = source.match(/export\s+const\s+meta\s*=\s*{([\s\S]*?)}/)
  if (!metaMatch) return {}
  const body = metaMatch[1]
  return {
    title: extractField(body, 'title'),
    description: extractField(body, 'description'),
    author: extractField(body, 'author'),
    date: extractField(body, 'date'),
  }
}

function extractField(src: string, key: string): string | undefined {
  const re = new RegExp(`${key}\\s*:\\s*(['"\`])((?:\\\\.|(?!\\1).)*?)\\1`)
  const m = src.match(re)
  return m ? m[2] : undefined
}

function stripImportsAndExports(source: string): string {
  const lines = source.split('\n')
  const out: string[] = []
  let skipBlock = false
  let braceDepth = 0

  for (const line of lines) {
    if (skipBlock) {
      braceDepth += countChar(line, '{') - countChar(line, '}')
      if (braceDepth <= 0) {
        skipBlock = false
        braceDepth = 0
      }
      continue
    }

    if (/^\s*import\s+/.test(line)) continue

    if (/^\s*export\s+const\s+meta\s*=/.test(line)) {
      braceDepth = countChar(line, '{') - countChar(line, '}')
      if (braceDepth > 0) skipBlock = true
      continue
    }

    if (/^\s*export\s+default\s+/.test(line)) continue

    out.push(line)
  }

  return out.join('\n')
}

function countChar(str: string, ch: string): number {
  let n = 0
  for (const c of str) if (c === ch) n++
  return n
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\.mdx?$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
