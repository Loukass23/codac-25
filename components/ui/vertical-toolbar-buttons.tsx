'use client';

import {
  ArrowUpToLineIcon,
  BaselineIcon,
  BoldIcon,
  Code2Icon,
  HighlighterIcon,
  ItalicIcon,
  PaintBucketIcon,
  SaveIcon,
  StrikethroughIcon,
  UnderlineIcon,
  WandSparklesIcon
} from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorReadOnly } from 'platejs/react';

import { AIToolbarButton } from './ai-toolbar-button';
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
import { MediaToolbarButton } from './media-toolbar-button';
import { ModeToolbarButton } from './mode-toolbar-button';
import { MoreToolbarButton } from './more-toolbar-button';
import { SuggestionToolbarButton } from './suggestion-toolbar-button';
import { TableToolbarButton } from './table-toolbar-button';
import { ToggleToolbarButton } from './toggle-toolbar-button';
import { TurnIntoToolbarButton } from './turn-into-toolbar-button';
import { VerticalToolbarButton } from './vertical-toolbar-button';
import { VerticalToolbarGroup } from './vertical-toolbar-group';

interface VerticalToolbarButtonsProps {
  onSave?: () => Promise<void>;
}

export function VerticalToolbarButtons({ onSave }: VerticalToolbarButtonsProps) {
  const readOnly = useEditorReadOnly();

  return (
    <div className='flex h-full w-full flex-col'>
      {!readOnly && (
        <>
          <VerticalToolbarGroup>
            <VerticalToolbarButton
              name='Save'
              tooltip='Save document'
              isSaveButton={true}
              onSave={onSave}
            >
              <SaveIcon />
            </VerticalToolbarButton>
            <VerticalToolbarButton
              name='Suggestions'
              tooltip='Toggle suggestions'
            >
              <SuggestionToolbarButton />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Comments' tooltip='Add comments'>
              <CommentToolbarButton />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Undo' tooltip='Undo'>
              <UndoToolbarButton />
            </VerticalToolbarButton>
            <VerticalToolbarButton name='Redo' tooltip='Redo'>
              <RedoToolbarButton />
            </VerticalToolbarButton>
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
            <AIToolbarButton tooltip='AI commands'>
              <WandSparklesIcon />
            </AIToolbarButton>
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
            <ExportToolbarButton>
              <ArrowUpToLineIcon />
            </ExportToolbarButton>
            <ImportToolbarButton />
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
            <InsertToolbarButton />
            <TurnIntoToolbarButton />
            <FontSizeToolbarButton />
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
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

            <MarkToolbarButton
              nodeType={KEYS.strikethrough}
              tooltip='Strikethrough (⌘+⇧+M)'
            >
              <StrikethroughIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={KEYS.code} tooltip='Code (⌘+E)'>
              <Code2Icon />
            </MarkToolbarButton>

            <FontColorToolbarButton nodeType={KEYS.color} tooltip='Text color'>
              <BaselineIcon />
            </FontColorToolbarButton>

            <FontColorToolbarButton
              nodeType={KEYS.backgroundColor}
              tooltip='Background color'
            >
              <PaintBucketIcon />
            </FontColorToolbarButton>
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
            <AlignToolbarButton />
            <NumberedListToolbarButton />
            <BulletedListToolbarButton />
            <TodoListToolbarButton />
            <ToggleToolbarButton />
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
            <LinkToolbarButton />
            <TableToolbarButton />
            <EmojiToolbarButton />
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
            <MediaToolbarButton nodeType={KEYS.img} />
            <MediaToolbarButton nodeType={KEYS.video} />
            <MediaToolbarButton nodeType={KEYS.audio} />
            <MediaToolbarButton nodeType={KEYS.file} />
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
            <LineHeightToolbarButton />
            <OutdentToolbarButton />
            <IndentToolbarButton />
          </VerticalToolbarGroup>

          <VerticalToolbarGroup>
            <MoreToolbarButton />
          </VerticalToolbarGroup>
        </>
      )}

      <div className='grow' />

      <VerticalToolbarGroup>
        <MarkToolbarButton nodeType={KEYS.highlight} tooltip='Highlight'>
          <HighlighterIcon />
        </MarkToolbarButton>
        <CommentToolbarButton />
      </VerticalToolbarGroup>

      <VerticalToolbarGroup>
        <ModeToolbarButton />
      </VerticalToolbarGroup>
    </div>
  );
}
