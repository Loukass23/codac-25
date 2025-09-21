import { notFound } from 'next/navigation'

import { PlateEditor } from '@/components/editor/plate-editor';
import { ProjectCard } from '@/components/projects/project-card';
import { getProjectById } from '@/data/projects/get-project-by-id'
import { requireServerAuth } from '@/lib/auth/auth-server';
import { jsonToPlateValue } from '@/lib/plate-utils';

interface ProjectPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ProjectEditPage({ params }: ProjectPageProps) {
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
    return <div className="min-h-screen bg-background">
        <ProjectCard
            project={project}
            showEditActions={isOwner}
        />
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <PlateEditor initialValue={jsonToPlateValue(project.summary)} />
            </div>
        </div>
    </div>;
}




