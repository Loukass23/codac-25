import { redirect } from 'next/navigation';

import { createProject } from '@/actions/projects/create-project';
import { PageContainer, PageHeader } from '@/components/layout';
import { ProjectCreationStepper } from '@/components/projects/project-creation-stepper';
import type { CreateProjectData } from '@/types/portfolio';

export default async function CreateProjectPage() {
  const handleCreateProject = async (data: CreateProjectData) => {
    'use server';

    let result;

    try {
      result = await createProject(data);
    } catch (error) {
      console.error('Exception when creating project:', error);
      return { error: 'An unexpected error occurred. Please try again.' };
    }

    if (result.success) {
      // Redirect is now outside try-catch to avoid catching NEXT_REDIRECT
      redirect(result.data.url);
    } else {
      // Handle error - properly return error to be displayed
      console.error('Failed to create project:', result.error);
      return { error: result.error as string };
    }
  };

  return (
    <PageContainer size='lg'>
      <PageHeader
        title='Create New Project'
        description='Share your work with the community and build your portfolio'
        size='lg'
      />

      <ProjectCreationStepper
        onSubmit={handleCreateProject}
        isLoading={false}
      />
    </PageContainer>
  );
}
