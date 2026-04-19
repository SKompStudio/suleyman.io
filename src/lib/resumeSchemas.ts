import { z } from 'zod'

// Accept '', null, or undefined → null. Otherwise trim and validate as string.
function nullableTrimmed(max = 500) {
  return z.preprocess(
    (v) => {
      if (v === null || v === undefined) return null
      if (typeof v === 'string' && v.trim() === '') return null
      return v
    },
    z.string().trim().max(max).nullable().optional()
  )
}

function nullableTrimmedUrl() {
  return z.preprocess(
    (v) => {
      if (v === null || v === undefined) return null
      if (typeof v === 'string' && v.trim() === '') return null
      return v
    },
    z.string().trim().url().nullable().optional()
  )
}

function nullableTrimmedEmail() {
  return z.preprocess(
    (v) => {
      if (v === null || v === undefined) return null
      if (typeof v === 'string' && v.trim() === '') return null
      return v
    },
    z.string().trim().email().nullable().optional()
  )
}

export const resumeDocumentSchema = z.object({
  title: z.string().trim().min(1).max(120),
  subtitle: nullableTrimmed(240),
  summary: nullableTrimmed(1500),
  location: nullableTrimmed(120),
  email: nullableTrimmedEmail(),
  phone: nullableTrimmed(40),
})

export const experienceInputSchema = z.object({
  role: z.string().trim().min(1).max(160),
  company: z.string().trim().min(1).max(120),
  companyUrl: nullableTrimmedUrl(),
  location: nullableTrimmed(80),
  startDate: z.string().trim().min(1).max(40),
  endDate: nullableTrimmed(40),
  current: z.boolean().default(false),
  bullets: z.array(z.string().trim().min(1).max(500)).max(15).default([]),
  tech: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  order: z.number().int().min(0).max(999).default(0),
  visible: z.boolean().default(true),
})

export const educationInputSchema = z.object({
  degree: z.string().trim().min(1).max(160),
  school: z.string().trim().min(1).max(160),
  location: nullableTrimmed(80),
  startDate: z.string().trim().min(1).max(40),
  endDate: nullableTrimmed(40),
  details: nullableTrimmed(500),
  order: z.number().int().min(0).max(999).default(0),
  visible: z.boolean().default(true),
})

export const skillInputSchema = z.object({
  category: z.string().trim().min(1).max(60),
  name: z.string().trim().min(1).max(60),
  order: z.number().int().min(0).max(999).default(0),
  visible: z.boolean().default(true),
})

export const certificationInputSchema = z.object({
  name: z.string().trim().min(1).max(160),
  issuer: z.string().trim().min(1).max(120),
  issuedAt: nullableTrimmed(40),
  credentialUrl: nullableTrimmedUrl(),
  order: z.number().int().min(0).max(999).default(0),
  visible: z.boolean().default(true),
})

export const SETTING_KEYS = [
  'hero.headline',
  'hero.subtitle',
  'hero.currentlyWorking',
  'hero.ctaLabel',
  'hero.ctaHref',
  'social.github',
  'social.linkedin',
  'social.x',
  'social.instagram',
  'social.email',
] as const

export type SettingKey = (typeof SETTING_KEYS)[number]

export const settingSchema = z.object({
  key: z.enum(SETTING_KEYS as unknown as [string, ...string[]]),
  value: z.string().max(500),
})

export const bulkSettingsSchema = z.record(
  z.enum(SETTING_KEYS as unknown as [string, ...string[]]),
  z.string().max(500)
)
