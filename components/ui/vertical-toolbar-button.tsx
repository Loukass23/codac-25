'use client';

import { useEditorRef } from 'platejs/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { ToolbarButton } from './toolbar';

interface VerticalToolbarButtonProps {
  children: React.ReactNode;
  tooltip?: string;
  className?: string;
  onClick?: () => void;
  pressed?: boolean;
  disabled?: boolean;
  name: string;
  isSaveButton?: boolean; // Special handling for save button
  onSave?: () => Promise<void>; // Save function to call when save button is clicked
  isUndoButton?: boolean; // Special handling for undo button
  isRedoButton?: boolean; // Special handling for redo button
  showText?: boolean; // Whether to show text label (controlled by parent)
}

export function VerticalToolbarButton({
  children,
  tooltip,
  className,
  onClick,
  pressed,
  disabled,
  name: _name,
  isSaveButton = false,
  onSave,
  isUndoButton = false,
  isRedoButton = false,
  showText = false,
}: VerticalToolbarButtonProps) {
  // Always call hooks, but only use editor for save buttons
  const _editor = useEditorRef();
  const [saveState, setSaveState] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSaveClick = React.useCallback(async () => {
    console.log('VerticalToolbarButton save clicked', { isSaveButton, hasOnSave: !!onSave });
    if (!isSaveButton || !onSave) return;

    setSaveState('saving');

    try {
      await onSave();
      setSaveState('saved');
      // Reset to idle after 2 seconds
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (_error) {
      console.error('Save failed:', _error);
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  }, [isSaveButton, onSave]);

  const handleUndoClick = React.useCallback(() => {
    if (!isUndoButton || !_editor) return;
    _editor.undo();
  }, [isUndoButton, _editor]);

  const handleRedoClick = React.useCallback(() => {
    if (!isRedoButton || !_editor) return;
    _editor.redo();
  }, [isRedoButton, _editor]);

  const handleClick = React.useCallback(() => {
    if (isSaveButton) {
      handleSaveClick();
    } else if (isUndoButton) {
      handleUndoClick();
    } else if (isRedoButton) {
      handleRedoClick();
    } else if (onClick) {
      onClick();
    }
  }, [isSaveButton, isUndoButton, isRedoButton, handleSaveClick, handleUndoClick, handleRedoClick, onClick]);

  const isDisabled = disabled || (isSaveButton && saveState === 'saving');

  // Check if children contain a ToolbarButton to avoid nesting
  const hasToolbarButtonChild = React.Children.toArray(children).some(
    (child) => {
      if (!React.isValidElement(child)) return false;

      // Debug logging
      const componentName = (child.type as any)?.name || (child.type as any)?.displayName;
      console.log('VerticalToolbarButton child:', {
        componentName,
        type: child.type,
        name: _name
      });

      // Check for common toolbar button component names
      const isToolbarButton = componentName === 'ToolbarButton' ||
        componentName === 'UndoToolbarButton' ||
        componentName === 'RedoToolbarButton' ||
        componentName === 'SuggestionToolbarButton' ||
        componentName === 'CommentToolbarButton' ||
        componentName === 'AIToolbarButton' ||
        componentName === 'ExportToolbarButton' ||
        componentName === 'ImportToolbarButton';

      return isToolbarButton;
    }
  );

  // If children contain a ToolbarButton, render them directly to avoid nesting
  if (hasToolbarButtonChild) {
    console.log('Rendering as div to avoid nesting', { name: _name });
    return (
      <div
        className={cn(
          'flex items-center gap-2 w-full justify-start h-auto p-2 rounded-md hover:bg-muted',
          pressed && 'bg-accent text-accent-foreground',
          className
        )}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {children}
        {showText && (
          <span className="text-sm font-medium truncate">
            {_name}
          </span>
        )}
      </div>
    );
  }

  console.log('Rendering as ToolbarButton', { name: _name, hasToolbarButtonChild });
  return (
    <ToolbarButton
      tooltip={tooltip}
      className={cn(
        'flex items-center gap-2 w-full justify-start h-auto p-2 rounded-md hover:bg-muted',
        pressed && 'bg-accent text-accent-foreground',
        className
      )}
      onClick={handleClick}
      pressed={pressed}
      disabled={isDisabled}
    >
      {children}
      {showText && (
        <span className="text-sm font-medium truncate">
          {_name}
        </span>
      )}
    </ToolbarButton>
  );
}
