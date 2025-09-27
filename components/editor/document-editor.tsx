'use client';

import { Plate } from 'platejs/react';
import { forwardRef, use, useCallback, useImperativeHandle } from 'react';
import { z } from 'zod';

import { Editor, EditorContainer } from '@/components/ui/editor';
import { VerticalToolbar } from '@/components/ui/vertical-toolbar';
import { VerticalToolbarButtonsWithNames } from '@/components/ui/vertical-toolbar-buttons-with-names';
import { DocumentWithPlateContent } from '@/data/documents/get-document';
import { useDocumentEditor } from '@/hooks/use-document-editor';

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
      saveDelay = 10000,
    },
    ref
  ) => {
    const document = use(_documentPromise);
    console.log(document);
    // Use the custom hook for editor logic
    const { editor, saveDocument, debouncedSave } = useDocumentEditor({
      documentId,
      user,
      document,
      saveDelay,
      onSave,
    });

    // Stable onChange handler to prevent infinite loops
    const handleChange = useCallback(
      (value: unknown) => {
        // Auto-save on change if enabled
        if (autoSave) {
          debouncedSave(value);
        }
      },
      [autoSave, debouncedSave]
    );

    // Stable onBlur handler
    const handleBlur = useCallback(() => {
      // Save immediately on blur
      if (editor) {
        saveDocument(editor.children);
      }
    }, [editor, saveDocument]);

    // Expose save function via ref
    useImperativeHandle(
      ref,
      () => ({
        save: async () => {
          const result = await saveDocument(editor?.children);
          return result;
        },
        getContent: () => editor?.children,
      }),
      [saveDocument, editor]
    );

    return (
      <Plate editor={editor}>
        <div className="flex h-full w-full">
          <VerticalToolbar>
            <VerticalToolbarButtonsWithNames />
          </VerticalToolbar>
          <div className="flex-1">
            <EditorContainer>
              <Editor
                placeholder='Start typing to add content...'
                variant='fullWidth'
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </EditorContainer>
          </div>
        </div>
      </Plate>
    );
  }
);

DocumentEditor.displayName = 'DocumentEditor';
