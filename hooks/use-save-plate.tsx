import { Value } from 'platejs';
import { useEditorRef, useEditorSelector } from 'platejs/react';
import { useRef, useState, useCallback, useEffect } from 'react';

import { logger } from '@/lib/logger';

interface UseSavePlateProps {
  onSave: (value: Value) => void;
  autoSave: boolean;
  autoSaveInterval: number;
}

function useSavePlate({
  onSave,
  autoSave,
  autoSaveInterval,
}: UseSavePlateProps) {
  const editor = useEditorRef();
  const lastSavedRef = useRef<Value>([]);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Get current editor value using useEditorSelector for performance
  const currentValue = useEditorSelector(editor => editor.children, []);

  // Optimized save function
  const saveContent = useCallback(
    async (value: Value) => {
      if (!onSave || isSaving) return;

      try {
        setIsSaving(true);
        onSave(value);
        lastSavedRef.current = value;
        setLastSaved(new Date());
        setHasUnsavedChanges(false);

        logger.debug('Project content auto-saved', {
          action: 'auto_save_project',
          metadata: {
            contentLength: JSON.stringify(value).length,
          },
        });
      } catch (error) {
        logger.error(
          'Failed to auto-save project content',
          error instanceof Error ? error : new Error(String(error)),
          {
            action: 'auto_save_project',
          }
        );

        return;
      } finally {
        setIsSaving(false);
      }
    },
    [onSave, isSaving]
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
  const handleSavePlate = useCallback(async () => {
    if (!editor) return;
    const currentValue = editor.children;
    await saveContent(currentValue);
  }, [editor, saveContent]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);
  return { isSaving, lastSaved, hasUnsavedChanges, handleSavePlate };
}

export default useSavePlate;
