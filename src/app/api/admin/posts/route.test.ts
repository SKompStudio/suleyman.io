import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

const createMock = vi.fn()
const updateMock = vi.fn()

vi.mock('@/lib/prisma', () => ({
  prisma: {
    post: {
      create: (...args: unknown[]) => createMock(...args),
      update: (...args: unknown[]) => updateMock(...args),
    },
  },
}))

const TOKEN = 'test-ingest-token'

function makeRequest(method: string, body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/admin/posts', {
    method,
    headers: {
      authorization: `Bearer ${TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

describe('POST /api/admin/posts', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.BLOG_INGEST_TOKEN = TOKEN
  })

  it('creates the post as a DRAFT, never reading status from the body', async () => {
    createMock.mockResolvedValue({ id: 'p1', slug: 'a-post' })
    const { POST } = await import('./route')

    const res = await POST(
      makeRequest('POST', {
        slug: 'a-post',
        title: 'A Post',
        description: 'desc',
        body: '# hello',
        // a malicious caller tries to smuggle a published status:
        status: 'PUBLISHED',
      })
    )

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ ok: true, id: 'p1', slug: 'a-post' })
    expect(createMock).toHaveBeenCalledTimes(1)
    expect(createMock.mock.calls[0][0].data.status).toBe('DRAFT')
  })
})

describe('PATCH /api/admin/posts', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.BLOG_INGEST_TOKEN = TOKEN
  })

  it('rejects a PATCH attempting status=PUBLISHED with 403 and does not mutate', async () => {
    const { PATCH } = await import('./route')

    const res = await PATCH(makeRequest('PATCH', { slug: 'a-post', status: 'PUBLISHED' }))

    expect(res.status).toBe(403)
    await expect(res.json()).resolves.toEqual({
      ok: false,
      error: 'this endpoint cannot publish; publishing requires admin auth',
    })
    expect(updateMock).not.toHaveBeenCalled()
  })

  it('rejects a PATCH attempting status=SCHEDULED (a deferred publish) with 403 and does not mutate', async () => {
    const { PATCH } = await import('./route')

    const res = await PATCH(
      makeRequest('PATCH', {
        slug: 'a-post',
        status: 'SCHEDULED',
        scheduledAt: '2026-12-01T12:00:00.000Z',
      })
    )

    expect(res.status).toBe(403)
    expect(updateMock).not.toHaveBeenCalled()
  })

  it('allows a PATCH to DRAFT and mutates the row', async () => {
    updateMock.mockResolvedValue({})
    const { PATCH } = await import('./route')

    const res = await PATCH(makeRequest('PATCH', { slug: 'a-post', status: 'DRAFT' }))

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ ok: true, slug: 'a-post' })
    expect(updateMock).toHaveBeenCalledTimes(1)
    expect(updateMock.mock.calls[0][0]).toEqual({
      where: { slug: 'a-post' },
      data: { status: 'DRAFT', scheduledAt: null },
    })
  })

  it('allows a PATCH to ARCHIVED and mutates the row', async () => {
    updateMock.mockResolvedValue({})
    const { PATCH } = await import('./route')

    const res = await PATCH(makeRequest('PATCH', { slug: 'a-post', status: 'ARCHIVED' }))

    expect(res.status).toBe(200)
    expect(updateMock).toHaveBeenCalledTimes(1)
    expect(updateMock.mock.calls[0][0].data.status).toBe('ARCHIVED')
  })

  it('rejects an unauthorized PATCH with 401', async () => {
    const { PATCH } = await import('./route')
    const req = new NextRequest('http://localhost/api/admin/posts', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug: 'a-post', status: 'DRAFT' }),
    })

    const res = await PATCH(req)

    expect(res.status).toBe(401)
    expect(updateMock).not.toHaveBeenCalled()
  })
})
