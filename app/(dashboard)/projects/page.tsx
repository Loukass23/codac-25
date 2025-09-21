import type { ProjectStatus } from '@prisma/client'

import { PageContainer, PageHeader } from '@/components/layout'
import { ProjectsList } from '@/components/projects/projects-list'
import { getAllProjects } from '@/data/projects/get-projects'
import type { ProjectFilter } from '@/types/portfolio'

// Dynamic rendering to support user-specific like states
export const dynamic = 'force-dynamic'

interface ProjectsPageProps {
  searchParams: {
    search?: string
    tech?: string | string[]
    status?: string | string[]
    featured?: string
    view?: 'grid' | 'list'
  }
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  // Parse search parameters into filter object
  const filter: ProjectFilter = {
    search: searchParams.search,
    techStack: Array.isArray(searchParams.tech)
      ? searchParams.tech
      : searchParams.tech
        ? [searchParams.tech]
        : undefined,
    status: Array.isArray(searchParams.status)
      ? searchParams.status as ProjectStatus[]
      : searchParams.status
        ? [searchParams.status] as ProjectStatus[]
        : undefined,
    featured: searchParams.featured === 'true' ? true : undefined,
  }

  // Load projects with applied filters
  const projects = await getAllProjects(filter)

  return (
    <PageContainer>
      <PageHeader
        title="Projects"
        description="Discover amazing projects built by our community of students"
        size="lg"
      />

      <ProjectsList
        projects={projects}
        initialFilters={{
          search: searchParams.search || '',
          tech: Array.isArray(searchParams.tech)
            ? searchParams.tech
            : searchParams.tech
              ? [searchParams.tech]
              : [],
          status: Array.isArray(searchParams.status)
            ? searchParams.status as ProjectStatus[]
            : searchParams.status
              ? [searchParams.status] as ProjectStatus[]
              : [],
          featured: searchParams.featured === 'true',
          view: searchParams.view || 'grid'
        }}
      />
    </PageContainer>
  )
}