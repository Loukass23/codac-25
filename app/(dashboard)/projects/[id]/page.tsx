import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PlateStaticEditor } from '@/components/editor/plate-editor-static';
import { Button } from '@/components/ui/button';
import { getProjectById } from '@/data/projects/get-project-by-id';
import { requireServerAuth } from '@/lib/auth/auth-server';
import { jsonToPlateValue } from '@/lib/plate/utils';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  const user = await requireServerAuth();

  if (!project) {
    notFound();
  }

  const isOwner = user?.id === project.projectProfile.userId;

  const { summary } = project;

  const plateValue = jsonToPlateValue(summary);

  if (!plateValue.length) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-background'>
      {isOwner && (
        <Button asChild>
          <Link href={`/projects/${id}/edit`}>Edit</Link>
        </Button>
      )}
      <PlateStaticEditor initialValue={plateValue} />
    </div>
  );
}
