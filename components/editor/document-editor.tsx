'use client';

import { Plate } from 'platejs/react';
import { forwardRef, use, useCallback, useEffect, useImperativeHandle } from 'react';
import { z } from 'zod';

import { Editor, EditorContainer } from '@/components/ui/editor';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { VerticalToolbar } from '@/components/ui/vertical-toolbar';
import { DocumentWithPlateContent } from '@/data/documents/get-document';
import { useDebouncedSyncDocument } from '@/hooks/use-debounced-sync-document';
import { useDocumentEditor } from '@/hooks/use-document-editor';

import { VerticalToolbarButtonsWithNames } from '../ui/vertical-toolbar-buttons-with-names';

interface DocumentEditorProps {
  documentId: string;
  user: { id: string; name?: string; avatarUrl?: string };
  _documentPromise: Promise<DocumentWithPlateContent>;
  onSave?: (value: unknown) => void;
  autoSave?: boolean; // Enable auto-save functionality
  saveDelay?: number; // Delay in milliseconds before auto-save (default: 2000)
}

type SaveResult =
  | { success: true; data: { id: string }; error?: undefined }
  | { success: false; error: string | z.ZodIssue[]; data?: undefined };

const SIDE_PANEL_DEFAULT_SIZE = 5;
const MAIN_PANEL_DEFAULT_SIZE = 100 - SIDE_PANEL_DEFAULT_SIZE;

const SIDE_PANEL_MIN_SIZE = 5;
const SIDE_PANEL_MAX_SIZE = 15;

const MAIN_PANEL_MAX_SIZE = 100 - SIDE_PANEL_MIN_SIZE;
const MAIN_PANEL_MIN_SIZE = 100 - SIDE_PANEL_MAX_SIZE;
export interface DocumentEditorRef {
  save: () => Promise<SaveResult>;
  getContent: () => unknown;
}

/**
 * Document editor component with auto-save functionality
 * Supports both automatic saving on content change and manual saving via ref
 */
export const DocumentEditor = forwardRef<
  DocumentEditorRef,
  DocumentEditorProps
>(
  (
    {
      documentId,
      user,
      _documentPromise,
      onSave,
      autoSave = false,
      saveDelay = 5000,
    },
    ref
  ) => {
    const document = use(_documentPromise);
    console.log(document);

    // Use the new debounced sync document hook for autosave
    const {
      content: _content,
      setContent,
      isDirty,
      isSaving,
      hasError,
      errorMessage: _errorMessage,
    } = useDebouncedSyncDocument({
      documentId,
      initialContent: document?.content ?? [],
      saveDelay,
      onSave,
    });

    // Use the custom hook for editor logic (without autosave)
    const { editor, saveDocument } = useDocumentEditor({
      documentId,
      user,
      document,
      saveDelay,
      onSave: undefined, // Disable the old autosave mechanism
    });

    // Debug logging
    useEffect(() => {
      console.log('DocumentEditor mounted', { autoSave, documentId });
    }, [autoSave, documentId]);

    // Stable onChange handler to prevent infinite loops
    const handleChange = useCallback(
      (value: unknown) => {
        // Auto-save on change if enabled using the new implementation
        if (autoSave) {
          console.log('Editor onChange triggered, autosaving', { autoSave, hasValue: !!value });
          setContent(value);
        }
      },
      [autoSave, setContent]
    );

    // Stable onBlur handler
    const handleBlur = useCallback(() => {
      // Only save on blur if autosave is enabled
      if (editor && autoSave) {
        setContent(editor.children);
      }
      // Don't save on blur if autosave is disabled - let the user manually save
    }, [editor, autoSave, setContent]);

    // Expose save function via ref
    useImperativeHandle(
      ref,
      () => ({
        save: async () => {
          if (autoSave) {
            // Force save using the new implementation
            setContent(editor?.children);
            return { success: true, data: { id: documentId } };
          } else {
            // Use the old implementation for manual saves
            const result = await saveDocument(editor?.children);
            return result;
          }
        },
        getContent: () => editor?.children,
      }),
      [autoSave, setContent, saveDocument, editor, documentId]
    );

    // Create a save function for the toolbar
    const handleToolbarSave = useCallback(async () => {
      console.log('Save button clicked', { autoSave, hasEditor: !!editor });
      if (autoSave) {
        // Force save using the new implementation
        setContent(editor?.children);
      } else {
        // Use the old implementation for manual saves
        await saveDocument(editor?.children);
      }
    }, [autoSave, setContent, saveDocument, editor]);

    return (
      <Plate editor={editor}>
        <ResizablePanelGroup direction='horizontal' className='w-full'>
          <ResizablePanel
            defaultSize={SIDE_PANEL_DEFAULT_SIZE}
            minSize={SIDE_PANEL_MIN_SIZE}
            maxSize={SIDE_PANEL_MAX_SIZE}
            className='border-r'
          >
            <VerticalToolbar>
              <VerticalToolbarButtonsWithNames onSave={handleToolbarSave} />
            </VerticalToolbar>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            defaultSize={MAIN_PANEL_DEFAULT_SIZE}
            minSize={MAIN_PANEL_MIN_SIZE}
            maxSize={MAIN_PANEL_MAX_SIZE}
          >
            <EditorContainer>
              <Editor
                placeholder='Start typing to add content...'
                variant='fullWidth'
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </EditorContainer>
            {/* Save status indicator */}
            {autoSave && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 text-sm text-muted-foreground">
                {isSaving && (
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 animate-spin rounded-full border border-current border-t-transparent" />
                    <span>Saving...</span>
                  </div>
                )}
                {isDirty && !isSaving && (
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span>Unsaved changes</span>
                  </div>
                )}
                {!isDirty && !isSaving && (
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Saved</span>
                  </div>
                )}
                {hasError && (
                  <div className="flex items-center gap-1 text-red-500">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span>Save failed</span>
                  </div>
                )}
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>

      </Plate>
    );
  }
);

DocumentEditor.displayName = 'DocumentEditor';
