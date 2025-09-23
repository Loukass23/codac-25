'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Value } from 'platejs';
import { Plate, usePlateEditor, useEditorRef, useEditorSelector } from 'platejs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { logger } from '@/lib/logger';
import { Editor, EditorContainer } from '@/lib/plate/ui/editor';
import { jsonToPlateValue } from '@/lib/plate/utils';

import { EditorKit } from './editor-kit';

interface ProjectEditorOptimizedProps {
  initialValue?: Value;
  projectId: string;
  onSave?: (value: Value) => Promise<void>;
  autoSave?: boolean;
  autoSaveInterval?: number; // in millisecond=
  showBackButton?: boolean;
  backLink?: string;
}

// Save functionality component using proper Plate.js hooks
function SaveManager({
  projectId,
  onSave,
  autoSave,
  autoSaveInterval,
  showBackButton,
  backLink,
  children,
}: {
  projectId: string;
  onSave?: (value: Value) => Promise<void>;
  autoSave: boolean;
  autoSaveInterval: number;
  showBackButton: boolean;
  backLink?: string;
  children: (props: {
    isSaving: boolean;
    lastSaved: Date | null;
    hasUnsavedChanges: boolean;
    handleSave: () => Promise<void>;
    showBackButton: boolean;
    backLink?: string;
  }) => React.ReactNode;
}) {
  const editor = useEditorRef();
  const lastSavedRef = useRef<Value>([]);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Get current editor value using useEditorSelector for performance
  const currentValue = useEditorSelector((editor) => editor.children, []);

  // Optimized save function
  const saveContent = useCallback(
    async (value: Value) => {
      if (!onSave || isSaving) return;

      try {
        setIsSaving(true);
        await onSave(value);
        lastSavedRef.current = value;
        setLastSaved(new Date());
        setHasUnsavedChanges(false);

        logger.debug('Project content auto-saved', {
          action: 'auto_save_project',
          metadata: {
            projectId,
            contentLength: JSON.stringify(value).length,
          },
        });
      } catch (error) {
        logger.error(
          'Failed to auto-save project content',
          error instanceof Error ? error : new Error(String(error)),
          {
            action: 'auto_save_project',
            metadata: { projectId },
          }
        );

        toast.error('Failed to save changes. Please try again.');
      } finally {
        setIsSaving(false);
      }
    },
    [onSave, isSaving, projectId]
  );

  // Debounced auto-save
  const debouncedSave = useCallback(
    (value: Value) => {
      if (!autoSave || !onSave) return;

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout
      saveTimeoutRef.current = setTimeout(() => {
        if (JSON.stringify(value) !== JSON.stringify(lastSavedRef.current)) {
          saveContent(value);
        }
      }, autoSaveInterval);
    },
    [autoSave, onSave, autoSaveInterval, saveContent]
  );

  // Track changes and trigger auto-save
  useEffect(() => {
    if (currentValue && currentValue !== lastSavedRef.current) {
      setHasUnsavedChanges(true);
      debouncedSave(currentValue);
    }
  }, [currentValue, debouncedSave]);

  // Manual save function
  const handleSave = useCallback(async () => {
    if (!editor) return;

    const currentValue = editor.children;
    await saveContent(currentValue);
    toast.success('Project saved successfully!');
  }, [editor, saveContent]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {children({
        isSaving,
        lastSaved,
        hasUnsavedChanges,
        handleSave,
        showBackButton,
        backLink,
      })}
    </>
  );
}

export function ProjectEditorOptimized({
  initialValue = [],
  projectId,
  onSave,
  autoSave = true,
  autoSaveInterval = 30000, // 30 seconds
  showBackButton = false,
  backLink,
}: ProjectEditorOptimizedProps) {
  // Validate and normalize initial value
  const normalizedValue = useMemo((): Value => {
    try {
      // If initialValue is empty or invalid, provide a default structure
      if (!initialValue || !Array.isArray(initialValue) || initialValue.length === 0) {
        return [
          {
            type: 'p',
            children: [{ text: '' }],
          },
        ] as Value;
      }

      // Use the improved jsonToPlateValue function for validation
      return jsonToPlateValue(initialValue);
    } catch (error) {
      logger.error(
        'Failed to normalize initial value for Plate.js editor',
        error instanceof Error ? error : new Error(String(error)),
        {
          action: 'normalize_plate_value',
          metadata: { projectId, initialValueType: typeof initialValue },
        }
      );

      // Return a safe default structure
      return [
        {
          type: 'p',
          children: [{ text: '' }],
        },
      ] as Value;
    }
  }, [initialValue, projectId]);

  // Create editor with uncontrolled state
  const editor = usePlateEditor({
    plugins: [...EditorKit],
    value: normalizedValue,
  });

  // Log editor creation for debugging
  useEffect(() => {
    logger.debug('Plate.js editor created', {
      action: 'create_plate_editor',
      metadata: {
        projectId,
        initialValueLength: initialValue?.length || 0,
        normalizedValueLength: normalizedValue.length,
      },
    });
  }, [editor, projectId, initialValue?.length, normalizedValue.length]);

  return (
    <div className='h-screen flex flex-col'>
      <Plate editor={editor} key={`editor-${projectId}`}>
        <SaveManager
          projectId={projectId}
          onSave={onSave}
          autoSave={autoSave}
          autoSaveInterval={autoSaveInterval}
          showBackButton={showBackButton}
          backLink={backLink}
        >
          {({ isSaving, lastSaved, hasUnsavedChanges, handleSave, showBackButton, backLink }) => (
            <>
              {/* Save status indicator */}
              <div className='flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
                <div className='flex items-center gap-4'>
                  {showBackButton && backLink && (
                    <Link
                      href={backLink}
                      className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
                    >
                      <ArrowLeft className='w-4 h-4' />
                      Back to View
                    </Link>
                  )}

                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    {isSaving && (
                      <span className='flex items-center gap-1'>
                        <div className='h-2 w-2 animate-pulse rounded-full bg-blue-500' />
                        Saving...
                      </span>
                    )}
                    {!isSaving && lastSaved && (
                      <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                    )}
                    {hasUnsavedChanges && !isSaving && (
                      <span className='text-amber-600'>Unsaved changes</span>
                    )}
                  </div>
                </div>

                {onSave && (
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !hasUnsavedChanges}
                    className='rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                )}
              </div>

              {/* Editor - takes full remaining space */}
              <div className='flex-1'>
                <EditorContainer className='h-full'>
                  <Editor
                    variant='fullWidth'
                    placeholder='Describe your project...'
                    className='h-full'
                  />
                </EditorContainer>
              </div>
            </>
          )}
        </SaveManager>
      </Plate>
    </div>
  );
}
