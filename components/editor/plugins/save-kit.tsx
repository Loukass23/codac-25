'use client';

import { createPlatePlugin } from 'platejs/react';
import { toast } from 'sonner';

import { updateDocument } from '@/actions/projects/update-document';

export interface TSaveConfig {
  documentId: string;
  saveDelay: number;
  onSave?: (value: unknown) => void;
  isAutoSaveEnabled: boolean;
}

// This plugin handles document saving functionality
export const savePlugin = createPlatePlugin({
  key: 'save',
  options: {
    documentId: '',
    saveDelay: 2000,
    onSave: undefined as ((value: unknown) => void) | undefined,
    isAutoSaveEnabled: true,
  } satisfies TSaveConfig,
})
  .extendApi(({ getOption }) => ({
    // Save the current document content
    save: async (content?: unknown) => {
      const documentId = getOption('documentId');
      const onSave = getOption('onSave');

      if (!documentId) {
        throw new Error('Document ID is required for saving');
      }

      try {
        const result = await updateDocument({
          id: documentId,
          content: content,
        });

        if (result.success) {
          toast.success('Document saved successfully');
          // Call the optional onSave callback
          if (onSave && content) {
            onSave(content);
          }
          return { success: true, data: result.data };
        } else {
          toast.error(result.error ?? 'Failed to save document');
          return { success: false, error: result.error };
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error saving document:', error);
        toast.error('An unexpected error occurred while saving');
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  }))
  .extendTransforms(({ setOption }) => ({
    // Set document ID
    setDocumentId: (documentId: string) => {
      setOption('documentId', documentId);
    },

    // Set save callback
    setOnSave: (callback: (value: unknown) => void) => {
      setOption('onSave', callback);
    },

    // Set save delay
    setSaveDelay: (delay: number) => {
      setOption('saveDelay', delay);
    },
  }));

// Save toolbar components
export { SimpleSaveButton } from '@/components/ui/simple-save-button';

export const SaveKit = [savePlugin];
