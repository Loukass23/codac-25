import { BaseCommentPlugin } from '@platejs/comment';

import { CommentLeafStatic } from '@/lib/plate/ui/comment-node-static';

export const BaseCommentKit = [
  BaseCommentPlugin.withComponent(CommentLeafStatic),
];
