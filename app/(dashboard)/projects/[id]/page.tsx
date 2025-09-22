import { notFound } from 'next/navigation';

import { PlateStaticEditor } from '@/components/editor/plate-editor-static';
import { getProjectById } from '@/data/projects/get-project-by-id';
import { jsonToPlateValue } from '@/lib/plate/utils';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  // const user = await requireServerAuth();

  if (!project) {
    notFound();
  }

  // const isOwner = user?.id === project.projectProfile.userId;

  const { summary } = project;

  const plateValue = jsonToPlateValue(summary);

  if (!plateValue.length) {
    notFound();
  }
  console.log(plateValue);

  return (
    <div className='min-h-screen bg-background'>
      <PlateStaticEditor initialValue={plateValue} />
      {/* <PlateProjectWrapper
        plateValue={plateValue}
        title={title}
        description={description}
        showEditButton={isOwner}
        editLink={`/projects/${id}/edit`}
      /> */}
    </div>
  );
}
