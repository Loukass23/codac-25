'use client';

import { Project } from '@prisma/client';
import { use } from 'react';

import { ProjectSummaryDisplay } from './project-summary-display';

interface ProjectContentProps {
  _projectPromise: Promise<Project & {
    document?: {
      id: string;
      content: any;
      title: string | null;
      description: string | null;
    } | null;
  }>;
}

export function ProjectContent({ _projectPromise }: ProjectContentProps) {
  const project = use(_projectPromise);

  // If no document or content, show placeholder
  if (!project.document || !project.document.content) {
    return (
      <div className="text-muted-foreground italic">
        No project summary available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Project Summary</h3>
        <ProjectSummaryDisplay
          content={project.document.content}
          className="border rounded-lg p-4"
        />
      </div>
    </div>
  );
}