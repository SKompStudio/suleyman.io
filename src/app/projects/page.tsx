import { ProjectsClient } from './ProjectsClient'
import { getProjectsData } from '@/lib/projects'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Projects',
  description: 'Things I’ve made trying to put my dent in the universe.',
}

export default async function Projects() {
  const projects = await getProjectsData()

  return <ProjectsClient projects={projects} />
}
