import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PlateStaticEditor } from '@/components/editor/plate-editor-static';
import { Button } from '@/components/ui/button';
import { getProjectByUsernameSlug } from '@/data/projects/get-project-by-username-slug';
import { requireServerAuth } from '@/lib/auth/auth-server';
import { jsonToPlateValue } from '@/lib/plate/utils';

interface ProjectPageProps {
  params: Promise<{
    username: string;
    projectSlug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { username, projectSlug } = await params;
  const project = await getProjectByUsernameSlug(username, projectSlug);
  const user = await requireServerAuth();

  if (!project) {
    notFound();
  }

  const isOwner = user?.id === project.projectProfileId;

  if (!project.document) {
    notFound();
  }

  const { content } = project.document;

  if (!content) {
    notFound();
  }

  const plateValue = jsonToPlateValue(content);

  if (!plateValue.length) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-background'>
      {isOwner && (
        <Button asChild>
          <Link href={`/projects/${username}/${projectSlug}/edit`}>Edit</Link>
        </Button>
      )}
      <PlateStaticEditor initialValue={plateValue} />
    </div>
  );
}
