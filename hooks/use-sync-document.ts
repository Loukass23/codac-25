import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { updateDocument } from '@/actions/projects/update-document';
import { useEnqueuedPromises } from '@/hooks/use-enqueued-promises';

interface UseSyncDocumentProps {
    documentId: string;
    onSave?: (value: unknown) => void;
}

interface UseSyncDocumentReturn {
    workingDocument: unknown;
    updateDocument: (content: unknown) => void;
    isDirty: boolean;
    isSaving: boolean;
    hasError: boolean;
    errorMessage: string | null;
}

/**
 * Hook for synchronizing document content with the server
 * Manages local working document state and server synchronization
 */
export function useSyncDocument({
    documentId,
    onSave,
}: UseSyncDocumentProps): UseSyncDocumentReturn {
    const [workingDocument, setWorkingDocument] = useState<unknown>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { enqueuePromise } = useEnqueuedPromises();
    const lastSavedContentRef = useRef<unknown>(null);

    // Initialize working document
    useEffect(() => {
        if (workingDocument === null) {
            setWorkingDocument([]);
        }
    }, [workingDocument]);

    const updateDocumentContent = useCallback((content: unknown) => {
        setWorkingDocument(content);
        setIsDirty(true);
        setHasError(false);
        setErrorMessage(null);

        // Enqueue the save operation
        enqueuePromise(async () => {
            setIsSaving(true);

            try {
                const result = await updateDocument({
                    id: documentId,
                    content,
                });

                if (result.success) {
                    lastSavedContentRef.current = content;
                    setIsDirty(false);
                    setHasError(false);
                    setErrorMessage(null);

                    // Call the optional onSave callback
                    if (onSave) {
                        onSave(content);
                    }

                    toast.success('Document saved');
                } else {
                    setHasError(true);
                    setErrorMessage('Failed to save document');
                    toast.error('Failed to save document');
                }
            } catch (error) {
                setHasError(true);
                const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                setErrorMessage(errorMsg);
                toast.error('An unexpected error occurred while saving');
                console.error('Error saving document:', error);
            } finally {
                setIsSaving(false);
            }
        });
    }, [documentId, onSave, enqueuePromise]);

    return {
        workingDocument,
        updateDocument: updateDocumentContent,
        isDirty,
        isSaving,
        hasError,
        errorMessage,
    };
}
