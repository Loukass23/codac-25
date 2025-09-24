'use client';

import * as React from 'react';

import { type Value } from 'platejs';
import { Plate } from 'platejs/react';

import { EditorKit } from '@/components/editor/editor-kit';
import { DiscussionDatabaseKit } from '@/components/editor/plugins/discussion-database-simple';
import { CommentKit } from '@/components/editor/plugins/comment-kit';

interface ProjectEditorWithDatabaseCommentsProps {
  projectId: string;
  initialValue: Value;
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  onSave?: (value: Value) => void;
}

export function ProjectEditorWithDatabaseComments({
  projectId,
  initialValue,
  currentUser,
  onSave,
}: ProjectEditorWithDatabaseCommentsProps) {
  const [value, setValue] = React.useState<Value>(initialValue);

  // Initialize the discussion database plugin with document context
  const discussionConfig = React.useMemo(
    () => ({
      currentUserId: currentUser.id,
      currentUser: {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatar,
      },
      documentId: projectId, // This should be the document ID, not project ID
      discussions: [],
      users: {
        [currentUser.id]: {
          id: currentUser.id,
          name: currentUser.name,
          avatarUrl: currentUser.avatar || '',
        },
      },
    }),
    [projectId, currentUser]
  );

  // Load discussions when component mounts
  React.useEffect(() => {
    // This would be called by the plugin's loadDiscussions transform
    // when the editor is ready
  }, [projectId]);

  const handleChange = (newValue: Value) => {
    setValue(newValue);
    onSave?.(newValue);
  };

  return (
    <div className='w-full'>
      <Plate
        value={value}
        plugins={[...EditorKit, ...CommentKit, ...DiscussionDatabaseKit]}
        options={{
          discussionDatabase: discussionConfig,
        }}
      >
        {/* Your editor components here */}
        <div className='min-h-[400px] border rounded-lg p-4'>
          {/* This would be your actual editor component */}
          <p>Project Editor with Database Comments</p>
          <p>Project ID: {projectId}</p>
          <p>Current User: {currentUser.name}</p>
        </div>
      </Plate>
    </div>
  );
}
