import { BaseAlignKit } from '@/lib/plate/plugins/align-base-kit';
import { BaseBasicBlocksKit } from '@/lib/plate/plugins/basic-blocks-base-kit';
import { BaseBasicMarksKit } from '@/lib/plate/plugins/basic-marks-base-kit';
import { BaseCalloutKit } from '@/lib/plate/plugins/callout-base-kit';
import { BaseCodeBlockKit } from '@/lib/plate/plugins/code-block-base-kit';
import { BaseColumnKit } from '@/lib/plate/plugins/column-base-kit';
import { BaseCommentKit } from '@/lib/plate/plugins/comment-base-kit';
import { BaseDateKit } from '@/lib/plate/plugins/date-base-kit';
import { BaseFontKit } from '@/lib/plate/plugins/font-base-kit';
import { BaseLineHeightKit } from '@/lib/plate/plugins/line-height-base-kit';
import { BaseLinkKit } from '@/lib/plate/plugins/link-base-kit';
import { BaseListKit } from '@/lib/plate/plugins/list-base-kit';
import { MarkdownKit } from '@/lib/plate/plugins/markdown-kit';
import { BaseMathKit } from '@/lib/plate/plugins/math-base-kit';
import { BaseMediaKit } from '@/lib/plate/plugins/media-base-kit';
import { BaseMentionKit } from '@/lib/plate/plugins/mention-base-kit';
import { BaseSuggestionKit } from '@/lib/plate/plugins/suggestion-base-kit';
import { BaseTableKit } from '@/lib/plate/plugins/table-base-kit';
import { BaseTocKit } from '@/lib/plate/plugins/toc-base-kit';
import { BaseToggleKit } from '@/lib/plate/plugins/toggle-base-kit';

export const BaseEditorKit = [
  ...BaseBasicBlocksKit,
  ...BaseCodeBlockKit,
  ...BaseTableKit,
  ...BaseToggleKit,
  ...BaseTocKit,
  ...BaseMediaKit,
  ...BaseCalloutKit,
  ...BaseColumnKit,
  ...BaseMathKit,
  ...BaseDateKit,
  ...BaseLinkKit,
  ...BaseMentionKit,
  ...BaseBasicMarksKit,
  ...BaseFontKit,
  ...BaseListKit,
  ...BaseAlignKit,
  ...BaseLineHeightKit,
  ...BaseCommentKit,
  ...BaseSuggestionKit,
  ...MarkdownKit,
];
