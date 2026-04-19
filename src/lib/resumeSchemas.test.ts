import { describe, it, expect } from 'vitest'
import {
  resumeDocumentSchema,
  experienceInputSchema,
  educationInputSchema,
  skillInputSchema,
  certificationInputSchema,
  settingSchema,
  SETTING_KEYS,
} from './resumeSchemas'

describe('resumeDocumentSchema', () => {
  it('accepts minimum required fields', () => {
    const parsed = resumeDocumentSchema.parse({ title: 'Resume' })
    expect(parsed.title).toBe('Resume')
  })

  it('coerces empty strings to null for optional fields', () => {
    const parsed = resumeDocumentSchema.parse({
      title: 'Resume',
      subtitle: '',
      summary: '',
      email: '',
      phone: '',
    })
    expect(parsed.subtitle).toBe(null)
    expect(parsed.summary).toBe(null)
    expect(parsed.email).toBe(null)
    expect(parsed.phone).toBe(null)
  })

  it('rejects invalid email', () => {
    expect(() => resumeDocumentSchema.parse({ title: 'R', email: 'not-an-email' })).toThrow()
  })
})

describe('experienceInputSchema', () => {
  it('accepts a valid entry with bullets + tech', () => {
    const parsed = experienceInputSchema.parse({
      role: 'Senior Engineer',
      company: 'Applify AI',
      startDate: 'Feb 2025',
      bullets: ['Shipped durable workflows', 'Cut inference costs ~90%'],
      tech: ['TypeScript', 'Prisma'],
    })
    expect(parsed.bullets).toHaveLength(2)
    expect(parsed.current).toBe(false)
  })

  it('rejects more than 15 bullets', () => {
    const bullets = Array.from({ length: 16 }, (_, i) => `b${i}`)
    expect(() =>
      experienceInputSchema.parse({ role: 'R', company: 'C', startDate: 'Jan 2025', bullets })
    ).toThrow()
  })

  it('coerces empty endDate and companyUrl to null', () => {
    const parsed = experienceInputSchema.parse({
      role: 'R',
      company: 'C',
      startDate: 'Jan 2025',
      endDate: '',
      companyUrl: '',
    })
    expect(parsed.endDate).toBe(null)
    expect(parsed.companyUrl).toBe(null)
  })
})

describe('educationInputSchema', () => {
  it('accepts a valid entry', () => {
    const parsed = educationInputSchema.parse({
      degree: 'MEng Systems',
      school: 'McMaster University',
      startDate: 'Sep 2025',
    })
    expect(parsed.degree).toContain('MEng')
  })

  it('requires degree + school', () => {
    expect(() => educationInputSchema.parse({ degree: '', school: 'X', startDate: 'a' })).toThrow()
    expect(() => educationInputSchema.parse({ degree: 'X', school: '', startDate: 'a' })).toThrow()
  })
})

describe('skillInputSchema', () => {
  it('accepts category + name', () => {
    expect(skillInputSchema.parse({ category: 'Languages', name: 'TypeScript' }).name).toBe(
      'TypeScript'
    )
  })

  it('rejects empty name', () => {
    expect(() => skillInputSchema.parse({ category: 'X', name: '' })).toThrow()
  })
})

describe('certificationInputSchema', () => {
  it('accepts name + issuer, coerces empty URL to null', () => {
    const parsed = certificationInputSchema.parse({
      name: 'AWS Certified',
      issuer: 'Amazon',
      credentialUrl: '',
    })
    expect(parsed.credentialUrl).toBe(null)
  })
})

describe('settingSchema', () => {
  it('accepts whitelisted keys', () => {
    for (const key of SETTING_KEYS) {
      expect(settingSchema.parse({ key, value: 'x' }).key).toBe(key)
    }
  })

  it('rejects unknown keys', () => {
    expect(() => settingSchema.parse({ key: 'hero.unknown', value: 'x' })).toThrow()
  })

  it('caps value at 500 chars', () => {
    expect(() =>
      settingSchema.parse({ key: 'hero.headline', value: 'x'.repeat(501) })
    ).toThrow()
  })
})
