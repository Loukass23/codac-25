import * as React from 'react';

import { BlockListStatic } from './ui/block-list-static';
import { BlockquoteElementStatic } from './ui/blockquote-node-static';
import { CalloutElementStatic } from './ui/callout-node-static';
import { CodeBlockElementStatic } from './ui/code-block-node-static';
import {
  ColumnElementStatic,
  ColumnGroupElementStatic,
} from './ui/column-node-static';
import { DateElementStatic } from './ui/date-node-static';
import { EquationElementStatic } from './ui/equation-node-static';
import { HeadingElementStatic } from './ui/heading-node-static';
import { HrElementStatic } from './ui/hr-node-static';
import { LinkElementStatic } from './ui/link-node-static';
import { AudioElementStatic } from './ui/media-audio-node-static';
import { FileElementStatic } from './ui/media-file-node-static';
import { ImageElementStatic } from './ui/media-image-node-static';
import { VideoElementStatic } from './ui/media-video-node-static';
import { MentionElementStatic } from './ui/mention-node-static';
import { ParagraphElementStatic } from './ui/paragraph-node-static';
import { TableElementStatic } from './ui/table-node-static';
import { TocElementStatic } from './ui/toc-node-static';
import { ToggleElementStatic } from './ui/toggle-node-static';

// Map plugin keys to their static rendering components
export const staticComponents = {
  // Basic blocks
  p: ParagraphElementStatic,
  h1: HeadingElementStatic,
  h2: HeadingElementStatic,
  h3: HeadingElementStatic,
  h4: HeadingElementStatic,
  h5: HeadingElementStatic,
  h6: HeadingElementStatic,
  blockquote: BlockquoteElementStatic,
  hr: HrElementStatic,

  // Code
  code_block: CodeBlockElementStatic,
  code_line: CodeBlockElementStatic,

  // Lists
  ul: BlockListStatic,
  ol: BlockListStatic,
  li: BlockListStatic,
  lic: BlockListStatic,

  // Tables
  table: TableElementStatic,
  tr: TableElementStatic,
  td: TableElementStatic,
  th: TableElementStatic,

  // Media
  img: ImageElementStatic,
  video: VideoElementStatic,
  audio: AudioElementStatic,
  file: FileElementStatic,

  // Links and mentions
  a: LinkElementStatic,
  mention: MentionElementStatic,

  // Advanced elements
  callout: CalloutElementStatic,
  toggle: ToggleElementStatic,
  equation: EquationElementStatic,
  inline_equation: EquationElementStatic,
  date: DateElementStatic,
  column_group: ColumnGroupElementStatic,
  column: ColumnElementStatic,
  toc: TocElementStatic,

  // Leaf elements (marks) - using React components for better type safety
  bold: ({ children }: { children: React.ReactNode }) => (
    <strong>{children}</strong>
  ),
  italic: ({ children }: { children: React.ReactNode }) => <em>{children}</em>,
  underline: ({ children }: { children: React.ReactNode }) => <u>{children}</u>,
  strikethrough: ({ children }: { children: React.ReactNode }) => (
    <s>{children}</s>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code>{children}</code>
  ),
  subscript: ({ children }: { children: React.ReactNode }) => (
    <sub>{children}</sub>
  ),
  superscript: ({ children }: { children: React.ReactNode }) => (
    <sup>{children}</sup>
  ),
  highlight: ({ children }: { children: React.ReactNode }) => (
    <mark>{children}</mark>
  ),
  kbd: ({ children }: { children: React.ReactNode }) => <kbd>{children}</kbd>,
} as const;
