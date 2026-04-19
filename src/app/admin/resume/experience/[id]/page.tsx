import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ExperienceForm } from '@/components/admin/ExperienceForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Edit experience — Admin', robots: { index: false, follow: false } }

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.resumeExperience.findUnique({ where: { id } })
  if (!item) notFound()
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link href="/admin/resume" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">← Back to resume</Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {item.role} <span className="text-zinc-400">— {item.company}</span>
          </h1>
        </div>
        <ExperienceForm initial={item} />
      </div>
    </div>
  )
}
