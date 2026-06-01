import { NextResponse } from 'next/server'

import { getProjectsData } from '@/lib/projects'

// Public-safe project metadata for the terminal `ls` / `open` commands. Runs
// getProjectsData() server-side (token stays server-side) and is CDN-cached so
// it's hit only when the command is actually invoked.
export const revalidate = 1800

export async function GET() {
  try {
    const projects = await getProjectsData()
    const slim = projects.map((p) => ({
      slug: p.slug,
      name: p.name,
      description: p.description,
      tech: p.tech.slice(0, 4),
      featured: p.featured,
      href: p.link?.href ?? null,
      label: p.link?.label ?? null,
      github: p.github ?? null,
    }))
    return NextResponse.json(
      { projects: slim },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=1800, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('[terminal/projects]', error)
    return NextResponse.json({ projects: [] }, { status: 502 })
  }
}
