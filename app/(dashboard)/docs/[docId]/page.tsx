import { Suspense } from 'react';

import { DocumentEditorWrapper } from '@/components/editor/document-editor-wrapper';
import { Separator } from '@/components/ui/separator';


import { getDocumentById, getDocumentDiscussionsByDocumentId } from '@/data/documents/get-document';
import { requireServerAuth } from '@/lib/auth/auth-server';
import { DiscussionEditorExample } from '@/components/editor/discussion-editor-example';
import { AsyncEditor } from '@/components/editor/async-editor';


interface DocumentPageProps {
  params: Promise<{
    docId: string;
  }>;
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { docId } = await params;

  const _documentPromise = getDocumentById(docId);
  const _documentDiscussionsPromise = getDocumentDiscussionsByDocumentId(docId);
  const user = await requireServerAuth();

  return (
    <div className=''>
      <div className='space-y-6'>
        {/* Document Header */}
        <div className='space-y-4'>
          {/* <div className='space-y-2'>
            <h1 className='text-3xl font-bold tracking-tight'>
              {document.title || 'Untitled Document'}
            </h1>
            {document.description && (
              <p className='text-muted-foreground text-lg'>
                {document.description}
              </p>
            )}
          </div> */}

          {/* Document Metadata */}
          {/* <div className='flex items-center justify-between'>
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
        </div> */}

          <Separator />

          {/* Document Content */}
          <Suspense fallback={<div>Loading...</div>}>
            {/* <DiscussionEditorExample
              documentId={docId}
              user={user}
              _documentPromise={_documentPromise}

            /> */}
            {/* <DocumentEditorWrapper
              _documentPromise={_documentPromise}
              _documentDiscussionsPromise={_documentDiscussionsPromise}
              userId={user.id}
            /> */}
            <AsyncEditor documentId={docId} />
          </Suspense>

          {/* Document Footer */}
          {/* <div className='text-xs text-muted-foreground space-y-1'>
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
        </div> */}

          {/* Comments Section */}
          <Separator />
          {/* <DocumentDiscussionContainer _discussionPromise={_documentDiscussionPromise} /> */}
        </div>
      </div>
    </div>
  );
}

