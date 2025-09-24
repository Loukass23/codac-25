import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

import { DocumentCommentsDisplay } from '@/components/document/document-comments-display';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getDocumentComments } from '@/data/projects/get-document-comments';
import { getDocumentById } from '@/data/projects/get-documents';
import { requireServerAuth } from '@/lib/auth/auth-server';

import { DocumentEditorWrapper } from '../../../../components/editor/document-editor-wrapper';
import { Suspense } from 'react';

interface DocumentPageProps {
  params: Promise<{
    username: string;
    docId: string;
  }>;
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { docId } = await params;
  const user = await requireServerAuth();
  if (!user) {
    notFound();
  }

  // Fetch the document and comments in parallel
  const [document, comments] = await Promise.all([
    getDocumentById(docId),
    getDocumentComments(docId),
  ]);

  if (!document) {
    notFound();
  }
  console.log(comments);
  // Check if user has access to view this document
  // For now, we'll allow access to published documents or if user is the author
  const canView = document.isPublished || document.author.id === user.id;

  if (!canView) {
    notFound();
  }

  return (
    <div className=''>
      <div className='space-y-6'>
        {/* Document Header */}
        <div className='space-y-4'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold tracking-tight'>
              {document.title || 'Untitled Document'}
            </h1>
            {document.description && (
              <p className='text-muted-foreground text-lg'>
                {document.description}
              </p>
            )}
          </div>

          {/* Document Metadata */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                {document.author.avatar ? (
                  <img
                    src={document.author.avatar}
                    alt={document.author.name || 'Author'}
                    className='h-8 w-8 rounded-full'
                  />
                ) : (
                  <div className='h-8 w-8 rounded-full bg-muted flex items-center justify-center'>
                    <span className='text-sm font-medium'>
                      {document.author.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                )}
                <div>
                  <p className='text-sm font-medium'>
                    {document.author.name || 'Unknown Author'}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {formatDistanceToNow(new Date(document.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <Badge variant='secondary'>
                {document.documentType.replace('_', ' ')}
              </Badge>
              {document.isPublished ? (
                <Badge variant='default'>Published</Badge>
              ) : (
                <Badge variant='outline'>Draft</Badge>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Document Content */}
        <Suspense fallback={<div>Loading...</div>}>
          <DocumentEditorWrapper
            documentId={document.id}
            initialValue={document.content}
            currentUser={user}
          />
        </Suspense>

        {/* Document Footer */}
        <div className='text-xs text-muted-foreground space-y-1'>
          <p>Version {document.version}</p>
          <p>
            Last updated{' '}
            {formatDistanceToNow(new Date(document.updatedAt), {
              addSuffix: true,
            })}
          </p>
          {document.project && (
            <p>
              Related to project:{' '}
              <span className='font-medium'>{document.project.title}</span>
            </p>
          )}
        </div>

        {/* Comments Section */}
        <Separator />
        {/* <DocumentCommentsDisplay comments={comments} documentId={document.id} /> */}
      </div>
    </div>
  );
}
