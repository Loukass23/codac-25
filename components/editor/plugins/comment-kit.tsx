'use client';

/**
 * Comment Kit Plugin for Plate.js Editor
 *
 * This plugin provides comment functionality for the Plate.js editor with robust
 * error handling and selection management.
 *
 * Features:
 * - Safe selection handling with fallbacks
 * - Robust click event handling
 * - Error resilience for edge cases
 * - Keyboard shortcuts (Cmd+Shift+M)
 *
 * @see components/ui/comment-node.tsx for the CommentLeaf component
 */

import {
  type BaseCommentConfig,
  BaseCommentPlugin,
  getDraftCommentKey,
} from '@platejs/comment';
import type { ExtendConfig, Path } from 'platejs';
import { isSlateString } from 'platejs';
import { toTPlatePlugin } from 'platejs/react';

import { CommentLeaf } from '@/components/ui/comment-node';

type CommentConfig = ExtendConfig<
  BaseCommentConfig,
  {
    activeId: string | null;
    commentingBlock: Path | null;
    hoverId: string | null;
    uniquePathMap: Map<string, Path>;
  }
>;

export const commentPlugin = toTPlatePlugin<CommentConfig>(BaseCommentPlugin, {
  handlers: {
    onClick: ({ api, event, setOption, type }) => {
      let leaf = event.target as HTMLElement;
      let isSet = false;

      const unsetActiveComment = () => {
        setOption('activeId', null);
        isSet = true;
      };

      // Check if the target is a valid Slate string element
      if (!isSlateString(leaf)) {
        unsetActiveComment();
        return;
      }

      // Traverse up the DOM to find comment elements
      while (leaf.parentElement) {
        if (leaf.classList.contains(`slate-${type}`)) {
          try {
            const commentsEntry = api.comment?.node();

            if (!commentsEntry) {
              unsetActiveComment();
              break;
            }

            const id = api.comment?.nodeId(commentsEntry[0]);

            setOption('activeId', id ?? null);
            isSet = true;
            break;
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn('Error handling comment click:', error);
            unsetActiveComment();
            break;
          }
        }

        leaf = leaf.parentElement;
      }

      if (!isSet) unsetActiveComment();
    },
  },
  options: {
    activeId: null,
    commentingBlock: null,
    hoverId: null,
    uniquePathMap: new Map(),
  },
})
  .extendTransforms(
    ({
      editor,
      setOption,
      tf: {
        comment: { setDraft },
      },
    }) => ({
      setDraft: () => {
        // Ensure we have a valid selection
        if (!editor.selection) {
          // If no selection, try to get the current block
          const block = editor.api.block();
          if (block) {
            editor.tf.select(block[1]);
          } else {
            // Fallback: select the first block
            const firstBlock = editor.api.node([0]);
            if (firstBlock) {
              editor.tf.select([0, 0]);
            } else {
              // eslint-disable-next-line no-console
              console.warn('No blocks available for comment creation');
              return;
            }
          }
        }

        if (editor.api.isCollapsed()) {
          editor.tf.select(editor.api.block()![1]);
        }

        setDraft();

        editor.tf.collapse();
        setOption('activeId', getDraftCommentKey());

        // Safe access to selection with fallback
        if (editor.selection) {
          setOption('commentingBlock', editor.selection.focus.path.slice(0, 1));
        } else {
          // Fallback to current block path
          const block = editor.api.block();
          if (block) {
            setOption('commentingBlock', block[1].slice(0, 1));
          }
        }
      },
    })
  )
  .configure({
    node: { component: CommentLeaf },
    shortcuts: {
      setDraft: { keys: 'mod+shift+m' },
    },
  });

export const CommentKit = [commentPlugin];
