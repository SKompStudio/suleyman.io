import { prisma } from '@/lib/prisma'
import { ResumeView } from './ResumeView'
import { buildMeta } from '@/lib/buildMeta'

export const dynamic = 'force-dynamic'

export const metadata = buildMeta({
  title: 'Resume',
  description: 'Senior-level full-stack engineer. Experience, education, skills, certifications.',
  path: '/resume',
})

export default async function ResumePage() {
  const [doc, experiences, educations, skills, certifications] = await Promise.all([
    prisma.resumeDocument.findUnique({ where: { id: 'default' } }),
    prisma.resumeExperience.findMany({
      where: { visible: true },
      orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }],
    }),
    prisma.resumeEducation.findMany({
      where: { visible: true },
      orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }],
    }),
    prisma.resumeSkill.findMany({
      where: { visible: true },
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    }),
    prisma.resumeCertification.findMany({
      where: { visible: true },
      orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }],
    }),
  ])

  return (
    <ResumeView
      doc={doc}
      experiences={experiences}
      educations={educations}
      skills={skills}
      certifications={certifications}
    />
  )
}
