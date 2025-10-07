'use client';

import { ArrowRight, FileText, Github } from 'lucide-react';
import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import type { CreateProjectData } from '@/types/portfolio';
import { GitHubImportTab } from './github-import-tab';
import { ProjectFormFocused } from './project-form-focused';

type ProjectCreationMode = 'github' | 'manual';

type ProjectCreationStep1Props = {
  initialData: {
    mode: ProjectCreationMode;
    projectData: Partial<CreateProjectData>;
    generateFromReadme?: boolean;
  };
  onComplete: (data: {
    mode: ProjectCreationMode;
    projectData: Partial<CreateProjectData>;
    generateFromReadme?: boolean;
  }) => void;
  onCancel: () => void;
};

export function ProjectCreationStep1({
  initialData,
  onComplete,
  onCancel,
}: ProjectCreationStep1Props) {
  const [mode, setMode] = useState<ProjectCreationMode>(initialData.mode);
  const [projectData, setProjectData] = useState<Partial<CreateProjectData>>(
    initialData.projectData
  );
  const [generateFromReadme, setGenerateFromReadme] = useState<boolean>(
    initialData.generateFromReadme || false
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModeSelect = (selectedMode: ProjectCreationMode) => {
    setMode(selectedMode);
    setError(null);
  };

  const handleGitHubImport = (importedData: Partial<CreateProjectData>) => {
    setProjectData(prev => ({
      ...prev,
      ...importedData,
    }));
    setError(null);
  };

  const handleGitHubError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleManualFormSubmit = async (data: CreateProjectData) => {
    setProjectData(data);
    setError(null);
  };

  const handleContinue = () => {
    if (!projectData.title?.trim()) {
      setError('Project title is required');
      return;
    }

    if (!projectData.description?.trim()) {
      setError('Project description is required');
      return;
    }

    onComplete({ mode, projectData, generateFromReadme });
  };

  const canContinue =
    projectData.title?.trim() && projectData.description?.trim();

  return (
    <div className='space-y-6'>
      {/* Mode Selection */}
      <div className='space-y-4'>
        <div className='text-center space-y-2'>
          <h2 className='text-2xl font-bold'>Choose Your Project Source</h2>
          <p className='text-muted-foreground'>
            Import from GitHub or create manually from scratch
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              mode === 'github' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleModeSelect('github')}
          >
            <CardHeader className='text-center'>
              <div className='flex justify-center mb-2'>
                <Github className='h-8 w-8 text-muted-foreground' />
              </div>
              <CardTitle className='text-lg'>Import from GitHub</CardTitle>
              <CardDescription>
                Automatically populate project details from your GitHub
                repository
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2 text-sm text-muted-foreground'>
                <div className='flex items-center gap-2'>
                  <div className='w-1.5 h-1.5 bg-green-500 rounded-full' />
                  <span>Auto-detect tech stack</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-1.5 h-1.5 bg-green-500 rounded-full' />
                  <span>Extract features from README</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-1.5 h-1.5 bg-green-500 rounded-full' />
                  <span>Import repository metadata</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              mode === 'manual' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleModeSelect('manual')}
          >
            <CardHeader className='text-center'>
              <div className='flex justify-center mb-2'>
                <FileText className='h-8 w-8 text-muted-foreground' />
              </div>
              <CardTitle className='text-lg'>Manual Entry</CardTitle>
              <CardDescription>
                Create your project details manually with full control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2 text-sm text-muted-foreground'>
                <div className='flex items-center gap-2'>
                  <div className='w-1.5 h-1.5 bg-blue-500 rounded-full' />
                  <span>Custom project details</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-1.5 h-1.5 bg-blue-500 rounded-full' />
                  <span>Rich text editor</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-1.5 h-1.5 bg-blue-500 rounded-full' />
                  <span>Full customization</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant='destructive'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Content Based on Mode */}
      <div className='space-y-4'>
        {mode === 'github' ? (
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Github className='h-5 w-5' />
              <h3 className='text-lg font-semibold'>
                GitHub Repository Selection
              </h3>
            </div>
            <GitHubImportTab
              onImport={handleGitHubImport}
              onError={handleGitHubError}
            />

            {/* README Generation Option */}
            {projectData.title && (
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>Document Content</CardTitle>
                  <CardDescription>
                    Choose how to generate the project document content
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      id='generate-from-readme'
                      checked={generateFromReadme}
                      onChange={e => setGenerateFromReadme(e.target.checked)}
                      className='rounded border-gray-300'
                    />
                    <Label htmlFor='generate-from-readme' className='text-sm'>
                      Generate document content from README file
                    </Label>
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    If checked, the project document will be automatically
                    populated with content from the repository's README file.
                    Otherwise, you'll create the document content manually in
                    the next step.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              <h3 className='text-lg font-semibold'>Manual Project Details</h3>
            </div>
            <ProjectFormFocused
              onSubmit={handleManualFormSubmit}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* Project Preview */}
      {projectData.title && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Project Preview</CardTitle>
            <CardDescription>
              Review your project details before continuing
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div>
              <h4 className='font-medium'>{projectData.title}</h4>
              <p className='text-sm text-muted-foreground'>
                {projectData.description}
              </p>
            </div>
            {projectData.techStack && projectData.techStack.length > 0 && (
              <div className='flex flex-wrap gap-1'>
                {projectData.techStack.map(tech => (
                  <Badge key={tech} variant='secondary' className='text-xs'>
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
            {projectData.githubUrl && (
              <div className='text-sm text-muted-foreground'>
                <span className='font-medium'>GitHub:</span>{' '}
                {projectData.githubUrl}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className='flex justify-between'>
        <Button variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className='flex items-center gap-2'
        >
          Continue
          <ArrowRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
