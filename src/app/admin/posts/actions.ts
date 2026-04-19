'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'
import { postInputSchema, setStatusSchema, slugify } from '@/lib/postSchemas'

export type ActionResult<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; error: string }

function invalidate(slug?: string) {
  updateTag('posts')
  revalidatePath('/articles')
  revalidatePath('/admin/posts')
  if (slug) revalidatePath(`/articles/${slug}`)
}

export async function createPost(input: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }

  const parsed = postInputSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') }
  }

  try {
    const post = await prisma.post.create({
      data: {
        slug: parsed.data.slug,
        title: parsed.data.title,
        description: parsed.data.description,
        body: parsed.data.body,
        coverImage: parsed.data.coverImage ?? null,
        author: parsed.data.author,
        tags: parsed.data.tags,
        status: 'DRAFT',
      },
    })
    invalidate(post.slug)
    return { ok: true, data: { id: post.id, slug: post.slug } }
  } catch (err: any) {
    if (err?.code === 'P2002') return { ok: false, error: 'A post with that slug already exists' }
    return { ok: false, error: err?.message ?? 'Database error' }
  }
}

export async function updatePost(id: string, input: unknown): Promise<ActionResult<{ slug: string }>> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }

  const parsed = postInputSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') }
  }

  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        slug: parsed.data.slug,
        title: parsed.data.title,
        description: parsed.data.description,
        body: parsed.data.body,
        coverImage: parsed.data.coverImage ?? null,
        author: parsed.data.author,
        tags: parsed.data.tags,
      },
    })
    invalidate(post.slug)
    return { ok: true, data: { slug: post.slug } }
  } catch (err: any) {
    if (err?.code === 'P2002') return { ok: false, error: 'A post with that slug already exists' }
    if (err?.code === 'P2025') return { ok: false, error: 'Post not found' }
    return { ok: false, error: err?.message ?? 'Database error' }
  }
}

export async function setPostStatus(input: unknown): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }

  const parsed = setStatusSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') }
  }

  const { slug, status, scheduledAt } = parsed.data

  const data: any = { status }
  if (status === 'PUBLISHED') {
    data.publishedAt = new Date()
    data.scheduledAt = null
  } else if (status === 'SCHEDULED') {
    data.scheduledAt = new Date(scheduledAt!)
  } else if (status === 'DRAFT' || status === 'ARCHIVED') {
    // Keep publishedAt for history if PUBLISHED before; clear scheduledAt
    data.scheduledAt = null
  }

  await prisma.post.update({ where: { slug }, data })
  invalidate(slug)
  return { ok: true }
}

export async function deletePost(slug: string): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }
  await prisma.post.delete({ where: { slug } })
  invalidate(slug)
  return { ok: true }
}

export async function quickCreatePost(title: string): Promise<ActionResult<{ slug: string }>> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }

  const slug = slugify(title) || `draft-${Date.now()}`
  try {
    await prisma.post.create({
      data: {
        slug,
        title,
        description: '',
        body: '# New post\n\nStart writing…',
        status: 'DRAFT',
      },
    })
    invalidate(slug)
    return { ok: true, data: { slug } }
  } catch (err: any) {
    if (err?.code === 'P2002') return { ok: false, error: 'A post with that slug already exists' }
    return { ok: false, error: err?.message ?? 'Database error' }
  }
}
