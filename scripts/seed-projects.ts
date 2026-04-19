import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import { projectOverrides, customProjects } from '../src/data/projects'

async function main() {
  let githubCount = 0
  let customCount = 0

  for (const [githubSlug, p] of Object.entries(projectOverrides)) {
    await prisma.projectEntry.upsert({
      where: { slug: slugify(p.name) },
      update: {
        source: 'GITHUB',
        githubSlug,
        name: p.name,
        description: p.description,
        linkHref: p.link.href,
        linkLabel: p.link.label,
        logoType: p.logo.type,
        logoSrc: p.logo.src ?? null,
        logoIconName: p.logo.name ?? null,
        logoClassName: p.logo.className ?? null,
        timeframe: p.timeframe,
        tech: p.tech,
        badges: p.badges ?? [],
        featured: p.featured ?? false,
        priority: p.priority ?? 99,
        visibility: p.visibility ?? 'public',
        visible: true,
      },
      create: {
        slug: slugify(p.name),
        source: 'GITHUB',
        githubSlug,
        name: p.name,
        description: p.description,
        linkHref: p.link.href,
        linkLabel: p.link.label,
        logoType: p.logo.type,
        logoSrc: p.logo.src ?? null,
        logoIconName: p.logo.name ?? null,
        logoClassName: p.logo.className ?? null,
        timeframe: p.timeframe,
        tech: p.tech,
        badges: p.badges ?? [],
        featured: p.featured ?? false,
        priority: p.priority ?? 99,
        visibility: p.visibility ?? 'public',
        visible: true,
      },
    })
    githubCount++
  }

  for (const p of customProjects) {
    await prisma.projectEntry.upsert({
      where: { slug: p.slug },
      update: {
        source: 'CUSTOM',
        githubSlug: null,
        name: p.name,
        description: p.description,
        linkHref: p.link.href,
        linkLabel: p.link.label,
        logoType: p.logo.type,
        logoSrc: p.logo.src ?? null,
        logoIconName: p.logo.name ?? null,
        logoClassName: p.logo.className ?? null,
        timeframe: p.timeframe,
        tech: p.tech,
        badges: p.badges ?? [],
        featured: p.featured ?? false,
        priority: p.priority ?? 99,
        visibility: p.visibility ?? 'private',
        visible: true,
        githubUrl: p.github ?? null,
      },
      create: {
        slug: p.slug,
        source: 'CUSTOM',
        name: p.name,
        description: p.description,
        linkHref: p.link.href,
        linkLabel: p.link.label,
        logoType: p.logo.type,
        logoSrc: p.logo.src ?? null,
        logoIconName: p.logo.name ?? null,
        logoClassName: p.logo.className ?? null,
        timeframe: p.timeframe,
        tech: p.tech,
        badges: p.badges ?? [],
        featured: p.featured ?? false,
        priority: p.priority ?? 99,
        visibility: p.visibility ?? 'private',
        visible: true,
        githubUrl: p.github ?? null,
      },
    })
    customCount++
  }

  console.log(`✓ Seeded ${githubCount} GitHub overrides and ${customCount} custom projects`)
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
