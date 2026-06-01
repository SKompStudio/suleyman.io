import prisma from '@/lib/prisma'

const TOKEN_KEY = 'instagram_access_token'
const EXP_KEY = 'instagram_token_expires_at'
const REFRESH_URL = 'https://graph.instagram.com/refresh_access_token'
const SIXTY_DAYS_S = 60 * 24 * 60 * 60

// Active token: prefer the DB copy (kept fresh by the weekly cron), fall back to
// the env seed. DB errors degrade to env so the feed never hard-fails.
export async function getInstagramToken(): Promise<string | null> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: TOKEN_KEY } })
    if (row?.value) return row.value
  } catch {
    /* DB unavailable — fall through to the env seed */
  }
  return process.env.INSTAGRAM_ACCESS_TOKEN ?? null
}

// Refresh the long-lived token (valid 60d, renewable once it's ≥24h old) and
// persist the new token + its expiry. Seeds from the env token on first run.
// Idempotent and safe to call on a schedule.
export async function refreshInstagramToken(): Promise<{
  ok: boolean
  expiresInDays?: number
  error?: string
}> {
  let current: string | null = null
  try {
    current = (await prisma.siteSetting.findUnique({ where: { key: TOKEN_KEY } }))?.value ?? null
  } catch {
    /* fall back to env below */
  }
  current = current || process.env.INSTAGRAM_ACCESS_TOKEN || null
  if (!current) return { ok: false, error: 'no token to refresh' }

  const res = await fetch(
    `${REFRESH_URL}?grant_type=ig_refresh_token&access_token=${current}`,
    { cache: 'no-store' }
  )
  const data = await res.json()
  if (!res.ok || !data?.access_token) {
    return { ok: false, error: data?.error?.message || `refresh failed (${res.status})` }
  }

  const expiresIn: number = data.expires_in ?? SIXTY_DAYS_S
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()
  await prisma.siteSetting.upsert({
    where: { key: TOKEN_KEY },
    create: { key: TOKEN_KEY, value: data.access_token },
    update: { value: data.access_token },
  })
  await prisma.siteSetting.upsert({
    where: { key: EXP_KEY },
    create: { key: EXP_KEY, value: expiresAt },
    update: { value: expiresAt },
  })
  return { ok: true, expiresInDays: Math.round(expiresIn / 86400) }
}
