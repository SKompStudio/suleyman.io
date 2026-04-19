'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'
import { SETTING_KEYS, type SettingKey } from '@/lib/resumeSchemas'

export type ActionResult = { ok: true } | { ok: false; error: string }

function invalidate() {
  updateTag('site-settings')
  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/admin/settings')
}

export async function updateSettings(values: Record<string, string>): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }

  const whitelisted = SETTING_KEYS as readonly string[]
  const ops: Promise<unknown>[] = []

  for (const [key, value] of Object.entries(values)) {
    if (!whitelisted.includes(key)) continue
    if (typeof value !== 'string' || value.length > 500) {
      return { ok: false, error: `Invalid value for ${key}` }
    }
    if (value.trim() === '') {
      ops.push(prisma.siteSetting.delete({ where: { key } }).catch(() => null))
    } else {
      ops.push(
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: value.trim() },
          create: { key: key as SettingKey, value: value.trim() },
        })
      )
    }
  }

  await Promise.all(ops)
  invalidate()
  return { ok: true }
}
