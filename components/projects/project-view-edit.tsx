'use client'

import { ProjectStatus } from '@prisma/client'
import { Heart, ExternalLink, Github, Calendar, Eye, Edit3, Save, X } from 'lucide-react'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import { toast } from 'sonner'

import { updateProject } from '@/actions/projects/update-project'
import { updateProjectSummary } from '@/actions/projects/update-project-summary'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PROJECT_STATUSES } from '@/types/portfolio'
import { PlateEditor } from '../editor/plate-editor'


interface ProjectViewEditProps {
    project: {
        id: string
        title: string
        description: string | null
        shortDesc: string | null
        demoUrl: string | null
        githubUrl: string | null
        techStack: any
        features: any
        challenges: string | null
        solutions: string | null
        status: string
        startDate: Date | null
        endDate: Date | null
        isPublic: boolean
        likes: number
        views: number
        createdAt: Date
        summary: any
        projectProfile: {
            userId: string
            user: {
                id: string
                name: string | null
                avatar: string | null
            }
        }
    }
    isOwner: boolean
}

export function ProjectViewEdit({ project, isOwner }: ProjectViewEditProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [editedTitle, setEditedTitle] = useState(project.title)
    const [editedDescription, setEditedDescription] = useState(project.description || '')
    const [editedShortDesc, setEditedShortDesc] = useState(project.shortDesc || '')
    const [editedTechStack, setEditedTechStack] = useState(project.techStack as string[])
    const [editedSummary, setEditedSummary] = useState(project.summary)

    const statusConfig = PROJECT_STATUSES.find(s => s.value === project.status)

    const handleSave = useCallback(async () => {
        if (!isOwner) return

        setIsSaving(true)
        try {
            // Update basic project information
            const updateResult = await updateProject(project.id, {
                title: editedTitle,
                description: editedDescription,
                shortDesc: editedShortDesc,
                techStack: editedTechStack,
                status: project.status as ProjectStatus,
                startDate: project.startDate || undefined,
                endDate: project.endDate || undefined,
                isPublic: project.isPublic,
                demoUrl: project.demoUrl || undefined,
                githubUrl: project.githubUrl || undefined,
                features: project.features,
                challenges: project.challenges || undefined,
                solutions: project.solutions || undefined,
                summary: editedSummary,
            })

            if (updateResult.success) {
                toast.success('Project updated successfully!')
                setIsEditing(false)
            } else {
                toast.error('Failed to update project')
            }
        } catch (error) {
            console.error('Error updating project:', error)
            toast.error('An error occurred while saving')
        } finally {
            setIsSaving(false)
        }
    }, [
        isOwner,
        project.id,
        editedTitle,
        editedDescription,
        editedShortDesc,
        editedTechStack,
        editedSummary,
        project.status,
        project.startDate,
        project.endDate,
        project.isPublic,
        project.demoUrl,
        project.githubUrl,
        project.features,
        project.challenges,
        project.solutions,
    ])

    const handleCancel = useCallback(() => {
        setEditedTitle(project.title)
        setEditedDescription(project.description || '')
        setEditedShortDesc(project.shortDesc || '')
        setEditedTechStack(project.techStack as string[])
        setEditedSummary(project.summary)
        setIsEditing(false)
    }, [project])


    // Auto-save functionality for the summary editor
    const handleSummarySave = useCallback(async (content: any) => {
        if (!isOwner) return

        try {
            const result = await updateProjectSummary(project.id, content)
            if (result.success) {
                setEditedSummary(content)
                toast.success('Summary saved automatically')
            }
        } catch (error) {
            console.error('Error auto-saving summary:', error)
        }
    }, [isOwner, project.id])

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                        {isEditing ? (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="text-3xl font-bold tracking-tight bg-transparent border-none outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 -mx-2 -my-1"
                                    placeholder="Project Title"
                                />
                                <input
                                    type="text"
                                    value={editedShortDesc}
                                    onChange={(e) => setEditedShortDesc(e.target.value)}
                                    className="text-lg text-muted-foreground bg-transparent border-none outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 -mx-2 -my-1 w-full"
                                    placeholder="Short description"
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
                                {project.shortDesc && (
                                    <p className="text-lg text-muted-foreground">{project.shortDesc}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {isOwner && (
                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        size="sm"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    variant="outline"
                                    size="sm"
                                >
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={project.projectProfile.user.avatar || ''} />
                            <AvatarFallback>
                                {project.projectProfile.user.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <Link
                            href={`/community/students/${project.projectProfile.userId}`}
                            className="hover:underline"
                        >
                            {project.projectProfile.user.name || 'Anonymous'}
                        </Link>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {project.createdAt.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {project.views} views
                    </div>
                </div>
            </div>

            {/* Project Links */}
            {(project.demoUrl || project.githubUrl) && (
                <div className="flex gap-3">
                    {project.demoUrl && (
                        <Button asChild>
                            <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Live Demo
                            </Link>
                        </Button>
                    )}
                    {project.githubUrl && (
                        <Button variant="outline" asChild>
                            <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4 mr-2" />
                                View Code
                            </Link>
                        </Button>
                    )}
                </div>
            )}

            <PlateEditor />
            {/* <ProjectEditorRegistry
                initialValue={editedSummary}
                contentId={project.id}
                onSave={handleSummarySave}
                readOnly={!isEditing}
                showStatusBar={isEditing}
                placeholder="Start writing your project's story... Use headings, lists, code blocks, and more to showcase your work!"
                className={cn(
                    "min-h-[500px] rounded-lg",
                    isEditing ? "border-2 border-primary/20" : "border border-border"
                )}
            /> */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>About This Project</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <textarea
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Project description"
                                />
                            ) : (
                                <p className="text-muted-foreground">{project.description}</p>
                            )}
                        </CardContent>
                    </Card>



                    {/* Features */}
                    {project.features && Array.isArray(project.features) && project.features.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Key Features</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {(project.features as string[]).map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-primary">•</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Challenges & Solutions */}
                    {(project.challenges || project.solutions) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Development Journey</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {project.challenges && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Challenges</h4>
                                        <p className="text-muted-foreground">{project.challenges}</p>
                                    </div>
                                )}
                                {project.solutions && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Solutions</h4>
                                        <p className="text-muted-foreground">{project.solutions}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Project Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Project Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm font-medium mb-1">Status</div>
                                <Badge variant={statusConfig?.color === 'green' ? 'default' : 'secondary'}>
                                    {statusConfig?.label || project.status}
                                </Badge>
                            </div>

                            {(project.startDate || project.endDate) && (
                                <div>
                                    <div className="text-sm font-medium mb-1">Timeline</div>
                                    <div className="text-sm text-muted-foreground">
                                        {project.startDate && (
                                            <div>Started: {project.startDate.toLocaleDateString()}</div>
                                        )}
                                        {project.endDate && (
                                            <div>Completed: {project.endDate.toLocaleDateString()}</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div>
                                <div className="text-sm font-medium mb-2">Tech Stack</div>
                                <div className="flex flex-wrap gap-2">
                                    {(editedTechStack).map((tech) => (
                                        <Badge key={tech} variant="outline" className="text-xs">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Engagement */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Community</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Heart className="h-4 w-4" />
                                    <span className="text-sm">{project.likes} likes</span>
                                </div>
                                <Button size="sm" variant="outline">
                                    <Heart className="h-4 w-4" />
                                </Button>
                            </div>

                            <Separator />

                            <div className="text-sm">
                                <div className="font-medium mb-1">Share this project</div>
                                <div className="text-muted-foreground">
                                    Help others discover this amazing work
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
