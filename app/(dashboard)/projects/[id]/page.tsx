import { notFound, redirect } from 'next/navigation'

import { PlateProjectWrapper } from '@/components/projects/plate-project-wrapper'
import { getProjectById } from '@/data/projects/get-project-by-id'
import { getAllProjects } from '@/data/projects/get-projects'
import { requireServerAuth } from '@/lib/auth/auth-server'
import { jsonToPlateValue } from '@/lib/plate/utils'

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const project = await getProjectById(id)
  const user = await requireServerAuth()

  if (!project) {
    // Check if there are any public projects available to redirect to
    try {
      const allProjects = await getAllProjects({})
      if (allProjects.length > 0) {
        // Redirect to the most recent project
        const mostRecentProject = allProjects.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
        redirect(`/projects/${mostRecentProject?.id}`)
      }
    } catch (error) {
      // If we can't get projects, just show not found
      console.error('Failed to get projects for redirect:', error)
    }

    notFound()
  }

  const isOwner = user?.id === project.projectProfile.userId


  const { title, description, summary } = project;


  const plateValue = jsonToPlateValue(summary);

  if (!plateValue.length) {
    notFound()
  }
  return (
    <div className="min-h-screen bg-background">

      <PlateProjectWrapper
        plateValue={plateValue}
        title={title}
        description={description}
        showEditButton={isOwner}
        editLink={`/projects/${id}/edit`}
      />

    </div>
  );
}




