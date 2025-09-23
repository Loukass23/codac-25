'use client';

import { TrailingBlockPlugin, type Value } from 'platejs';
import { useEditorRef, type TPlateEditor } from 'platejs/react';

import { AlignKit } from '@/lib/plate/plugins/align-kit';
import { AutoformatKit } from '@/lib/plate/plugins/autoformat-kit';
import { BasicBlocksKit } from '@/lib/plate/plugins/basic-blocks-kit';
import { BasicMarksKit } from '@/lib/plate/plugins/basic-marks-kit';
import { BlockMenuKit } from '@/lib/plate/plugins/block-menu-kit';
import { BlockPlaceholderKit } from '@/lib/plate/plugins/block-placeholder-kit';
import { CalloutKit } from '@/lib/plate/plugins/callout-kit';
import { CodeBlockKit } from '@/lib/plate/plugins/code-block-kit';
import { ColumnKit } from '@/lib/plate/plugins/column-kit';
import { CommentKit } from '@/lib/plate/plugins/comment-kit';
import { CursorOverlayKit } from '@/lib/plate/plugins/cursor-overlay-kit';
import { DateKit } from '@/lib/plate/plugins/date-kit';
import { DndKit } from '@/lib/plate/plugins/dnd-kit';
import { DocxKit } from '@/lib/plate/plugins/docx-kit';
import { EmojiKit } from '@/lib/plate/plugins/emoji-kit';
import { ExitBreakKit } from '@/lib/plate/plugins/exit-break-kit';
import { FixedToolbarKit } from '@/lib/plate/plugins/fixed-toolbar-kit';
import { FloatingToolbarKit } from '@/lib/plate/plugins/floating-toolbar-kit';
import { FontKit } from '@/lib/plate/plugins/font-kit';
import { LineHeightKit } from '@/lib/plate/plugins/line-height-kit';
import { LinkKit } from '@/lib/plate/plugins/link-kit';
import { ListKit } from '@/lib/plate/plugins/list-kit';
import { MarkdownKit } from '@/lib/plate/plugins/markdown-kit';
import { MathKit } from '@/lib/plate/plugins/math-kit';
import { MediaKit } from '@/lib/plate/plugins/media-kit';
import { MentionKit } from '@/lib/plate/plugins/mention-kit';
import { SlashKit } from '@/lib/plate/plugins/slash-kit';
import { TableKit } from '@/lib/plate/plugins/table-kit';
import { TocKit } from '@/lib/plate/plugins/toc-kit';
import { ToggleKit } from '@/lib/plate/plugins/toggle-kit';

export const EditorKit = [
  // Elements
  ...BasicBlocksKit,
  ...CodeBlockKit,
  ...TableKit,
  ...ToggleKit,
  ...TocKit,
  ...MediaKit,
  ...CalloutKit,
  ...ColumnKit,
  ...MathKit,
  ...DateKit,
  ...LinkKit,
  ...MentionKit,

  // Marks
  ...BasicMarksKit,
  ...FontKit,

  // Block Style
  ...ListKit,
  ...AlignKit,
  ...LineHeightKit,

  // Collaboration
  ...CommentKit,
  // ...SuggestionKit,

  // Editing
  ...SlashKit,
  ...AutoformatKit,
  ...CursorOverlayKit,
  ...BlockMenuKit,
  ...DndKit,
  ...EmojiKit,
  ...ExitBreakKit,
  TrailingBlockPlugin,

  // Parsers
  ...DocxKit,
  ...MarkdownKit,

  // UI
  ...BlockPlaceholderKit,
  ...FixedToolbarKit,
  ...FloatingToolbarKit,
];

export type MyEditor = TPlateEditor<Value, (typeof EditorKit)[number]>;

export const useEditor = () => useEditorRef<MyEditor>();
