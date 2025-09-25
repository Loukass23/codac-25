'use client';

import * as React from 'react';
import { useEditorRef, usePluginOption } from 'platejs/react';
import { toast } from 'sonner';

import { discussionPlugin } from './plugins/discussion-kit';
import { Comment } from '../ui/comment';

interface CommentWrapperProps {
  comment: any;
  discussionLength: number;
  editingId: string | null;
  index: number;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  documentContent?: string;
  showDocumentContent?: boolean;
  onEditorClick?: () => void;
}

/**
 * Custom wrapper for the Comment component that integrates with the discussion plugin
 * This allows us to use database operations without modifying the shared UI component
 */
export function CommentWrapper(props: CommentWrapperProps) {
  const editor = useEditorRef();
  const currentUserId = usePluginOption(discussionPlugin, 'currentUserId');

  // Enhanced handlers that use the plugin's database integration
  const handleResolveDiscussion = React.useCallback(
    async (discussionId: string) => {
      try {
        const result = await editor
          .getPlugin(discussionPlugin)
          .transforms.discussion.handleCommentOperation(
            'resolve',
            discussionId,
            true
          );

        if (result.success) {
          toast.success('Discussion resolved successfully');
        } else {
          toast.error(result.error || 'Failed to resolve discussion');
        }
      } catch (error) {
        console.error('Failed to resolve discussion:', error);
        toast.error('Failed to resolve discussion');
      }
    },
    [editor]
  );

  const handleUpdateComment = React.useCallback(
    async (input: {
      id: string;
      contentRich: any;
      discussionId: string;
      isEdited: boolean;
    }) => {
      try {
        const result = await editor
          .getPlugin(discussionPlugin)
          .transforms.discussion.handleCommentOperation(
            'update',
            input.id,
            input.contentRich
          );

        if (result.success) {
          toast.success('Comment updated successfully');
        } else {
          toast.error(result.error || 'Failed to update comment');
        }
      } catch (error) {
        console.error('Failed to update comment:', error);
        toast.error('Failed to update comment');
      }
    },
    [editor]
  );

  const handleDeleteComment = React.useCallback(
    async (commentId: string, discussionId: string) => {
      try {
        const result = await editor
          .getPlugin(discussionPlugin)
          .transforms.discussion.handleCommentOperation(
            'delete',
            commentId,
            discussionId
          );

        if (result.success) {
          toast.success('Comment deleted successfully');
        } else {
          toast.error(result.error || 'Failed to delete comment');
        }
      } catch (error) {
        console.error('Failed to delete comment:', error);
        toast.error('Failed to delete comment');
      }
    },
    [editor]
  );

  // Create enhanced props that include our custom handlers
  const enhancedProps = {
    ...props,
    // Override the comment component's internal handlers with our database-integrated ones
    onResolveDiscussion: handleResolveDiscussion,
    onUpdateComment: handleUpdateComment,
    onDeleteComment: handleDeleteComment,
    currentUserId,
  };

  return <Comment {...enhancedProps} />;
}
