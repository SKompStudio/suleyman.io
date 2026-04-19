import { NextResponse, type NextRequest } from 'next/server'
import { put } from '@vercel/blob'
import { requireAdmin } from '@/lib/adminGuard'
import { prisma } from '@/lib/prisma'

const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'])
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')
  if (!filename) {
    return NextResponse.json({ error: 'filename query param required' }, { status: 400 })
  }

  const contentType = request.headers.get('content-type') ?? 'application/octet-stream'
  if (!ALLOWED.has(contentType)) {
    return NextResponse.json({ error: `unsupported content-type: ${contentType}` }, { status: 415 })
  }

  const body = request.body
  if (!body) return NextResponse.json({ error: 'empty body' }, { status: 400 })

  const buf = Buffer.from(await request.arrayBuffer())
  if (buf.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: 'file too large (>5MB)' }, { status: 413 })
  }

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const pathname = `admin/${Date.now()}-${safeName}`

  const blob = await put(pathname, buf, {
    access: 'public',
    contentType,
  })

  await prisma.media.create({
    data: {
      url: blob.url,
      pathname,
      contentType,
      size: buf.byteLength,
    },
  })

  return NextResponse.json({ url: blob.url, pathname })
}
