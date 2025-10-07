'use client';

import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
  Github,
  Globe,
  Link,
  Loader2,
  Settings,
} from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';

import type { ProjectCreationData } from './project-creation-stepper';

type ProjectCreationStep3Props = {
  formData: ProjectCreationData;
  onComplete: () => void;
  onPrevious: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export function ProjectCreationStep3({
  formData,
  onComplete,
  onPrevious,
  onCancel,
  isLoading = false,
}: ProjectCreationStep3Props) {
  const [isPublic, setIsPublic] = useState(
    formData.projectData.isPublic ?? true
  );
  const [showPreview, setShowPreview] = useState(false);

  const handlePublish = () => {
    onComplete();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PAUSED':
        return 'bg-orange-100 text-orange-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold'>Review & Publish</h2>
        <p className='text-muted-foreground'>
          Review your project details and publish to the community
        </p>
      </div>

      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <CheckCircle className='h-5 w-5 text-green-500' />
            Project Summary
          </CardTitle>
          <CardDescription>
            Review all the details before publishing your project
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <h3 className='font-semibold text-lg'>
                {formData.projectData.title}
              </h3>
              <p className='text-muted-foreground'>
                {formData.projectData.description}
              </p>
              {formData.projectData.shortDesc && (
                <p className='text-sm text-muted-foreground mt-1'>
                  {formData.projectData.shortDesc}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Badge
                  className={getStatusColor(
                    formData.projectData.status || 'PLANNING'
                  )}
                >
                  {formData.projectData.status?.replace('_', ' ') || 'PLANNING'}
                </Badge>
                <Badge variant='outline'>
                  {formData.mode === 'github'
                    ? 'GitHub Import'
                    : 'Manual Entry'}
                </Badge>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                {isPublic ? (
                  <>
                    <Eye className='h-4 w-4' />
                    <span>Public Project</span>
                  </>
                ) : (
                  <>
                    <EyeOff className='h-4 w-4' />
                    <span>Private Project</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack & Features */}
      {(formData.projectData.techStack?.length ||
        formData.projectData.features?.length) && (
        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {formData.projectData.techStack &&
              formData.projectData.techStack.length > 0 && (
                <div>
                  <h4 className='font-medium mb-2'>Tech Stack</h4>
                  <div className='flex flex-wrap gap-2'>
                    {formData.projectData.techStack.map(tech => (
                      <Badge key={tech} variant='secondary'>
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {formData.projectData.features &&
              formData.projectData.features.length > 0 && (
                <div>
                  <h4 className='font-medium mb-2'>Features</h4>
                  <ul className='space-y-1'>
                    {formData.projectData.features.map((feature, index) => (
                      <li
                        key={index}
                        className='text-sm text-muted-foreground flex items-center gap-2'
                      >
                        <CheckCircle className='h-3 w-3 text-green-500' />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Links */}
      {(formData.projectData.githubUrl || formData.projectData.demoUrl) && (
        <Card>
          <CardHeader>
            <CardTitle>Project Links</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {formData.projectData.githubUrl && (
              <div className='flex items-center gap-3'>
                <Github className='h-4 w-4 text-muted-foreground' />
                <a
                  href={formData.projectData.githubUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline text-sm'
                >
                  {formData.projectData.githubUrl}
                </a>
              </div>
            )}
            {formData.projectData.demoUrl && (
              <div className='flex items-center gap-3'>
                <Globe className='h-4 w-4 text-muted-foreground' />
                <a
                  href={formData.projectData.demoUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline text-sm'
                >
                  {formData.projectData.demoUrl}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Document Information */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' />
            Document Information
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex items-center gap-3'>
            {formData.documentOption === 'create-new' ? (
              <>
                <FileText className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>New document will be created</span>
              </>
            ) : (
              <>
                <Link className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>Linking to existing document</span>
              </>
            )}
          </div>

          {formData.documentOption === 'create-new' &&
            formData.generateFromReadme && (
              <div className='p-3 bg-blue-50 border border-blue-200 rounded-md'>
                <div className='flex items-center gap-2 text-blue-800'>
                  <FileText className='h-4 w-4' />
                  <span className='text-sm font-medium'>README Generation</span>
                </div>
                <p className='text-xs text-blue-700 mt-1'>
                  Document content will be automatically generated from the
                  repository's README file.
                </p>
              </div>
            )}

          {formData.documentOption === 'link-existing' &&
            formData.existingDocumentId && (
              <div className='text-sm text-muted-foreground'>
                Document ID: {formData.existingDocumentId}
              </div>
            )}
        </CardContent>
      </Card>

      {/* GitHub Import Metadata */}
      {formData.mode === 'github' && formData.projectData.githubImportData && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Github className='h-5 w-5' />
              GitHub Import Details
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
              <div>
                <span className='text-muted-foreground'>Stars:</span>
                <div className='font-medium'>
                  {formData.projectData.githubImportData.stars}
                </div>
              </div>
              <div>
                <span className='text-muted-foreground'>Forks:</span>
                <div className='font-medium'>
                  {formData.projectData.githubImportData.forks}
                </div>
              </div>
              <div>
                <span className='text-muted-foreground'>Size:</span>
                <div className='font-medium'>
                  {formData.projectData.githubImportData.size} KB
                </div>
              </div>
              <div>
                <span className='text-muted-foreground'>Language:</span>
                <div className='font-medium'>
                  {formData.projectData.githubImportData.language || 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publishing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='h-5 w-5' />
            Publishing Settings
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label htmlFor='public-toggle'>Make project public</Label>
              <p className='text-sm text-muted-foreground'>
                Public projects are visible to everyone in the community
              </p>
            </div>
            <Switch
              id='public-toggle'
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          {!isPublic && (
            <Alert>
              <AlertDescription>
                Private projects are only visible to you and won't appear in the
                community showcase.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className='flex justify-between'>
        <Button
          variant='outline'
          onClick={onPrevious}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
          Previous
        </Button>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isLoading}
            className='flex items-center gap-2'
          >
            {isLoading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Publishing...
              </>
            ) : (
              <>
                <CheckCircle className='h-4 w-4' />
                Publish Project
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
