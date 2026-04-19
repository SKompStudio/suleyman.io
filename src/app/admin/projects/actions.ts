'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'
import { projectEntrySchema, toggleFieldSchema, setPrioritySchema } from '@/lib/projectSchemas'

export type ActionResult<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; error: string }

function invalidateProjects() {
  updateTag('projects')
  revalidatePath('/projects')
  revalidatePath('/admin/projects')
}

export async function upsertProject(input: unknown): Promise<ActionResult<{ slug: string }>> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }

  const parsed = projectEntrySchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') }
  }

  const data = parsed.data

  try {
    await prisma.projectEntry.upsert({
      where: { slug: data.slug },
      update: {
        source: data.source,
        githubSlug: data.githubSlug ?? null,
        name: data.name ?? null,
        description: data.description ?? null,
        linkHref: data.linkHref ?? null,
        linkLabel: data.linkLabel ?? null,
        logoType: data.logoType ?? null,
        logoSrc: data.logoSrc ?? null,
        logoIconName: data.logoIconName ?? null,
        logoClassName: data.logoClassName ?? null,
        timeframe: data.timeframe ?? null,
        tech: data.tech,
        badges: data.badges,
        featured: data.featured,
        priority: data.priority,
        visibility: data.visibility,
        visible: data.visible,
        githubUrl: data.githubUrl ?? null,
      },
      create: {
        slug: data.slug,
        source: data.source,
        githubSlug: data.githubSlug ?? null,
        name: data.name ?? null,
        description: data.description ?? null,
        linkHref: data.linkHref ?? null,
        linkLabel: data.linkLabel ?? null,
        logoType: data.logoType ?? null,
        logoSrc: data.logoSrc ?? null,
        logoIconName: data.logoIconName ?? null,
        logoClassName: data.logoClassName ?? null,
        timeframe: data.timeframe ?? null,
        tech: data.tech,
        badges: data.badges,
        featured: data.featured,
        priority: data.priority,
        visibility: data.visibility,
        visible: data.visible,
        githubUrl: data.githubUrl ?? null,
      },
    })

    invalidateProjects()
    return { ok: true, data: { slug: data.slug } }
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return { ok: false, error: 'A project with that slug or githubSlug already exists' }
    }
    return { ok: false, error: err?.message ?? 'Database error' }
  }
}

export async function toggleProjectField(input: unknown): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }

  const parsed = toggleFieldSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Invalid input' }
  }

  const { slug, field, value } = parsed.data

  await prisma.projectEntry.update({
    where: { slug },
    data: { [field]: value },
  })

  invalidateProjects()
  return { ok: true }
}

export async function setProjectPriority(input: unknown): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }

  const parsed = setPrioritySchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Invalid input' }
  }

  await prisma.projectEntry.update({
    where: { slug: parsed.data.slug },
    data: { priority: parsed.data.priority },
  })

  invalidateProjects()
  return { ok: true }
}

export async function deleteProject(slug: string): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }

  await prisma.projectEntry.delete({ where: { slug } })
  invalidateProjects()
  return { ok: true }
}

export async function upsertGithubOverride(githubSlug: string): Promise<ActionResult<{ slug: string }>> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }

  const slug = githubSlug.split('/').pop()?.toLowerCase() ?? githubSlug.toLowerCase()
  const existing = await prisma.projectEntry.findUnique({ where: { githubSlug } })
  if (existing) return { ok: true, data: { slug: existing.slug } }

  const created = await prisma.projectEntry.create({
    data: {
      slug,
      source: 'GITHUB',
      githubSlug,
      visible: true,
    },
  })

  invalidateProjects()
  return { ok: true, data: { slug: created.slug } }
}
