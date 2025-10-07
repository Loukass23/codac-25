'use client';

import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Link,
  Plus,
  Search,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

import type { CreateProjectData } from '@/types/portfolio';
import { ProjectSummaryEditor } from './project-summary-editor';

type DocumentOption = 'create-new' | 'link-existing';

type ProjectCreationStep2Props = {
  initialData: {
    documentOption: DocumentOption;
    existingDocumentId?: string;
    documentContent?: any;
  };
  projectData: Partial<CreateProjectData>;
  generateFromReadme?: boolean;
  onComplete: (data: {
    documentOption: DocumentOption;
    existingDocumentId?: string;
    documentContent?: any;
  }) => void;
  onPrevious: () => void;
  onCancel: () => void;
};

// Mock document data - in real app, this would come from API
const mockDocuments = [
  {
    id: '1',
    title: 'My React Portfolio',
    description: 'A showcase of my React projects',
    type: 'project_summary',
  },
  {
    id: '2',
    title: 'E-commerce App Documentation',
    description: 'Complete documentation for my e-commerce project',
    type: 'project_summary',
  },
  {
    id: '3',
    title: 'Learning Journey',
    description: 'My coding journey and lessons learned',
    type: 'blog_post',
  },
];

export function ProjectCreationStep2({
  initialData,
  projectData,
  generateFromReadme = false,
  onComplete,
  onPrevious,
  onCancel,
}: ProjectCreationStep2Props) {
  const [documentOption, setDocumentOption] = useState<DocumentOption>(
    initialData.documentOption
  );
  const [existingDocumentId, setExistingDocumentId] = useState<
    string | undefined
  >(initialData.existingDocumentId);
  const [documentContent, setDocumentContent] = useState<any>(
    initialData.documentContent || [
      {
        type: 'p',
        children: [{ text: '' }],
      },
    ]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Filter documents based on search query
  const filteredDocuments = mockDocuments.filter(
    doc =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = () => {
    if (documentOption === 'link-existing' && !existingDocumentId) {
      setError('Please select a document to link');
      return;
    }

    if (documentOption === 'create-new' && !documentContent) {
      setError('Please add some content to your document');
      return;
    }

    setError(null);
    onComplete({
      documentOption,
      existingDocumentId,
      documentContent:
        documentOption === 'create-new' ? documentContent : undefined,
    });
  };

  const canContinue =
    documentOption === 'link-existing'
      ? !!existingDocumentId
      : !!documentContent;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold'>Project Document</h2>
        <p className='text-muted-foreground'>
          Link an existing document or create a new one for your project
        </p>
      </div>

      {/* Document Option Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Document Option</CardTitle>
          <CardDescription>
            You can either link to an existing document or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={documentOption}
            onValueChange={(value: string) => {
              setDocumentOption(value as DocumentOption);
              setError(null);
            }}
            className='space-y-4'
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='create-new' id='create-new' />
              <Label htmlFor='create-new' className='flex-1 cursor-pointer'>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <Plus className='h-4 w-4' />
                    <span className='font-medium'>Create New Document</span>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Create a new document with rich content for your project
                  </p>
                </div>
              </Label>
            </div>

            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='link-existing' id='link-existing' />
              <Label htmlFor='link-existing' className='flex-1 cursor-pointer'>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <Link className='h-4 w-4' />
                    <span className='font-medium'>Link Existing Document</span>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Link to an existing document you've already created
                  </p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant='destructive'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Content Based on Selection */}
      {documentOption === 'create-new' ? (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Create New Document
            </CardTitle>
            <CardDescription>
              {generateFromReadme
                ? 'Document content will be generated from the README file'
                : 'Write a detailed summary of your project using our rich text editor'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='document-title'>Document Title</Label>
                <Input
                  id='document-title'
                  value={projectData.title || ''}
                  placeholder='Enter document title'
                  className='mt-1'
                  readOnly
                />
              </div>

              <div>
                <Label htmlFor='document-description'>
                  Document Description
                </Label>
                <Textarea
                  id='document-description'
                  value={projectData.description || ''}
                  placeholder='Enter document description'
                  className='mt-1'
                  rows={3}
                  readOnly
                />
              </div>

              {generateFromReadme ? (
                <div className='p-4 bg-blue-50 border border-blue-200 rounded-md'>
                  <div className='flex items-center gap-2 text-blue-800'>
                    <FileText className='h-4 w-4' />
                    <span className='font-medium'>README Content</span>
                  </div>
                  <p className='text-sm text-blue-700 mt-1'>
                    The document content will be automatically generated from
                    the repository's README file when the project is created.
                  </p>
                </div>
              ) : (
                <div>
                  <Label>Project Summary Content</Label>
                  <div className='mt-2 border rounded-md'>
                    <ProjectSummaryEditor
                      initialValue={documentContent}
                      onChange={value => setDocumentContent(value)}
                      placeholder='Write a detailed summary of your project...'
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Link className='h-5 w-5' />
              Link Existing Document
            </CardTitle>
            <CardDescription>
              Search and select from your existing documents
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='search-documents'>Search Documents</Label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  id='search-documents'
                  placeholder='Search documents by title or description...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label>Available Documents</Label>
              <div className='space-y-2 max-h-60 overflow-y-auto'>
                {filteredDocuments.length === 0 ? (
                  <div className='text-center py-8 text-muted-foreground'>
                    <FileText className='h-8 w-8 mx-auto mb-2' />
                    <p>No documents found</p>
                    <p className='text-sm'>
                      Try adjusting your search or create a new document
                    </p>
                  </div>
                ) : (
                  filteredDocuments.map(doc => (
                    <Card
                      key={doc.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        existingDocumentId === doc.id
                          ? 'ring-2 ring-primary'
                          : ''
                      }`}
                      onClick={() => {
                        setExistingDocumentId(doc.id);
                        setError(null);
                      }}
                    >
                      <CardContent className='p-4'>
                        <div className='space-y-2'>
                          <div className='flex items-start justify-between'>
                            <h4 className='font-medium'>{doc.title}</h4>
                            <Badge variant='outline' className='text-xs'>
                              {doc.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className='text-sm text-muted-foreground'>
                            {doc.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {existingDocumentId && (
              <Alert>
                <AlertDescription>
                  Selected document:{' '}
                  <strong>
                    {
                      filteredDocuments.find(d => d.id === existingDocumentId)
                        ?.title
                    }
                  </strong>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

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
            onClick={handleContinue}
            disabled={!canContinue}
            className='flex items-center gap-2'
          >
            Continue
            <ArrowRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
