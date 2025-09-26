'use client';

import { usePluginOption } from 'platejs/react';
import * as React from 'react';


import { CommentDatabase, CommentCreateFormDatabase } from './comment-database';

import { discussionDatabasePlugin } from '@/components/editor/plugins/discussion-database-simple';


export function BlockDiscussionDatabase({
  discussionId,
}: {
  discussionId: string;
}) {
  const discussions = usePluginOption(discussionDatabasePlugin, 'discussions');
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const discussion = discussions.find(d => d.id === discussionId);

  if (!discussion) {
    return null;
  }

  const { comments } = discussion;

  return (
    <div className='my-4 rounded-lg border bg-background p-4 shadow-sm'>
      <div className='space-y-4'>
        {comments.map((comment, index) => (
          <CommentDatabase
            key={comment.id}
            comment={comment}
            discussionLength={comments.length}
            documentContent={discussion.documentContent}
            editingId={editingId}
            index={index}
            setEditingId={setEditingId}
            showDocumentContent={index === 0}
          />
        ))}

        <CommentCreateFormDatabase
          discussionId={discussionId}
          focusOnMount={false}
        />
      </div>

      {discussion.isResolved && (
        <div className='mt-4 flex items-center gap-2 text-sm text-muted-foreground'>
          <div className='h-2 w-2 rounded-full bg-green-500' />
          <span>This discussion has been resolved</span>
        </div>
      )}
    </div>
  );
}
