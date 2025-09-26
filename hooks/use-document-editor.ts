import { usePlateEditor } from 'platejs/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { z } from 'zod';

import { EditorKit } from '@/components/editor/editor-kit';
import { discussionPlugin } from '@/components/editor/plugins/discussion-kit';
import { savePlugin } from '@/components/editor/plugins/save-kit';
import { DocumentWithPlateContent } from '@/data/documents/get-document';

interface UseDocumentEditorProps {
    documentId: string;
    user: { id: string; name?: string; avatarUrl?: string };
    document: DocumentWithPlateContent;
    saveDelay?: number;
    onSave?: (value: unknown) => void;
}

type SaveResult =
    | { success: true; data: { id: string }; error?: undefined }
    | { success: false; error: string | z.ZodIssue[]; data?: undefined };

interface UseDocumentEditorReturn {
    editor: ReturnType<typeof usePlateEditor>;
    saveDocument: (content?: unknown) => Promise<SaveResult>;
    debouncedSave: (content: unknown) => void;
}

export function useDocumentEditor({
    documentId,
    user,
    document,
    saveDelay = 2000,
    onSave,
}: UseDocumentEditorProps): UseDocumentEditorReturn {
    const initialValue = document?.content ?? [];
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // Memoize the plugins configuration to prevent recreation on every render
    const plugins = useMemo(() => [
        ...EditorKit,
        discussionPlugin.configure({
            options: {
                currentUserId: user.id,
                currentUser: {
                    id: user.id,
                    name: user.name ?? '',
                    avatarUrl: user.avatarUrl ?? '',
                },
                documentId,
                discussions: [],
                users: {},
            },
        }),
        savePlugin.configure({
            options: {
                documentId,
                saveDelay,
                onSave,
            },
        }),
    ], [user.id, user.name, user.avatarUrl, documentId, saveDelay, onSave]);

    // Create the editor with memoized plugins
    const editor = usePlateEditor({
        plugins,
        value: initialValue,
    });

    // Save function using the save plugin API
    const saveDocument = useCallback(
        async (content?: unknown) => {
            if (!editor) {
                return { success: false, error: 'Editor not initialized' };
            }

            // Use the save plugin API
            return await editor.api.save.save(content);
        },
        [editor]
    );

    // Debounced save function
    const debouncedSave = useCallback(
        (content: unknown) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                saveDocument(content);
            }, saveDelay);
        },
        [saveDocument, saveDelay]
    );

    // Load discussions after editor is created (only once)
    useEffect(() => {
        if (editor && documentId) {
            const plugin = editor.getPlugin(discussionPlugin);

            // Load discussions from database
            plugin.transforms.discussion.loadDiscussions().catch(error => {
                console.error('Failed to load discussions:', error);
            });
        }
    }, [editor, documentId]); // Removed user dependencies to prevent re-runs

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {
        editor,
        saveDocument: saveDocument as any,
        debouncedSave,
    };
}
