import { useCallback, useEffect, useRef, useState } from 'react';

import { useSyncDocument } from '@/hooks/use-sync-document';

interface UseDebouncedSyncDocumentProps {
    documentId: string;
    initialContent?: unknown;
    saveDelay?: number;
    onSave?: (value: unknown) => void;
}

interface UseDebouncedSyncDocumentReturn {
    content: unknown;
    setContent: (content: unknown) => void;
    isDirty: boolean;
    isSaving: boolean;
    hasError: boolean;
    errorMessage: string | null;
}

/**
 * Hook for debounced document synchronization with local storage
 * Provides debounced setter functions that delegate to useSyncDocument
 * Keeps track of isDirty flag and prevents beforeunload if dirty
 */
export function useDebouncedSyncDocument({
    documentId,
    initialContent = [],
    saveDelay = 5000,
    onSave,
}: UseDebouncedSyncDocumentProps): UseDebouncedSyncDocumentReturn {
    const [content, setContentState] = useState<unknown>(initialContent);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isDirtyRef = useRef(false);

    const {
        workingDocument,
        updateDocument,
        isDirty: syncIsDirty,
        isSaving,
        hasError,
        errorMessage,
    } = useSyncDocument({
        documentId,
        onSave,
    });

    // Update local content when working document changes
    useEffect(() => {
        if (workingDocument !== null) {
            setContentState(workingDocument);
        }
    }, [workingDocument]);

    // Debounced setter for content
    const setContent = useCallback(
        (newContent: unknown) => {
            setContentState(newContent);
            isDirtyRef.current = true;

            // Clear existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Set new timeout
            timeoutRef.current = setTimeout(() => {
                updateDocument(newContent);
                isDirtyRef.current = false;
            }, saveDelay);
        },
        [updateDocument, saveDelay]
    );

    // Prevent beforeunload if there are pending changes
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDirtyRef.current || syncIsDirty) {
                event.preventDefault();
                event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return 'You have unsaved changes. Are you sure you want to leave?';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [syncIsDirty]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {
        content,
        setContent,
        isDirty: isDirtyRef.current || syncIsDirty,
        isSaving,
        hasError,
        errorMessage,
    };
}
