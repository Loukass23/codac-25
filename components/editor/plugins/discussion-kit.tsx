'use client';

/**
 * Discussion Kit Plugin for Plate.js Editor
 *
 * This plugin provides database-backed discussion functionality for the Plate.js editor.
 * It integrates with the project's database to persist comments and discussions.
 *
 * Features:
 * - Database integration with proper data transformation
 * - User management with avatar and profile support
 * - Discussion CRUD operations
 * - Proper error handling and fallbacks
 * - Type-safe plugin configuration
 *
 * @see types/document.ts for related type definitions
 * @see data/projects/get-document-comments.ts for database queries
 */

import { createPlatePlugin } from 'platejs/react';

import { BlockDiscussion } from '@/components/ui/block-discussion';
import { getDocumentComments } from '@/data/projects/get-document-comments';
import { getUserProfile } from '@/lib/auth/auth-utils';
import type { DocumentDiscussion } from '@/types/document';

export type TDiscussion = DocumentDiscussion;

export interface TDiscussionConfig {
  currentUserId: string;
  currentUser: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  documentId: string;
  discussions: TDiscussion[];
  users: Record<
    string,
    { id: string; name: string; avatarUrl: string; hue?: number }
  >;
}

// Helper functions for database operations
export const discussionDatabaseHelpers = {
  // Load discussions from database
  async loadDiscussions(
    documentId: string,
    setOption: (key: string, value: any) => void
  ) {
    try {
      const dbComments = await getDocumentComments(documentId);
      console.log(dbComments);
      // Group comments by discussion ID
      const discussionsMap = new Map<string, TDiscussion>();
      const usersMap = new Map<string, any>();

      // Process each comment
      for (const comment of dbComments) {
        const user = {
          id: comment.user.id,
          name: comment.user.name || 'Unknown User',
          avatarUrl: comment.user.avatar || '',
        };
        usersMap.set(comment.user.id, user);

        // Create or get discussion
        if (!discussionsMap.has(comment.discussionId)) {
          discussionsMap.set(comment.discussionId, {
            id: comment.discussionId,
            comments: [],
            createdAt: comment.createdAt,
            isResolved: comment.discussion.isResolved,
            userId: comment.user.id,
            documentContent: comment.discussion.documentContent || undefined,
          });
        }

        const discussion = discussionsMap.get(comment.discussionId)!;

        // Add comment to discussion
        discussion.comments.push({
          id: comment.id,
          contentRich: comment.contentRich,
          createdAt: comment.createdAt,
          discussionId: comment.discussionId,
          isEdited: comment.isEdited,
          userId: comment.user.id,
        });

        // Add replies
        for (const reply of comment.replies) {
          const replyUser = {
            id: reply.user.id,
            name: reply.user.name || 'Unknown User',
            avatarUrl: reply.user.avatar || '',
          };
          usersMap.set(reply.user.id, replyUser);

          discussion.comments.push({
            id: reply.id,
            contentRich: reply.contentRich,
            createdAt: reply.createdAt,
            discussionId: comment.discussionId,
            isEdited: reply.isEdited,
            userId: reply.user.id,
          });
        }
      }

      // Convert maps to arrays/objects
      const discussions = Array.from(discussionsMap.values());
      const users = Object.fromEntries(usersMap);

      // Update plugin options
      setOption('discussions', discussions);
      setOption('users', users);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load discussions:', error);
      // Set empty state on error
      setOption('discussions', []);
      setOption('users', {});
      // Could dispatch a toast notification here for user feedback
      throw new Error(
        `Failed to load discussions for document ${documentId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  // Load user profile
  async loadUserProfile(userId: string) {
    try {
      const userProfile = await getUserProfile(userId);
      if (userProfile) {
        return {
          id: userProfile.id,
          name: userProfile.name || 'Unknown User',
          avatarUrl: userProfile.avatar || '',
        };
      }
      return {
        id: userId,
        name: 'Unknown User',
        avatarUrl: '',
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load user profile:', error);
      // Return fallback user data on error
      return {
        id: userId,
        name: 'Unknown User',
        avatarUrl: '',
      };
    }
  },

  // Get discussions count for a document
  async getDiscussionsCount(documentId: string): Promise<number> {
    try {
      const dbComments = await getDocumentComments(documentId);
      const uniqueDiscussionIds = new Set(
        dbComments.map(comment => comment.discussionId)
      );
      return uniqueDiscussionIds.size;
    } catch (error) {
      console.error('Failed to get discussions count:', error);
      return 0;
    }
  },

  // Get unresolved discussions count for a document
  async getUnresolvedDiscussionsCount(documentId: string): Promise<number> {
    try {
      const dbComments = await getDocumentComments(documentId);
      const uniqueDiscussionIds = new Set(
        dbComments
          .filter(comment => !comment.discussion.isResolved)
          .map(comment => comment.discussionId)
      );
      return uniqueDiscussionIds.size;
    } catch (error) {
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
    currentUser: {
      id: '',
      name: 'Anonymous',
      avatarUrl: '',
    },
    documentId: '',
    discussions: [],
    users: {},
  } satisfies TDiscussionConfig,
})
  .configure({
    render: { aboveNodes: BlockDiscussion },
  })
  .extendSelectors(({ getOption }) => ({
    getCurrentUser: () => {
      const userId = getOption('currentUserId') as string;
      const users = getOption('users') as TDiscussionConfig['users'];
      // Return user from users map if available, otherwise fallback to stored currentUser
      if (users[userId]) {
        return users[userId];
      }
      // Get the stored currentUser data directly from options
      return getOption('currentUser') as TDiscussionConfig['currentUser'];
    },
    user: (id: string) => {
      const users = getOption('users') as TDiscussionConfig['users'];
      return users[id] || { id, name: 'Unknown User', avatarUrl: '' };
    },
    discussion: (id: string) => {
      const discussions = getOption('discussions') as TDiscussion[];
      return discussions.find((d: TDiscussion) => d.id === id);
    },
    discussions: () => getOption('discussions') as TDiscussion[],
    unresolvedDiscussions: () => {
      const discussions = getOption('discussions') as TDiscussion[];
      return discussions.filter((d: TDiscussion) => !d.isResolved);
    },
  }))
  .extendTransforms(({ setOption, getOption }) => ({
    // Load discussions from database
    loadDiscussions: async () => {
      const documentId = getOption('documentId') as string;
      if (documentId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await discussionDatabaseHelpers.loadDiscussions(
          documentId,
          setOption as any
        );
      }
    },

    // Set current user
    setCurrentUser: async (userId: string) => {
      const userProfile =
        await discussionDatabaseHelpers.loadUserProfile(userId);
      setOption('currentUserId', userId);
      setOption('currentUser', userProfile);
    },

    // Set document ID and load discussions
    setDocumentId: async (documentId: string) => {
      setOption('documentId', documentId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await discussionDatabaseHelpers.loadDiscussions(
        documentId,
        setOption as any
      );
    },

    // Add a new discussion
    addDiscussion: (discussion: TDiscussion) => {
      const discussions = getOption('discussions') as TDiscussion[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (setOption as any)('discussions', [...discussions, discussion]);
    },

    // Update an existing discussion
    updateDiscussion: (id: string, updates: Partial<TDiscussion>) => {
      const discussions = getOption('discussions') as TDiscussion[];
      const updated = discussions.map(d =>
        d.id === id ? { ...d, ...updates } : d
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (setOption as any)('discussions', updated);
    },

    // Remove a discussion
    removeDiscussion: (id: string) => {
      const discussions = getOption('discussions') as TDiscussion[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (setOption as any)(
        'discussions',
        discussions.filter(d => d.id !== id)
      );
    },

    // Add user to users map
    addUser: (user: {
      id: string;
      name: string;
      avatarUrl: string;
      hue?: number;
    }) => {
      const users = getOption('users') as TDiscussionConfig['users'];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (setOption as any)('users', { ...users, [user.id]: user });
    },
  }));

export const DiscussionKit = [discussionPlugin];
