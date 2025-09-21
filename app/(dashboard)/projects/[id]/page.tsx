import { notFound } from 'next/navigation'
import { createSlateEditor, PlateStatic } from 'platejs';

import { BaseEditorKit } from '@/components/editor/plugins/editor-base-kit';
import { ProjectCard } from '@/components/projects/project-card'
import { getProjectById } from '@/data/projects/get-project-by-id'
import { requireServerAuth } from '@/lib/auth/auth-server'
import { jsonToPlateValue } from '@/lib/utils/plate-utils'

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const project = await getProjectById(id)
  const user = await requireServerAuth()

  if (!project) {
    notFound()
  }

  const isOwner = user?.id === project.projectProfile.userId
  if (!isOwner) {
    notFound()
  }

  const editor = createSlateEditor({
    plugins: BaseEditorKit,
    value: jsonToPlateValue(project.summary)
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header */}
      <ProjectCard
        project={project}
        showEditActions={isOwner}
      />
      {/* <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {author && <UserProfileAvatar
                user={{
                  id: author.id,
                  name: author.name || undefined,
                  avatar: author.avatar || undefined
                }}
              />}
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  {project.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  by {author.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {project.status}
              </Badge>
            </div>
          </div>
        </div>
      </div> */}

      {/* Editor content - takes up most of the screen */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <PlateStatic editor={editor} />
        </div>
      </div>
    </div>
  );
}




