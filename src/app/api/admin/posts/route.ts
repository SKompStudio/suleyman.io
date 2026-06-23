import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { postInputSchema, setStatusSchema } from '@/lib/postSchemas'

// Bearer-token ingest used by the career-engine blog lane (server -> site over
// HTTP, so the engine never holds the Neon DSN). The token is shared via the
// BLOG_INGEST_TOKEN env on both sides. This is a SEPARATE auth surface from the
// session-cookie admin (requireAdmin); a machine has no session.
function authorize(request: NextRequest): boolean {
  const expected = process.env.BLOG_INGEST_TOKEN
  if (!expected) return false
  const header = request.headers.get('authorization') ?? ''
  const prefix = 'Bearer '
  if (!header.startsWith(prefix)) return false
  return header.slice(prefix.length) === expected
}

// POST: insert a new post. status is HARDCODED to DRAFT here — it is NEVER read
// from the request body, so this endpoint can never publish (the G2 guarantee).
export async function POST(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON body' }, { status: 400 })
  }

  const parsed = postInputSchema.safeParse(payload)
  if (!parsed.success) {
    const error = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    return NextResponse.json({ ok: false, error }, { status: 400 })
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
    return NextResponse.json({ ok: true, id: post.id, slug: post.slug })
  } catch (err) {
    const e = err as { code?: string; message?: string }
    if (e?.code === 'P2002') {
      return NextResponse.json({ ok: false, error: 'A post with that slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ ok: false, error: e?.message ?? 'Database error' }, { status: 500 })
  }
}

// GET ?slug=<slug>: read one post's status. GET (no slug): list PUBLISHED posts
// (mirrors getAllArticles()'s public filter). Used by the engine's PostStore
// get_status / public_articles methods (the human-gated publish path + tests).
export async function GET(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const slug = request.nextUrl.searchParams.get('slug')
  if (slug) {
    const post = await prisma.post.findUnique({ where: { slug }, select: { status: true } })
    if (!post) {
      return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 })
    }
    return NextResponse.json({ ok: true, status: post.status })
  }

  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, slug: true, title: true, description: true, status: true },
  })
  return NextResponse.json({ ok: true, posts })
}

// PATCH: set a post's status. Validated by the existing setStatusSchema. This is
// the human-gated publish path's write surface (the engine only reaches it via
// publish_on_approval after a recorded approval); POST can never publish.
export async function PATCH(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON body' }, { status: 400 })
  }

  const parsed = setStatusSchema.safeParse(payload)
  if (!parsed.success) {
    const error = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    return NextResponse.json({ ok: false, error }, { status: 400 })
  }

  const { slug, status, scheduledAt } = parsed.data
  const data: { status: typeof status; publishedAt?: Date; scheduledAt?: Date | null } = { status }
  if (status === 'PUBLISHED') {
    data.publishedAt = new Date()
    data.scheduledAt = null
  } else if (status === 'SCHEDULED') {
    data.scheduledAt = scheduledAt ? new Date(scheduledAt) : null
  } else {
    data.scheduledAt = null
  }

  try {
    await prisma.post.update({ where: { slug }, data })
    return NextResponse.json({ ok: true, slug })
  } catch (err) {
    const e = err as { code?: string; message?: string }
    if (e?.code === 'P2025') {
      return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 })
    }
    return NextResponse.json({ ok: false, error: e?.message ?? 'Database error' }, { status: 500 })
  }
}
