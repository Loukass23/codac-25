'use client';

import { useEditorRef, usePluginOption } from 'platejs/react';
import * as React from 'react';
import { toast } from 'sonner';

import { CommentCreateForm } from '../ui/comment';

import { discussionPlugin } from './plugins/discussion-kit';

interface CommentCreateFormWrapperProps {
  autoFocus?: boolean;
  className?: string;
  discussionId?: string;
  focusOnMount?: boolean;
}

/**
 * Custom wrapper for the CommentCreateForm component that integrates with the discussion plugin
 * This allows us to use database operations without modifying the shared UI component
 */
export function CommentCreateFormWrapper(props: CommentCreateFormWrapperProps) {
  const editor = useEditorRef();

  // Enhanced handler that uses the plugin's database integration
  const handleAddComment = React.useCallback(
    async (commentValue: any) => {
      if (!commentValue) return;

      try {
        if (props.discussionId) {
          // Add comment to existing discussion
          await editor
            .getPlugin(discussionPlugin)
            .transforms.discussion.addComment(props.discussionId, commentValue);
          toast.success('Comment added successfully');
        } else {
          // Create new discussion
          const { CommentPlugin } = await import('@platejs/comment/react');
          const commentsApi = editor.getApi(CommentPlugin).comment;
          const commentsNodeEntry = commentsApi.nodes({
            at: [],
            isDraft: true,
          });

          if (commentsNodeEntry.length === 0) return;

          const documentContent = commentsNodeEntry
            .map(([node]: [any, any]) => node.text)
            .join('');

          const newDiscussionId = await editor
            .getPlugin(discussionPlugin)
            .transforms.discussion.createDiscussion(documentContent);

          // Add the first comment to the new discussion
          await editor
            .getPlugin(discussionPlugin)
            .transforms.discussion.addComment(newDiscussionId, commentValue);

          // Update editor marks
          const { getCommentKey, getDraftCommentKey } = await import(
            '@platejs/comment'
          );
          commentsNodeEntry.forEach(([, path]: [any, any]) => {
            editor.tf.setNodes(
              {
                [getCommentKey(newDiscussionId)]: true,
              },
              { at: path, split: true }
            );
            editor.tf.unsetNodes([getDraftCommentKey()], { at: path });
          });

          toast.success('Discussion created successfully');
        }
      } catch (error) {
        console.error('Failed to add comment:', error);
        toast.error('Failed to add comment');
      }
    },
    [editor, props.discussionId]
  );

  // Create enhanced props that include our custom handler
  const enhancedProps = {
    ...props,
    onAddComment: handleAddComment,
  };

  return <CommentCreateForm {...enhancedProps} />;
}
