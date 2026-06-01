import { NextResponse } from 'next/server'
import { refreshInstagramToken } from '@/lib/instagramToken'

export const dynamic = 'force-dynamic'

// Hit weekly by Vercel Cron (see vercel.json). Vercel sends
// `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is configured.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const result = await refreshInstagramToken()
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
