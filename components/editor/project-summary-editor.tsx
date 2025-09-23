'use client';

import { Value } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Editor, EditorContainer } from '@/lib/plate/ui/editor';
import { EditorKit } from './editor-kit';

interface ProjectSummaryEditorProps {
    projectId: string;
    initialValue?: Value;
    onContentChange?: (value: Value) => void;
    canEdit?: boolean;
    showStatusBar?: boolean;
}

export function ProjectSummaryEditor({
    projectId: _projectId,
    initialValue = [],
    onContentChange,
    canEdit = true,
    showStatusBar = false,
}: ProjectSummaryEditorProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Create editor with uncontrolled state
    const editor = usePlateEditor({
        plugins: [...EditorKit],
        value: initialValue,
    });

    // Handle content changes
    const handleContentChange = useCallback(
        ({ value }: { value: Value }) => {
            setHasUnsavedChanges(true);
            onContentChange?.(value);
        },
        [onContentChange]
    );

    // Auto-save functionality
    const autoSave = useCallback(
        async (_value: Value) => {
            if (!canEdit || isSaving) return;

            try {
                setIsSaving(true);
                // Here you would typically call an API to save the project summary
                // For now, we'll just simulate the save
                await new Promise(resolve => setTimeout(resolve, 500));

                setLastSaved(new Date());
                setHasUnsavedChanges(false);

                toast.success('Summary saved successfully!');
            } catch (error) {
                // Log error for debugging
                if (process.env.NODE_ENV === 'development') {
                    console.error('Failed to save summary:', error);
                }
                toast.error('Failed to save summary. Please try again.');
            } finally {
                setIsSaving(false);
            }
        },
        [canEdit, isSaving]
    );

    // Debounced auto-save
    useEffect(() => {
        if (!canEdit || !hasUnsavedChanges) return;

        const timeoutId = setTimeout(() => {
            if (editor) {
                autoSave(editor.children);
            }
        }, 2000); // Auto-save after 2 seconds of inactivity

        return () => clearTimeout(timeoutId);
    }, [editor, hasUnsavedChanges, autoSave, canEdit]);

    return (
        <div className='space-y-4'>
            <Plate editor={editor} onChange={handleContentChange}>
                <EditorContainer>
                    <Editor
                        variant='fullWidth'
                        placeholder='Write your project summary here...'
                        readOnly={!canEdit}
                        className='min-h-[300px]'
                    />
                </EditorContainer>
            </Plate>

            {showStatusBar && (
                <div className='flex items-center justify-between text-sm text-muted-foreground border-t pt-2'>
                    <div className='flex items-center gap-4'>
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

                    {canEdit && (
                        <button
                            onClick={() => editor && autoSave(editor.children)}
                            disabled={isSaving || !hasUnsavedChanges}
                            className='rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
