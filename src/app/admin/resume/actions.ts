'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'
import {
  resumeDocumentSchema,
  experienceInputSchema,
  educationInputSchema,
  skillInputSchema,
  certificationInputSchema,
} from '@/lib/resumeSchemas'

export type ActionResult<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; error: string }

const RESUME_ID = 'default'

function invalidateResume() {
  updateTag('resume')
  revalidatePath('/resume')
  revalidatePath('/admin/resume')
}

async function ensureResumeDocument() {
  return prisma.resumeDocument.upsert({
    where: { id: RESUME_ID },
    update: {},
    create: { id: RESUME_ID, title: 'Resume' },
  })
}

export async function updateResumeDocument(input: unknown): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }
  const parsed = resumeDocumentSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') }
  }
  await ensureResumeDocument()
  await prisma.resumeDocument.update({
    where: { id: RESUME_ID },
    data: parsed.data,
  })
  invalidateResume()
  return { ok: true }
}

export async function uploadResumePdf(formData: FormData): Promise<ActionResult<{ url: string }>> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }
  const file = formData.get('file')
  if (!(file instanceof File)) return { ok: false, error: 'No file provided' }
  if (file.type !== 'application/pdf') return { ok: false, error: 'Only PDF files are allowed' }
  if (file.size > 10 * 1024 * 1024) return { ok: false, error: 'PDF too large (>10MB)' }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const pathname = `resume/${Date.now()}-${safeName}`
  const buf = Buffer.from(await file.arrayBuffer())
  const blob = await put(pathname, buf, { access: 'public', contentType: 'application/pdf' })

  await ensureResumeDocument()
  await prisma.resumeDocument.update({
    where: { id: RESUME_ID },
    data: { pdfUrl: blob.url, pdfFilename: file.name, pdfUploadedAt: new Date() },
  })
  await prisma.media.create({
    data: { url: blob.url, pathname, contentType: 'application/pdf', size: buf.byteLength },
  })
  invalidateResume()
  return { ok: true, data: { url: blob.url } }
}

export async function removeResumePdf(): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }
  await ensureResumeDocument()
  await prisma.resumeDocument.update({
    where: { id: RESUME_ID },
    data: { pdfUrl: null, pdfFilename: null, pdfUploadedAt: null },
  })
  invalidateResume()
  return { ok: true }
}

// ---------- Experience ----------

export async function upsertExperience(input: unknown, id?: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }
  const parsed = experienceInputSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') }
  }
  const data = parsed.data
  const row = id
    ? await prisma.resumeExperience.update({ where: { id }, data })
    : await prisma.resumeExperience.create({ data })
  invalidateResume()
  return { ok: true, data: { id: row.id } }
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }
  await prisma.resumeExperience.delete({ where: { id } })
  invalidateResume()
  return { ok: true }
}

// ---------- Education ----------

export async function upsertEducation(input: unknown, id?: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }
  const parsed = educationInputSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') }
  }
  const data = parsed.data
  const row = id
    ? await prisma.resumeEducation.update({ where: { id }, data })
    : await prisma.resumeEducation.create({ data })
  invalidateResume()
  return { ok: true, data: { id: row.id } }
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }
  await prisma.resumeEducation.delete({ where: { id } })
  invalidateResume()
  return { ok: true }
}

// ---------- Skills ----------

export async function upsertSkill(input: unknown, id?: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }
  const parsed = skillInputSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') }
  }
  const data = parsed.data
  const row = id
    ? await prisma.resumeSkill.update({ where: { id }, data })
    : await prisma.resumeSkill.create({ data })
  invalidateResume()
  return { ok: true, data: { id: row.id } }
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }
  await prisma.resumeSkill.delete({ where: { id } })
  invalidateResume()
  return { ok: true }
}

// ---------- Certifications ----------

export async function upsertCertification(input: unknown, id?: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }
  const parsed = certificationInputSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') }
  }
  const data = parsed.data
  const row = id
    ? await prisma.resumeCertification.update({ where: { id }, data })
    : await prisma.resumeCertification.create({ data })
  invalidateResume()
  return { ok: true, data: { id: row.id } }
}

export async function deleteCertification(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }
  await prisma.resumeCertification.delete({ where: { id } })
  invalidateResume()
  return { ok: true }
}
