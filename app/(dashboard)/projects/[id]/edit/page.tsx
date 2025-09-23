import { notFound } from 'next/navigation';

import { PlateEditor } from '@/components/editor/plate-editor-client';
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
  return (
    <div className='min-h-screen bg-background'>
      <PlateEditor initialValue={plateValue} />
    </div>
  );

}
