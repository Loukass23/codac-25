import { redirect } from 'next/navigation'

import { createProjectFromGitHub } from '@/actions/github/github-actions'
import { DndWrapper } from '@/components/dnd/dnd-wrapper'
import { PageContainer, PageHeader } from '@/components/layout'
import { RepositorySelector } from '@/components/github/repository-selector'
import type { GitHubRepository } from '@/lib/github/api'

export default async function CreateProjectFromGitHubPage() {
    const handleCreateProject = async (repository: GitHubRepository) => {
        'use server'

        try {
            const result = await createProjectFromGitHub(repository.full_name, {
                title: repository.name.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                description: repository.description || `A ${repository.language || 'software'} project`,
                shortDesc: repository.description ?
                    (repository.description.length > 150 ?
                        repository.description.substring(0, 147) + '...' :
                        repository.description
                    ) : undefined,
                demoUrl: undefined,
                status: 'COMPLETED',
                startDate: repository.created_at,
                endDate: repository.updated_at,
                isPublic: true,
            })

            if (result.success) {
                redirect(`/projects/${result.data.id}`)
            } else {
                console.error('Failed to create project:', result.error)
                throw new Error(result.error as string)
            }
        } catch (error) {
            console.error('Exception when creating project:', error)
            throw new Error('An unexpected error occurred. Please try again.')
        }
    }

    return (
        <DndWrapper>
            <PageContainer size="lg">
                <PageHeader
                    title="Create Project from GitHub"
                    description="Select a repository from your GitHub account to create a project"
                    size="lg"
                />

                <RepositorySelector
                    onCreateProject={handleCreateProject}
                    showCreateButton={true}
                    className="w-full"
                />
            </PageContainer>
        </DndWrapper>
    )
}
