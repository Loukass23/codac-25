'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Value } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { logger } from '@/lib/logger';
import { BasicNodesKit } from '@/lib/plate/plugins/basic-nodes-kit';
import { MarkdownKit } from '@/lib/plate/plugins/markdown-kit';
import { Editor, EditorContainer } from '@/lib/plate/ui/editor';

interface ProjectEditorOptimizedProps {
  initialValue?: Value;
  projectId: string;
  onSave?: (value: Value) => Promise<void>;
  autoSave?: boolean;
  autoSaveInterval?: number; // in milliseconds
  showBackButton?: boolean;
  backLink?: string;
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
  // Use refs for uncontrolled state management
  const editorRef = useRef<any>(null);
  const lastSavedRef = useRef<Value>(initialValue);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Only track UI state, not editor content
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Create editor with uncontrolled state
  const editor = usePlateEditor({
    plugins: [...BasicNodesKit, ...MarkdownKit],
    value: initialValue,
  });

  // Store editor reference
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Optimized save function using refs
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

  // Debounced auto-save using refs
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

  // Track changes without re-rendering
  const handleChange = useCallback(
    ({ value }: { value: Value }) => {
      setHasUnsavedChanges(true);
      debouncedSave(value);
    },
    [debouncedSave]
  );

  // Manual save function
  const handleSave = useCallback(async () => {
    if (!editorRef.current) return;

    const currentValue = editorRef.current.children;
    await saveContent(currentValue);
    toast.success('Project saved successfully!');
  }, [saveContent]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className='h-screen flex flex-col'>
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
      <div className='flex-1 overflow-hidden'>
        <Plate editor={editor} onChange={handleChange}>
          <EditorContainer className='h-full'>
            <Editor
              variant='demo'
              placeholder='Describe your project...'
              className='h-full'
            />
          </EditorContainer>
        </Plate>
      </div>
    </div>
  );
}
