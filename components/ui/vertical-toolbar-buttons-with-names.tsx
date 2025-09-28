'use client';

import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArrowUpToLineIcon,
  FileIcon,
  ImageIcon,
  SaveIcon,
  VideoIcon,
  WandSparklesIcon
} from 'lucide-react';
import { useEditorReadOnly } from 'platejs/react';

import { useToolbarWidth } from '@/hooks/use-toolbar-width';

import { AIToolbarButton } from './ai-toolbar-button';
import { ExportToolbarButton } from './export-toolbar-button';
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import { ImportToolbarButton } from './import-toolbar-button';
import { ModeToolbarButton } from './mode-toolbar-button';
import { VerticalToolbarButton } from './vertical-toolbar-button';
import { VerticalToolbarGroup } from './vertical-toolbar-group';

interface VerticalToolbarButtonsWithNamesProps {
  onSave?: () => Promise<void>;
}

export function VerticalToolbarButtonsWithNames({ onSave }: VerticalToolbarButtonsWithNamesProps) {
  const readOnly = useEditorReadOnly();
  const { isWideEnough, ref } = useToolbarWidth(150); // Show text when toolbar is at least 200px wide

  return (
    <div ref={ref} className='flex h-full w-full flex-col'>
      {!readOnly && (
        <>
          <VerticalToolbarGroup>
            <ModeToolbarButton showText={isWideEnough} />
          </VerticalToolbarGroup>
          {/* Document Actions */}
          <VerticalToolbarGroup>
            <VerticalToolbarButton
              name='Save'
              tooltip='Save document'
              isSaveButton={true}
              onSave={onSave}
              showText={isWideEnough}
            >
              <SaveIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Undo' tooltip='Undo' showText={isWideEnough}>
              <UndoToolbarButton />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Redo' tooltip='Redo' showText={isWideEnough}>
              <RedoToolbarButton />
            </VerticalToolbarButton>
          </VerticalToolbarGroup>

          {/* AI Actions */}
          <VerticalToolbarGroup>
            <AIToolbarButton tooltip='AI commands' showText={isWideEnough}>
              <WandSparklesIcon />
            </AIToolbarButton>
          </VerticalToolbarGroup>

          {/* Import/Export */}
          <VerticalToolbarGroup>
            <ImportToolbarButton showText={isWideEnough} />
            <ExportToolbarButton showText={isWideEnough}>
              <ArrowUpToLineIcon />
            </ExportToolbarButton>
          </VerticalToolbarGroup>

          {/* Media Insertion */}
          <VerticalToolbarGroup>
            <VerticalToolbarButton name='Image' tooltip='Insert image' showText={isWideEnough}>
              <ImageIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Video' tooltip='Insert video' showText={isWideEnough}>
              <VideoIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='File' tooltip='Insert file' showText={isWideEnough}>
              <FileIcon />
            </VerticalToolbarButton>
          </VerticalToolbarGroup>

          {/* Alignment */}
          <VerticalToolbarGroup>
            <VerticalToolbarButton name='Align Left' tooltip='Align left' showText={isWideEnough}>
              <AlignLeftIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Align Center' tooltip='Align center' showText={isWideEnough}>
              <AlignCenterIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Align Right' tooltip='Align right' showText={isWideEnough}>
              <AlignRightIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Justify' tooltip='Justify' showText={isWideEnough}>
              <AlignJustifyIcon />
            </VerticalToolbarButton>
          </VerticalToolbarGroup>
        </>
      )}

      <div className='grow' />
    </div>
  );
}
