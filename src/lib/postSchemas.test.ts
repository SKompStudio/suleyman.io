import { describe, it, expect } from 'vitest'
import { postInputSchema, setStatusSchema, slugify } from './postSchemas'

describe('postInputSchema', () => {
  it('accepts a valid post', () => {
    const parsed = postInputSchema.parse({
      slug: 'from-rejection-to-release',
      title: 'From Rejection to Release',
      description: 'A journey of resilience.',
      body: '# Hello\n\nContent here.',
      tags: ['personal', 'growth'],
    })
    expect(parsed.slug).toBe('from-rejection-to-release')
    expect(parsed.author).toBe('Suleyman Kiani')
  })

  it('rejects empty body', () => {
    expect(() =>
      postInputSchema.parse({
        slug: 'x',
        title: 'T',
        description: 'D',
        body: '',
      })
    ).toThrow()
  })

  it('rejects slug with spaces', () => {
    expect(() =>
      postInputSchema.parse({
        slug: 'my post',
        title: 'T',
        description: 'D',
        body: 'body',
      })
    ).toThrow()
  })

  it('coerces empty coverImage to null', () => {
    const parsed = postInputSchema.parse({
      slug: 'x',
      title: 'T',
      description: 'D',
      body: 'b',
      coverImage: '',
    })
    expect(parsed.coverImage).toBe(null)
  })

  it('rejects more than 20 tags', () => {
    expect(() =>
      postInputSchema.parse({
        slug: 'x',
        title: 'T',
        description: 'D',
        body: 'b',
        tags: Array.from({ length: 21 }, (_, i) => `tag${i}`),
      })
    ).toThrow()
  })
})

describe('setStatusSchema', () => {
  it('DRAFT requires no scheduledAt', () => {
    expect(setStatusSchema.parse({ slug: 'x', status: 'DRAFT' }).status).toBe('DRAFT')
  })

  it('PUBLISHED requires no scheduledAt', () => {
    expect(setStatusSchema.parse({ slug: 'x', status: 'PUBLISHED' }).status).toBe('PUBLISHED')
  })

  it('SCHEDULED requires scheduledAt', () => {
    expect(() =>
      setStatusSchema.parse({ slug: 'x', status: 'SCHEDULED' })
    ).toThrow()
  })

  it('SCHEDULED accepts ISO datetime', () => {
    const parsed = setStatusSchema.parse({
      slug: 'x',
      status: 'SCHEDULED',
      scheduledAt: '2026-05-01T12:00:00.000Z',
    })
    expect(parsed.scheduledAt).toBe('2026-05-01T12:00:00.000Z')
  })
})

describe('slugify', () => {
  it('converts title to URL-safe slug', () => {
    expect(slugify('Hello World!')).toBe('hello-world')
  })

  it('collapses multiple separators', () => {
    expect(slugify('Foo --- Bar   Baz')).toBe('foo-bar-baz')
  })

  it('handles emoji and accented characters by stripping', () => {
    expect(slugify('Café 🎉 Launch')).toBe('caf-launch')
  })

  it('limits to 100 chars', () => {
    const long = 'a'.repeat(200)
    expect(slugify(long)).toHaveLength(100)
  })
})
