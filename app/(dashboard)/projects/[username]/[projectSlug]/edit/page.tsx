import { Project } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { ProjectContent } from '@/components/projects/project-content';
import { getProjectByUsernameSlug } from '@/data/projects/get-project-by-username-slug';

interface ProjectEditPageProps {
  params: Promise<{
    username: string;
    projectSlug: string;
  }>;
}

export default async function ProjectEditPage({
  params,
}: ProjectEditPageProps) {
  const { username, projectSlug } = await params;
  const projectPromise = getProjectByUsernameSlug(
    username,
    projectSlug
  ) as Promise<Project>;

  if (!projectPromise) {
    notFound();
  }

  // const isOwner = user?.id === project.projectProfile.userId;
  // if (!isOwner) {
  //   notFound();
  // }

  // const plateValue = jsonToPlateValue(project.summary);

  // Server action wrapper for saving
  // const handleSave = async (value: Value) => {
  //   const result = await updateProjectSummary(id, value);
  //   if (!result.success) {
  //     throw new Error(
  //       typeof result.error === 'string'
  //         ? result.error
  //         : 'Failed to save project'
  //     );
  //   }
  // };

  return (
    <div className='min-h-screen bg-background'>
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectContent _projectPromise={projectPromise} />
      </Suspense>

      {/* <ProjectEditorOptimized
        initialValue={plateValue}
        projectId={id}
        onSave={handleSave}
        autoSave={true}
        autoSaveInterval={30000}
        showBackButton={true}
        backLink={`/projects/${username}/${projectSlug}`}
      /> */}
    </div>
  );
}
