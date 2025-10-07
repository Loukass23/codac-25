'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';

import type { CreateProjectData } from '@/types/portfolio';
import { ProjectCreationStep1 } from './project-creation-step1';
import { ProjectCreationStep2 } from './project-creation-step2';
import { ProjectCreationStep3 } from './project-creation-step3';

type ProjectCreationMode = 'github' | 'manual';
type DocumentOption = 'create-new' | 'link-existing';

export type ProjectCreationData = {
  mode: ProjectCreationMode;
  documentOption: DocumentOption;
  existingDocumentId?: string;
  projectData: Partial<CreateProjectData>;
  documentContent?: any; // Plate.js content
  generateFromReadme?: boolean; // Whether to generate document content from README
};

type ProjectCreationStepperProps = {
  onSubmit: (data: CreateProjectData) => Promise<{ error?: string } | void>;
  isLoading?: boolean;
};

const STEPS = [
  { id: 1, title: 'Source', description: 'Choose GitHub or Manual entry' },
  { id: 2, title: 'Document', description: 'Link or create project document' },
  { id: 3, title: 'Review', description: 'Confirm and publish' },
] as const;

export function ProjectCreationStepper({
  onSubmit,
  isLoading = false,
}: ProjectCreationStepperProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectCreationData>({
    mode: 'manual',
    documentOption: 'create-new',
    projectData: {
      title: '',
      description: '',
      shortDesc: '',
      techStack: [],
      features: [],
      demoUrl: '',
      githubUrl: '',
      status: 'PLANNING',
      isPublic: true,
    },
    generateFromReadme: false,
  });

  const progress = (currentStep / STEPS.length) * 100;

  const handleStep1Complete = (data: {
    mode: ProjectCreationMode;
    projectData: Partial<CreateProjectData>;
    generateFromReadme?: boolean;
  }) => {
    setFormData(prev => ({
      ...prev,
      mode: data.mode,
      projectData: { ...prev.projectData, ...data.projectData },
      generateFromReadme: data.generateFromReadme,
    }));
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: {
    documentOption: DocumentOption;
    existingDocumentId?: string;
    documentContent?: any;
  }) => {
    setFormData(prev => ({
      ...prev,
      documentOption: data.documentOption,
      existingDocumentId: data.existingDocumentId,
      documentContent: data.documentContent,
    }));
    setCurrentStep(3);
  };

  const handleStep3Complete = async () => {
    try {
      // Combine all data into final project data
      const finalProjectData: CreateProjectData = {
        ...formData.projectData,
      } as CreateProjectData;

      const result = await onSubmit(finalProjectData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Project created successfully!');
        router.push('/projects');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Project creation error:', error);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProjectCreationStep1
            initialData={{
              mode: formData.mode,
              projectData: formData.projectData,
              generateFromReadme: formData.generateFromReadme,
            }}
            onComplete={handleStep1Complete}
            onCancel={handleCancel}
          />
        );
      case 2:
        return (
          <ProjectCreationStep2
            initialData={{
              documentOption: formData.documentOption,
              existingDocumentId: formData.existingDocumentId,
              documentContent: formData.documentContent,
            }}
            projectData={formData.projectData}
            generateFromReadme={formData.generateFromReadme}
            onComplete={handleStep2Complete}
            onPrevious={handlePrevious}
            onCancel={handleCancel}
          />
        );
      case 3:
        return (
          <ProjectCreationStep3
            formData={formData}
            onComplete={handleStep3Complete}
            onPrevious={handlePrevious}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='w-full max-w-4xl mx-auto space-y-6'>
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>Create New Project</span>
            <Badge variant='outline'>
              Step {currentStep} of {STEPS.length}
            </Badge>
          </CardTitle>
          <div className='space-y-2'>
            <Progress value={progress} className='h-2' />
            <div className='flex justify-between text-sm text-muted-foreground'>
              <span>{STEPS[currentStep - 1]?.title}</span>
              <span>{STEPS[currentStep - 1]?.description}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Step Navigation */}
      <div className='flex items-center justify-center space-x-4'>
        {STEPS.map((step, index) => (
          <div key={step.id} className='flex items-center'>
            <div className='flex items-center space-x-2'>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep > step.id
                    ? 'bg-green-500 border-green-500 text-white'
                    : currentStep === step.id
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-background border-muted-foreground text-muted-foreground'
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle className='w-4 h-4' />
                ) : (
                  <span className='text-sm font-medium'>{step.id}</span>
                )}
              </div>
              <div className='hidden sm:block'>
                <div className='text-sm font-medium'>{step.title}</div>
                <div className='text-xs text-muted-foreground'>
                  {step.description}
                </div>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div className='hidden sm:block w-8 h-px bg-border mx-4' />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className='p-6'>{renderStep()}</CardContent>
      </Card>
    </div>
  );
}
