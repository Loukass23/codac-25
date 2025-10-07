'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CreateProjectData } from '@/types/portfolio';
import { useState } from 'react';
import { GitHubImportTab } from './github-import-tab';
import { ProjectFormFocused } from './project-form-focused';

type ProjectFormWithGitHubProps = {
  onSubmit: (data: CreateProjectData) => Promise<{ error?: string } | void>;
  isLoading?: boolean;
};

export function ProjectFormWithGitHub({
  onSubmit,
  isLoading = false,
}: ProjectFormWithGitHubProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'github'>('manual');
  const [formData, setFormData] = useState<Partial<CreateProjectData>>({
    title: '',
    description: '',
    shortDesc: '',
    summary: [
      {
        type: 'p',
        children: [{ text: '' }],
      },
    ],
    techStack: [],
    features: [],
    demoUrl: '',
    githubUrl: '',
    status: 'PLANNING',
    isPublic: true,
  });

  const handleGitHubImport = (importedData: Partial<CreateProjectData>) => {
    // Merge imported data with existing form data
    setFormData(prev => ({
      ...prev,
      ...importedData,
    }));
    // Switch to manual tab to let user review and edit
    setActiveTab('manual');
  };

  const handleSubmit = async (data: CreateProjectData) => {
    return onSubmit(data);
  };

  return (
    <div className='w-full max-w-4xl mx-auto'>
      <Tabs
        value={activeTab}
        onValueChange={v => setActiveTab(v as 'manual' | 'github')}
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='manual'>Manual Entry</TabsTrigger>
          <TabsTrigger value='github'>Import from GitHub</TabsTrigger>
        </TabsList>

        <TabsContent value='manual' className='mt-6'>
          <ProjectFormFocused onSubmit={handleSubmit} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value='github' className='mt-6'>
          <GitHubImportTab onImport={handleGitHubImport} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
