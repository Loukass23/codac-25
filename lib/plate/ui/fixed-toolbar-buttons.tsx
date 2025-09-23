'use client';


import {
  ArrowUpToLineIcon,
  BaselineIcon,
  BoldIcon,
  Code2Icon,
  HighlighterIcon,
  ItalicIcon,
  PaintBucketIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorReadOnly } from 'platejs/react';
import * as React from 'react';

import { AlignToolbarButton } from './align-toolbar-button';
import { CommentToolbarButton } from './comment-toolbar-button';
import { EmojiToolbarButton } from './emoji-toolbar-button';
import { ExportToolbarButton } from './export-toolbar-button';
import { FontColorToolbarButton } from './font-color-toolbar-button';
import { FontSizeToolbarButton } from './font-size-toolbar-button';
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import { ImportToolbarButton } from './import-toolbar-button';
import {
  IndentToolbarButton,
  OutdentToolbarButton,
} from './indent-toolbar-button';
import { InsertToolbarButton } from './insert-toolbar-button';
import { LineHeightToolbarButton } from './line-height-toolbar-button';
import { LinkToolbarButton } from './link-toolbar-button';
import {
  BulletedListToolbarButton,
  NumberedListToolbarButton,
  TodoListToolbarButton,
} from './list-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { ModeToolbarButton } from './mode-toolbar-button';
import { MoreToolbarButton } from './more-toolbar-button';
import { TableToolbarButton } from './table-toolbar-button';
import { ToggleToolbarButton } from './toggle-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { TurnIntoToolbarButton } from './turn-into-toolbar-button';

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <>
      {!readOnly && (
        <>
          {/* Core editing tools - always visible */}
          <ToolbarGroup>
            <UndoToolbarButton />
            <RedoToolbarButton />
          </ToolbarGroup>

          {/* Essential formatting - always visible */}
          <ToolbarGroup>
            <MarkToolbarButton nodeType={KEYS.bold} tooltip='Bold (⌘+B)'>
              <BoldIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={KEYS.italic} tooltip='Italic (⌘+I)'>
              <ItalicIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={KEYS.underline}
              tooltip='Underline (⌘+U)'
            >
              <UnderlineIcon />
            </MarkToolbarButton>
          </ToolbarGroup>

          {/* Advanced formatting - visible on small screens and up */}
          <ToolbarGroup>
            <MarkToolbarButton
              nodeType={KEYS.strikethrough}
              tooltip='Strikethrough (⌘+⇧+M)'
            >
              <StrikethroughIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={KEYS.code} tooltip='Code (⌘+E)'>
              <Code2Icon />
            </MarkToolbarButton>
          </ToolbarGroup>

          {/* Colors - visible on small screens and up */}
          <ToolbarGroup>
            <FontColorToolbarButton nodeType={KEYS.color} tooltip='Text color'>
              <BaselineIcon />
            </FontColorToolbarButton>

            <FontColorToolbarButton
              nodeType={KEYS.backgroundColor}
              tooltip='Background color'
            >
              <PaintBucketIcon />
            </FontColorToolbarButton>
          </ToolbarGroup>

          {/* Lists - visible on medium screens and up */}
          <ToolbarGroup className='hidden sm:flex'>
            <NumberedListToolbarButton />
            <BulletedListToolbarButton />
            <TodoListToolbarButton />
          </ToolbarGroup>

          {/* Alignment - visible on medium screens and up */}
          <ToolbarGroup className='hidden sm:flex'>
            <AlignToolbarButton />
          </ToolbarGroup>

          {/* Indentation - visible on medium screens and up */}
          <ToolbarGroup className='hidden sm:flex'>
            <OutdentToolbarButton />
            <IndentToolbarButton />
          </ToolbarGroup>

          {/* Toggle - visible on medium screens and up */}
          <ToolbarGroup className='hidden sm:flex'>
            <ToggleToolbarButton />
          </ToolbarGroup>

          {/* Links and tables - visible on large screens and up */}
          <ToolbarGroup className='hidden md:flex'>
            <LinkToolbarButton />
            <TableToolbarButton />
          </ToolbarGroup>

          {/* Insert and turn into - visible on large screens and up */}
          <ToolbarGroup className='hidden md:flex'>
            <InsertToolbarButton />
            <TurnIntoToolbarButton />
            <FontSizeToolbarButton />
          </ToolbarGroup>

          {/* Export/Import - visible on large screens and up */}
          <ToolbarGroup className='hidden md:flex'>
            <ExportToolbarButton>
              <ArrowUpToLineIcon />
            </ExportToolbarButton>
            <ImportToolbarButton />
          </ToolbarGroup>

          {/* Line height - visible on large screens and up */}
          <ToolbarGroup className='hidden md:flex'>
            <LineHeightToolbarButton />
          </ToolbarGroup>

          {/* Emoji - visible on large screens and up */}
          <ToolbarGroup className='hidden md:flex'>
            <EmojiToolbarButton />
          </ToolbarGroup>

          {/* More button - always visible to access hidden tools */}
          <ToolbarGroup>
            <MoreToolbarButton />
          </ToolbarGroup>
        </>
      )}

      {/* Right side tools - always visible */}
      <ToolbarGroup>
        <MarkToolbarButton nodeType={KEYS.highlight} tooltip='Highlight'>
          <HighlighterIcon />
        </MarkToolbarButton>
        <CommentToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <ModeToolbarButton />
      </ToolbarGroup>
    </>
  );
}
