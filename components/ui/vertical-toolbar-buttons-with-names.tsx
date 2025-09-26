'use client';

import {
  BoldIcon,
  Code2Icon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  ListIcon,
  ListOrderedIcon,
  CheckSquareIcon,
  LinkIcon,
  TableIcon,
  SmileIcon,
  ImageIcon,
  VideoIcon,
  FileIcon,
  MoreHorizontalIcon,
  WandSparklesIcon,
  UploadIcon,
  DownloadIcon,
  UndoIcon,
  RedoIcon,
  MessageSquareIcon,
  TypeIcon,
  PaletteIcon,
  AlignJustifyIcon,
} from 'lucide-react';
import { useEditorReadOnly } from 'platejs/react';
import * as React from 'react';

import { VerticalToolbarButton } from './vertical-toolbar-button';
import { VerticalToolbarGroup } from './vertical-toolbar-group';

export function VerticalToolbarButtonsWithNames() {
  const readOnly = useEditorReadOnly();

  return (
    <div className='flex h-full w-full flex-col'>
      {!readOnly && (
        <>
          <VerticalToolbarGroup>
            <VerticalToolbarButton name='Save' tooltip='Save document'>
              <DownloadIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Undo' tooltip='Undo'>
              <UndoIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Redo' tooltip='Redo'>
              <RedoIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Comments' tooltip='Add comments'>
              <MessageSquareIcon />
            </VerticalToolbarButton>
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
            <VerticalToolbarButton name='AI' tooltip='AI commands'>
              <WandSparklesIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Export' tooltip='Export document'>
              <UploadIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Import' tooltip='Import document'>
              <DownloadIcon />
            </VerticalToolbarButton>
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
            <VerticalToolbarButton name='Bold' tooltip='Bold (⌘+B)'>
              <BoldIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Italic' tooltip='Italic (⌘+I)'>
              <ItalicIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Underline' tooltip='Underline (⌘+U)'>
              <UnderlineIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Strikethrough' tooltip='Strikethrough'>
              <StrikethroughIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Code' tooltip='Code (⌘+E)'>
              <Code2Icon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Text Color' tooltip='Text color'>
              <TypeIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Highlight' tooltip='Highlight'>
              <PaletteIcon />
            </VerticalToolbarButton>
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
            <VerticalToolbarButton name='Align Left' tooltip='Align left'>
              <AlignLeftIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Align Center' tooltip='Align center'>
              <AlignCenterIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Align Right' tooltip='Align right'>
              <AlignRightIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Justify' tooltip='Justify'>
              <AlignJustifyIcon />
            </VerticalToolbarButton>
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
            <VerticalToolbarButton name='Bullet List' tooltip='Bullet list'>
              <ListIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Numbered List' tooltip='Numbered list'>
              <ListOrderedIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Todo List' tooltip='Todo list'>
              <CheckSquareIcon />
            </VerticalToolbarButton>
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
            <VerticalToolbarButton name='Link' tooltip='Add link'>
              <LinkIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Table' tooltip='Insert table'>
              <TableIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Emoji' tooltip='Insert emoji'>
              <SmileIcon />
            </VerticalToolbarButton>
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
            <VerticalToolbarButton name='Image' tooltip='Insert image'>
              <ImageIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Video' tooltip='Insert video'>
              <VideoIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='File' tooltip='Insert file'>
              <FileIcon />
            </VerticalToolbarButton>
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
            <VerticalToolbarButton name='More' tooltip='More options'>
              <MoreHorizontalIcon />
            </VerticalToolbarButton>
          </VerticalToolbarGroup>
        </>
      )}

      <div className='grow' />

      <VerticalToolbarGroup>
        <VerticalToolbarButton name='Comments' tooltip='Add comments'>
          <MessageSquareIcon />
        </VerticalToolbarButton>
      </VerticalToolbarGroup>
    </div>
  );
}
