'use client';

import { createPlatePlugin } from 'platejs/react';

import { BlockDiscussionDatabase } from '@/components/ui/block-discussion-database';
import type { TComment } from '@/components/ui/comment';

export interface TDiscussionDatabase {
  id: string;
  comments: TComment[];
  createdAt: Date;
  isResolved: boolean;
  userId: string;
  documentContent?: string;
}

// Simple plugin for discussion database features
// This is a placeholder implementation that can be expanded with actual database integration
export const discussionDatabasePlugin = createPlatePlugin({
  key: 'discussionDatabase',
  options: {
    currentUser: null as any,
    discussions: [] as TDiscussionDatabase[],
    users: {} as Record<string, any>,
  },
})
  .configure({
    render: { aboveNodes: BlockDiscussionDatabase as any },
  })
  .extendApi(({ getOption, setOption }) => ({
    // Helper functions for managing discussions
    resolveDiscussion: async (
      discussionId: string,
      setOptionFn: any,
      getOptionFn: any
    ) => {
      const discussions = getOptionFn('discussions') || [];
      const updated = discussions.map((d: TDiscussionDatabase) =>
        d.id === discussionId ? { ...d, isResolved: true } : d
      );
      setOptionFn('discussions', updated);
    },
    deleteComment: async (
      commentId: string,
      setOptionFn: any,
      getOptionFn: any
    ) => {
      const discussions = getOptionFn('discussions') || [];
      const updated = discussions.map((d: TDiscussionDatabase) => ({
        ...d,
        comments: d.comments.filter((c: TComment) => c.id !== commentId),
      }));
      setOptionFn('discussions', updated);
    },
    updateComment: async (
      commentId: string,
      content: any,
      setOptionFn: any,
      getOptionFn: any
    ) => {
      const discussions = getOptionFn('discussions') || [];
      const updated = discussions.map((d: TDiscussionDatabase) => ({
        ...d,
        comments: d.comments.map((c: TComment) =>
          c.id === commentId
            ? { ...c, contentRich: content, isEdited: true }
            : c
        ),
      }));
      setOptionFn('discussions', updated);
    },
    addReply: async (
      discussionId: string,
      content: any,
      userId: string,
      setOptionFn: any,
      getOptionFn: any
    ) => {
      const discussions = getOptionFn('discussions') || [];
      const newComment: TComment = {
        id: `comment-${Date.now()}`,
        contentRich: content,
        createdAt: new Date(),
        discussionId,
        isEdited: false,
        userId,
      };
      const updated = discussions.map((d: TDiscussionDatabase) =>
        d.id === discussionId
          ? { ...d, comments: [...d.comments, newComment] }
          : d
      );
      setOptionFn('discussions', updated);
    },
    createDiscussion: async (
      content: any,
      userId: string,
      setOptionFn: any,
      getOptionFn: any
    ) => {
      const discussions = getOptionFn('discussions') || [];
      const discussionId = `discussion-${Date.now()}`;
      const newComment: TComment = {
        id: `comment-${Date.now()}`,
        contentRich: content,
        createdAt: new Date(),
        discussionId,
        isEdited: false,
        userId,
      };
      const newDiscussion: TDiscussionDatabase = {
        id: discussionId,
        comments: [newComment],
        createdAt: new Date(),
        isResolved: false,
        userId,
      };
      setOptionFn('discussions', [...discussions, newDiscussion]);
      return discussionId;
    },
  }));

export const DiscussionDatabaseKit = [discussionDatabasePlugin];
