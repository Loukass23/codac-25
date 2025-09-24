import * as React from 'react';

import { BlockListStatic } from '@/components/ui/block-list-static';
import { BlockquoteElementStatic } from '@/components/ui/blockquote-node-static';
import { CalloutElementStatic } from '@/components/ui/callout-node-static';
import { CodeBlockElementStatic } from '@/components/ui/code-block-node-static';
import {
  ColumnElementStatic,
  ColumnGroupElementStatic,
} from '@/components/ui/column-node-static';
import { DateElementStatic } from '@/components/ui/date-node-static';
import { EquationElementStatic } from '@/components/ui/equation-node-static';
import { HeadingElementStatic } from '@/components/ui/heading-node-static';
import { HrElementStatic } from '@/components/ui/hr-node-static';
import { LinkElementStatic } from '@/components/ui/link-node-static';
import { AudioElementStatic } from '@/components/ui/media-audio-node-static';
import { FileElementStatic } from '@/components/ui/media-file-node-static';
import { ImageElementStatic } from '@/components/ui/media-image-node-static';
import { VideoElementStatic } from '@/components/ui/media-video-node-static';
import { ParagraphElementStatic } from '@/components/ui/paragraph-node-static';
import { TableElementStatic } from '@/components/ui/table-node-static';
import { TocElementStatic } from '@/components/ui/toc-node-static';
import { ToggleElementStatic } from '@/components/ui/toggle-node-static';

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
