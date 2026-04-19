import { describe, it, expect } from 'vitest'
import { projectEntrySchema, toggleFieldSchema } from './projectSchemas'

describe('projectEntrySchema', () => {
  it('accepts a valid CUSTOM project', () => {
    const input = {
      slug: 'skomp-studio',
      source: 'CUSTOM',
      name: 'Skomp Studio',
      description: 'Multi-tenant Pilates SaaS',
      linkHref: 'https://skomp.studio',
      linkLabel: 'skomp.studio',
      tech: ['Next.js', 'Prisma'],
      badges: ['Production', 'SaaS'],
      featured: true,
      priority: 1,
    }
    expect(projectEntrySchema.parse(input).name).toBe('Skomp Studio')
  })

  it('rejects slugs with spaces', () => {
    expect(() =>
      projectEntrySchema.parse({ slug: 'skomp studio', source: 'CUSTOM' })
    ).toThrow()
  })

  it('rejects invalid URLs', () => {
    expect(() =>
      projectEntrySchema.parse({
        slug: 'x',
        source: 'CUSTOM',
        linkHref: 'not-a-url',
      })
    ).toThrow()
  })

  it('treats empty linkHref as null', () => {
    const parsed = projectEntrySchema.parse({
      slug: 'x',
      source: 'CUSTOM',
      linkHref: '',
    })
    expect(parsed.linkHref).toBe(null)
  })

  it('caps tech array at 30 items', () => {
    const tech = Array.from({ length: 31 }, (_, i) => `T${i}`)
    expect(() =>
      projectEntrySchema.parse({ slug: 'x', source: 'CUSTOM', tech })
    ).toThrow()
  })

  it('defaults featured=false, priority=99, visible=true', () => {
    const parsed = projectEntrySchema.parse({ slug: 'x', source: 'CUSTOM' })
    expect(parsed.featured).toBe(false)
    expect(parsed.priority).toBe(99)
    expect(parsed.visible).toBe(true)
  })
})

describe('toggleFieldSchema', () => {
  it('accepts field=visible boolean', () => {
    expect(toggleFieldSchema.parse({ slug: 'x', field: 'visible', value: false }).value).toBe(false)
  })

  it('rejects unknown fields', () => {
    expect(() =>
      toggleFieldSchema.parse({ slug: 'x', field: 'other', value: true })
    ).toThrow()
  })
})
