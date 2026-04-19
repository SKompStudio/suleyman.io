import { z } from 'zod'

const slugSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, 'slug must be URL-safe')

const urlSchema = z.string().url()

export const projectEntrySchema = z.object({
  slug: slugSchema,
  source: z.enum(['GITHUB', 'CUSTOM']),
  githubSlug: z.string().nullable().optional(),
  name: z.string().trim().min(1).max(120).nullable().optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  linkHref: urlSchema.nullable().optional().or(z.literal('').transform(() => null)),
  linkLabel: z.string().trim().max(120).nullable().optional(),
  logoType: z.enum(['image', 'icon']).nullable().optional(),
  logoSrc: z.string().nullable().optional(),
  logoIconName: z.string().trim().max(60).nullable().optional(),
  logoClassName: z.string().trim().max(120).nullable().optional(),
  timeframe: z.string().trim().max(80).nullable().optional(),
  tech: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  badges: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
  featured: z.boolean().default(false),
  priority: z.number().int().min(0).max(999).default(99),
  visibility: z.enum(['public', 'private']).default('public'),
  visible: z.boolean().default(true),
  githubUrl: urlSchema.nullable().optional(),
})

export type ProjectEntryInput = z.infer<typeof projectEntrySchema>

export const toggleFieldSchema = z.object({
  slug: slugSchema,
  field: z.enum(['visible', 'featured']),
  value: z.boolean(),
})

export const setPrioritySchema = z.object({
  slug: slugSchema,
  priority: z.number().int().min(0).max(999),
})
