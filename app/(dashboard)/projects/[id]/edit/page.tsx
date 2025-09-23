import { notFound } from 'next/navigation';
import type { Value } from 'platejs';

import { updateProjectSummary } from '@/actions/projects/update-project-summary';
import { ProjectEditorOptimized } from '@/components/editor/project-editor-optimized';
import { getProjectById } from '@/data/projects/get-project-by-id';
import { requireServerAuth } from '@/lib/auth/auth-server';
import { jsonToPlateValue } from '@/lib/plate/utils';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectEditPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  const user = await requireServerAuth();

  if (!project) {
    notFound();
  }

  const isOwner = user?.id === project.projectProfile.userId;
  if (!isOwner) {
    notFound();
  }

  const plateValue = jsonToPlateValue(project.summary);

  // Server action wrapper for saving
  const handleSave = async (value: Value) => {
    'use server';
    const result = await updateProjectSummary(id, value);
    if (!result.success) {
      throw new Error(typeof result.error === 'string' ? result.error : 'Failed to save project');
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <ProjectEditorOptimized
        initialValue={plateValue}
        projectId={id}
        onSave={handleSave}
        autoSave={true}
        autoSaveInterval={30000}
        showBackButton={true}
        backLink={`/projects/${id}`}
      />
    </div>
  );
}
