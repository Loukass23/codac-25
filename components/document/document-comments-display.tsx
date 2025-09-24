'use client';

import { formatDistanceToNow } from 'date-fns';

import { PlateStaticEditor } from '@/components/editor/plate-editor-static';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { DocumentCommentWithAuthor } from '@/data/projects/get-document-comments';

interface DocumentCommentsDisplayProps {
  comments: DocumentCommentWithAuthor[];
  documentId: string;
}

function CommentItem({ comment }: { comment: DocumentCommentWithAuthor }) {
  return (
    <Card className='mb-4'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.name ?? 'Author'}
                className='h-6 w-6 rounded-full'
              />
            ) : (
              <div className='h-6 w-6 rounded-full bg-muted flex items-center justify-center'>
                <span className='text-xs font-medium'>
                  {comment.author.name?.charAt(0) ?? 'A'}
                </span>
              </div>
            )}
            <div>
              <p className='text-sm font-medium'>
                {comment.author.name ?? 'Unknown Author'}
              </p>
              <p className='text-xs text-muted-foreground'>
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            {comment.isResolved ? (
              <Badge variant='default' className='text-xs'>
                Resolved
              </Badge>
            ) : (
              <Badge variant='outline' className='text-xs'>
                Active
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='prose prose-sm max-w-none dark:prose-invert'>
          <PlateStaticEditor initialValue={comment.content} />
        </div>

        {/* Show document content that was commented on */}
        {comment.documentContent && (
          <div className='mt-3 p-3 bg-muted rounded-md'>
            <p className='text-xs text-muted-foreground mb-1'>Commented on:</p>
            <p className='text-sm italic'>
              &ldquo;{comment.documentContent}&rdquo;
            </p>
          </div>
        )}

        {/* Show replies */}
        {comment.replies.length > 0 && (
          <div className='mt-4 space-y-3'>
            <Separator />
            <div className='ml-4 space-y-3'>
              {comment.replies.map(reply => (
                <div key={reply.id} className='flex items-start space-x-2'>
                  {reply.author.avatar ? (
                    <img
                      src={reply.author.avatar}
                      alt={reply.author.name ?? 'Author'}
                      className='h-5 w-5 rounded-full mt-0.5'
                    />
                  ) : (
                    <div className='h-5 w-5 rounded-full bg-muted flex items-center justify-center mt-0.5'>
                      <span className='text-xs font-medium'>
                        {reply.author.name?.charAt(0) ?? 'A'}
                      </span>
                    </div>
                  )}
                  <div className='flex-1'>
                    <div className='flex items-center space-x-2 mb-1'>
                      <p className='text-xs font-medium'>
                        {reply.author.name ?? 'Unknown Author'}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {formatDistanceToNow(new Date(reply.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div className='prose prose-xs max-w-none dark:prose-invert'>
                      <PlateStaticEditor initialValue={reply.content} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DocumentCommentsDisplay({
  comments,
  documentId: _documentId,
}: DocumentCommentsDisplayProps) {
  if (comments.length === 0) {
    return (
      <Card>
        <CardContent className='p-6 text-center'>
          <p className='text-muted-foreground'>No comments yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Comments ({comments.length})</h3>
      </div>

      <div className='space-y-4'>
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
