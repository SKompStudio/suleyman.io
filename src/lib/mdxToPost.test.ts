import { describe, it, expect } from 'vitest'
import { parseMdxArticle } from './mdxToPost'

const sample = `import { ArticleLayout } from '@/components/ArticleLayout'
import Image from 'next/image'

export const meta = {
  author: 'Suleyman Kiani',
  date: '2025-05-02',
  title: 'From Rejection to Release',
  description: 'A journey of resilience, growth, and building Applify AI and SKompXcel.',
}

export default (props) => <ArticleLayout meta={meta} {...props} />

# The Chart That Told the Truth

Men lie, women lie, but GitHub contribution charts don't.

## What Grew There

Some **bold** text and _italics_ and [a link](https://example.com).
`

describe('parseMdxArticle', () => {
  it('extracts frontmatter fields from export const meta', () => {
    const result = parseMdxArticle(sample, 'From-Rejection-to-Release')
    expect(result.title).toBe('From Rejection to Release')
    expect(result.description).toBe('A journey of resilience, growth, and building Applify AI and SKompXcel.')
    expect(result.author).toBe('Suleyman Kiani')
    expect(result.date).toBe('2025-05-02')
  })

  it('slugifies the filename', () => {
    const result = parseMdxArticle(sample, 'From-Rejection-to-Release')
    expect(result.slug).toBe('from-rejection-to-release')
  })

  it('strips all import statements', () => {
    const result = parseMdxArticle(sample, 'x')
    expect(result.body).not.toContain('import {')
    expect(result.body).not.toContain("from 'next/image'")
  })

  it('strips the export const meta block', () => {
    const result = parseMdxArticle(sample, 'x')
    expect(result.body).not.toContain('export const meta')
    expect(result.body).not.toContain('Suleyman Kiani') // only appears in meta
  })

  it('strips export default', () => {
    const result = parseMdxArticle(sample, 'x')
    expect(result.body).not.toContain('export default')
    expect(result.body).not.toContain('ArticleLayout')
  })

  it('preserves the markdown body', () => {
    const result = parseMdxArticle(sample, 'x')
    expect(result.body).toContain('# The Chart That Told the Truth')
    expect(result.body).toContain('**bold**')
    expect(result.body).toContain('[a link](https://example.com)')
  })

  it('handles MDX without meta (sets defaults)', () => {
    const bare = '# Hello\n\nJust markdown here.'
    const result = parseMdxArticle(bare, 'Hello-World')
    expect(result.title).toBe('Hello-World')
    expect(result.author).toBe('Suleyman Kiani')
    expect(result.body).toContain('# Hello')
  })

  it('handles multiline meta block', () => {
    const ml = `export const meta = {
  author: 'Author Name',
  date: '2025-01-01',
  title: 'Multi
Line Title',
  description: 'Desc',
}

# Body
`
    // Note: our parser handles simple single-line field values
    const result = parseMdxArticle(ml, 'x')
    expect(result.body).toContain('# Body')
    expect(result.body).not.toContain('export const meta')
  })
})
