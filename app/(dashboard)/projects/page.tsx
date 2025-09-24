import type { ProjectStatus } from '@prisma/client';

import { PageContainer, PageHeader } from '@/components/layout';
import { ProjectsList } from '@/components/projects/projects-list';
import { getAllProjects } from '@/data/projects/get-projects';
import type { ProjectFilter } from '@/types/portfolio';

// // Dynamic rendering to support user-specific like states
// export const dynamic = 'force-dynamic';

interface ProjectsPageProps {
  searchParams: Promise<{
    search?: string;
    tech?: string | string[];
    status?: string | string[];
    featured?: string;
    view?: 'grid' | 'list';
  }>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;
  // Parse search parameters into filter object
  const filter: ProjectFilter = {
    search: params.search,
    techStack: Array.isArray(params.tech)
      ? params.tech
      : params.tech
        ? [params.tech]
        : undefined,
    status: Array.isArray(params.status)
      ? (params.status as ProjectStatus[])
      : params.status
        ? ([params.status] as ProjectStatus[])
        : undefined,
    featured: params.featured === 'true' ? true : undefined,
  };

  // Load projects with applied filters
  const _projectPromise = getAllProjects(filter);

  return (
    <PageContainer>
      <PageHeader
        title='Projects'
        description='Discover amazing projects built by our community of students'
        size='lg'
      />

      <ProjectsList
        _projectsPromise={_projectPromise}
        initialFilters={{
          search: params.search || '',
          tech: Array.isArray(params.tech)
            ? params.tech
            : params.tech
              ? [params.tech]
              : [],
          status: Array.isArray(params.status)
            ? (params.status as ProjectStatus[])
            : params.status
              ? ([params.status] as ProjectStatus[])
              : [],
          featured: params.featured === 'true',
          view: params.view || 'grid',
        }}
      />
    </PageContainer>
  );
}
