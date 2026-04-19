import { z } from 'zod'

const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase URL-safe')

export const postInputSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(500),
  body: z.string().min(1).max(500_000),
  coverImage: z.string().url().nullable().optional().or(z.literal('').transform(() => null)),
  author: z.string().trim().min(1).max(80).default('Suleyman Kiani'),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
})

export type PostInput = z.infer<typeof postInputSchema>

export const setStatusSchema = z
  .object({
    slug: slugSchema,
    status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']),
    scheduledAt: z.string().datetime().nullable().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.status === 'SCHEDULED' && !val.scheduledAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['scheduledAt'],
        message: 'scheduledAt is required when status is SCHEDULED',
      })
    }
  })

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}
