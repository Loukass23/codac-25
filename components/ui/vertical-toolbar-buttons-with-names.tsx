'use client';

import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArrowUpToLineIcon,
  FileIcon,
  ImageIcon,
  VideoIcon,
  WandSparklesIcon
} from 'lucide-react';
import { useEditorReadOnly } from 'platejs/react';

import { AIToolbarButton } from './ai-toolbar-button';
import { ExportToolbarButton } from './export-toolbar-button';
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import { ImportToolbarButton } from './import-toolbar-button';
import { ModeToolbarButton } from './mode-toolbar-button';
import { SimpleSaveButton } from './simple-save-button';
import { VerticalToolbarButton } from './vertical-toolbar-button';
import { VerticalToolbarGroup } from './vertical-toolbar-group';

export function VerticalToolbarButtonsWithNames() {
  const readOnly = useEditorReadOnly();

  return (
    <div className='flex h-full w-full flex-col'>
      {!readOnly && (
        <>
          <VerticalToolbarGroup>
            <ModeToolbarButton />
          </VerticalToolbarGroup>
          {/* Document Actions */}
          <VerticalToolbarGroup>
            <VerticalToolbarButton name='Save' tooltip='Save document'>
              <SimpleSaveButton />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Undo' tooltip='Undo'>
              <UndoToolbarButton />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Redo' tooltip='Redo'>
              <RedoToolbarButton />
            </VerticalToolbarButton>
          </VerticalToolbarGroup>

          {/* AI Actions */}
          <VerticalToolbarGroup>
            <AIToolbarButton tooltip='AI commands'>
              <WandSparklesIcon />
            </AIToolbarButton>
          </VerticalToolbarGroup>

          {/* Import/Export */}
          <VerticalToolbarGroup>
            <ImportToolbarButton />
            <ExportToolbarButton>
              <ArrowUpToLineIcon />
            </ExportToolbarButton>
          </VerticalToolbarGroup>

          {/* Media Insertion */}
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

          {/* Alignment */}
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
        </>
      )}

      <div className='grow' />
    </div>
  );
}
