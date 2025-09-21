import { notFound } from 'next/navigation'

import { PageContainer } from '@/components/layout'
import { ProjectViewEdit } from '@/components/projects/project-view-edit'
import { DndWrapper } from '@/components/dnd/dnd-wrapper'
import { getProjectById } from '@/data/projects/get-project-by-id'
import { requireServerAuth } from '@/lib/auth/auth-server'

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const [project, user] = await Promise.all([
    getProjectById(id),
    requireServerAuth()
  ])

  if (!project) {
    notFound()
  }

  const isOwner = user?.id === project.projectProfile.userId

  return (
    <DndWrapper>
      <PageContainer size="lg">
        <ProjectViewEdit
          project={project}
          isOwner={isOwner}
        />
      </PageContainer>
    </DndWrapper>
  )
}