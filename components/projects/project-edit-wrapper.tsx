"use client";

import { Value } from 'platejs';
import { useEffect, useState } from 'react';


import { jsonToPlateValue } from '@/lib/plate/utils';

import { ProjectEditorOptimized } from './project-editor-optimized';

interface Project {
    id: string;
    title: string;
    description?: string;
    summary: unknown;
    projectProfile: {
        userId: string;
    };
}

interface ProjectEditWrapperProps {
    project: Project;
    userId: string;
}

export function ProjectEditWrapper({ project, userId: _userId }: ProjectEditWrapperProps) {
    const [plateValue, setPlateValue] = useState<Value>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Convert project summary to Plate.js value
        const convertedValue = jsonToPlateValue(project.summary);
        setPlateValue(convertedValue);
        setIsLoading(false);
    }, [project.summary]);

    const handleSave = async (value: Value) => {
        // TODO: Implement actual save functionality
        // This would typically call a server action to update the project
        console.warn('Saving project content:', value);

        // For now, we'll just simulate a save
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-muted-foreground">Loading editor...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <ProjectEditorOptimized
                initialValue={plateValue}
                projectId={project.id}
                onSave={handleSave}
                autoSave={true}
                autoSaveInterval={30000} // 30 seconds
                showBackButton={true}
                backLink={`/projects/${project.id}`}
            />
        </div>
    );
}
