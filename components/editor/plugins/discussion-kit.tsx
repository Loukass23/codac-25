'use client';

import { createPlatePlugin } from 'platejs/react';

import {
  createDiscussion,
  createComment,
  updateComment,
  resolveDiscussion,
} from '@/actions/projects/discussion-actions';
import {
  getDocumentDiscussions,
  getDiscussionUsers,
  getCurrentUserForDiscussion,
  type UserData,
} from '@/data/documents/get-document-discussions';

// Re-export UserData for other components
export type { UserData };

import { BlockDiscussion } from '../../ui/block-discussion';
import { TComment } from '../../ui/comment';

export interface SimpleUser {
  id: string;
  name: string;
  avatar: string;
}
export interface TDiscussion {
  id: string;
  comments: TComment[];
  createdAt: Date;
  isResolved: boolean;
  userId: string;
  documentContent?: string;
}

export interface TDiscussionConfig {
  currentUserId: string;
  currentUser: UserData;
  documentId: string;
  discussions: TDiscussion[];
  users: Record<string, UserData>;
}

// Helper functions for database operations
export const discussionDatabaseHelpers = {
  // Load discussions from database
  async loadDiscussions(
    documentId: string,
    setOption: (key: string, value: unknown) => void
  ) {
    try {
      const [discussions, users, currentUser] = await Promise.all([
        getDocumentDiscussions(documentId),
        getDiscussionUsers(documentId),
        getCurrentUserForDiscussion(),
      ]);
      console.log('discussions', discussions);
      console.log('users', users);
      console.log('currentUser', currentUser);
      // Update plugin options
      setOption('discussions', discussions);
      setOption('users', users);
      setOption('currentUser', currentUser);
      setOption('currentUserId', currentUser?.id ?? '');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load discussions:', error);
      // Set empty state on error
      setOption('discussions', []);
      setOption('users', {});
      setOption('currentUser', undefined);
      setOption('currentUserId', '');
      // Could dispatch a toast notification here for user feedback
      throw new Error(
        `Failed to load discussions for document ${documentId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  // Create a new discussion
  async createDiscussion(documentId: string, documentContent?: string) {
    try {
      const result = await createDiscussion({ documentId, documentContent });
      if (result.success && result.data) {
        return result.data.discussionId;
      } else {
        throw new Error('Failed to create discussion');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to create discussion:', error);
      throw error;
    }
  },

  // Add a comment to a discussion
  async addComment(discussionId: string, contentRich: any, parentId?: string) {
    try {
      const result = await createComment({
        discussionId,
        contentRich,
        parentId,
      });
      if (result.success && result.data) {
        return result.data.commentId;
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add comment:', error);
      throw error;
    }
  },

  // Update a comment
  async updateComment(commentId: string, contentRich: any) {
    try {
      const result = await updateComment({ commentId, contentRich });
      if (result.success && result.data) {
        return result.data.commentId;
      } else {
        throw new Error('Failed to update comment');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update comment:', error);
      throw error;
    }
  },

  // Resolve/unresolve a discussion
  async resolveDiscussion(discussionId: string, isResolved: boolean) {
    try {
      const result = await resolveDiscussion({ discussionId, isResolved });
      if (result.success && result.data) {
        return result.data.discussionId;
      } else {
        throw new Error('Failed to resolve discussion');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to resolve discussion:', error);
      throw error;
    }
  },

  // Get discussions count for a document
  async getDiscussionsCount(documentId: string): Promise<number> {
    try {
      const discussions = await getDocumentDiscussions(documentId);
      return discussions.length;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to get discussions count:', error);
      return 0;
    }
  },

  // Get unresolved discussions count for a document
  async getUnresolvedDiscussionsCount(documentId: string): Promise<number> {
    try {
      const discussions = await getDocumentDiscussions(documentId);
      return discussions.filter(d => !d.isResolved).length;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to get unresolved discussions count:', error);
      return 0;
    }
  },
};

// This plugin integrates with the database for persistent discussions
export const discussionPlugin = createPlatePlugin({
  key: 'discussion',
  options: {
    currentUserId: '',
    currentUser: { id: '', name: '', avatarUrl: '' },
    documentId: '',
    discussions: [] as TDiscussion[],
    users: {} as Record<string, UserData>,
  } satisfies TDiscussionConfig,
})
  .configure({
    render: { aboveNodes: BlockDiscussion },
  })
  .extendSelectors(({ getOption }) => ({
    getCurrentUser: () => {
      const currentUser = getOption('currentUser') as UserData;
      return currentUser;
    },
    user: (id: string) => {
      const users = getOption('users');
      return users[id] ?? { id, name: 'Unknown User', avatarUrl: '' };
    },
    discussion: (id: string) => {
      const discussions = getOption('discussions');
      return discussions.find(d => d.id === id);
    },
    unresolvedDiscussions: () => {
      const discussions = getOption('discussions');
      return discussions.filter(d => !d.isResolved);
    },
  }))
  .extendTransforms(({ setOption, getOption }) => ({
    // Load discussions from database
    loadDiscussions: async () => {
      const documentId = getOption('documentId');
      if (documentId) {
        await discussionDatabaseHelpers.loadDiscussions(
          documentId,
          setOption as (key: string, value: unknown) => void
        );
      }
    },

    // Handle comment operations with database integration
    handleCommentOperation: async (operation: string, ...args: any[]) => {
      try {
        switch (operation) {
          case 'resolve':
            const [discussionId, isResolved] = args;
            await discussionDatabaseHelpers.resolveDiscussion(
              discussionId,
              isResolved
            );
            // Reload discussions to get updated state
            const documentId = getOption('documentId');
            if (documentId) {
              await discussionDatabaseHelpers.loadDiscussions(
                documentId,
                setOption as (key: string, value: unknown) => void
              );
            }
            return { success: true };

          case 'update':
            const [commentId, contentRich] = args;
            await discussionDatabaseHelpers.updateComment(
              commentId,
              contentRich
            );
            // Reload discussions to get updated state
            const docId = getOption('documentId');
            if (docId) {
              await discussionDatabaseHelpers.loadDiscussions(
                docId,
                setOption as (key: string, value: unknown) => void
              );
            }
            return { success: true };

          case 'delete':
            // TODO: Add delete comment server action
            // For now, just update local state
            const [commentIdToDelete, discussionIdToUpdate] = args;
            const discussions = getOption('discussions');
            const updatedDiscussions = discussions.map(discussion => {
              if (discussion.id === discussionIdToUpdate) {
                return {
                  ...discussion,
                  comments: discussion.comments.filter(
                    c => c.id !== commentIdToDelete
                  ),
                };
              }
              return discussion;
            });
            setOption('discussions', updatedDiscussions);
            return { success: true };

          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        console.error(`Failed to ${operation} comment:`, error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
    // Set current user
    setCurrentUser: async (userId: string) => {
      const currentUser = await getCurrentUserForDiscussion();
      setOption('currentUserId', userId);
      setOption(
        'currentUser',
        currentUser ?? { id: '', name: '', avatarUrl: '' }
      );
    },
    // Set document ID and load discussions
    setDocumentId: async (documentId: string) => {
      setOption('documentId', documentId);
      await discussionDatabaseHelpers.loadDiscussions(
        documentId,
        setOption as (key: string, value: unknown) => void
      );
    },
    // Create a new discussion
    createDiscussion: async (documentContent?: string) => {
      const documentId = getOption('documentId');
      if (!documentId) throw new Error('Document ID is required');

      const discussionId = await discussionDatabaseHelpers.createDiscussion(
        documentId,
        documentContent
      );
      // Reload discussions to get the new one
      await discussionDatabaseHelpers.loadDiscussions(
        documentId,
        setOption as (key: string, value: unknown) => void
      );
      return discussionId;
    },
    // Add a comment to a discussion
    addComment: async (
      discussionId: string,
      contentRich: any,
      parentId?: string
    ) => {
      const commentId = await discussionDatabaseHelpers.addComment(
        discussionId,
        contentRich,
        parentId
      );
      // Reload discussions to get the new comment
      const documentId = getOption('documentId');
      if (documentId) {
        await discussionDatabaseHelpers.loadDiscussions(
          documentId,
          setOption as (key: string, value: unknown) => void
        );
      }
      return commentId;
    },
    // Update a comment
    updateComment: async (commentId: string, contentRich: any) => {
      const updatedCommentId = await discussionDatabaseHelpers.updateComment(
        commentId,
        contentRich
      );
      // Reload discussions to get the updated comment
      const documentId = getOption('documentId');
      if (documentId) {
        await discussionDatabaseHelpers.loadDiscussions(
          documentId,
          setOption as (key: string, value: unknown) => void
        );
      }
      return updatedCommentId;
    },
    // Resolve/unresolve a discussion
    resolveDiscussion: async (discussionId: string, isResolved: boolean) => {
      const resolvedDiscussionId =
        await discussionDatabaseHelpers.resolveDiscussion(
          discussionId,
          isResolved
        );
      // Reload discussions to get the updated resolution status
      const documentId = getOption('documentId');
      if (documentId) {
        await discussionDatabaseHelpers.loadDiscussions(
          documentId,
          setOption as (key: string, value: unknown) => void
        );
      }
      return resolvedDiscussionId;
    },
    // Add a new discussion (for local state updates)
    addDiscussion: (discussion: TDiscussion) => {
      const discussions = getOption('discussions');
      setOption('discussions', [...discussions, discussion]);
    },
    // Update an existing discussion (for local state updates)
    updateDiscussion: (id: string, updates: Partial<TDiscussion>) => {
      const discussions = getOption('discussions');
      const updated = discussions.map(d =>
        d.id === id ? { ...d, ...updates } : d
      );
      setOption('discussions', updated);
    },
    // Remove a discussion (for local state updates)
    removeDiscussion: (id: string) => {
      const discussions = getOption('discussions');
      setOption(
        'discussions',
        discussions.filter(d => d.id !== id)
      );
    },
    // Add user to users map
    addUser: (user: UserData) => {
      const users = getOption('users');
      setOption('users', { ...users, [user.id]: user });
    },
  }));

export const DiscussionKit = [discussionPlugin];
