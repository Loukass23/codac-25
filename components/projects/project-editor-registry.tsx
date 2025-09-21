'use client';

import { Save, Cloud, CloudOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { normalizeNodeId } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';
import { useCallback, useEffect, useState } from 'react';

import { BasicBlocksKit } from '@/components/basic-blocks-kit';
import { BasicMarksKit } from '@/components/basic-marks-kit';
import { DndKit } from '@/components/editor/plugins/dnd-kit';
import { FixedToolbarKit } from '@/components/fixed-toolbar-kit';
import { FloatingToolbarKit } from '@/components/floating-toolbar-kit';
import { FontKit } from '@/components/font-kit';
import { ListKit } from '@/components/list-kit';
import { MediaKit } from '@/components/media-kit';
import { Button } from '@/components/ui/button';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { cn } from '@/lib/utils';

// Registry-based plugin configuration with theme support
const plugins = [
    ...BasicBlocksKit,
    ...BasicMarksKit,
    ...FontKit, // Add font and color support
    ...ListKit,
    ...MediaKit,
    ...DndKit, // Add drag and drop support
    ...FixedToolbarKit,
    ...FloatingToolbarKit,
];

interface SaveStatus {
    status: 'idle' | 'saving' | 'saved' | 'error';
    lastSaved?: Date;
    error?: string;
    hasUnsavedChanges: boolean;
}

interface ProjectEditorRegistryProps {
    initialValue?: any;
    contentId?: string;
    onSave?: (content: any) => Promise<void>;
    readOnly?: boolean;
    showStatusBar?: boolean;
    placeholder?: string;
    className?: string;
}

export function ProjectEditorRegistry({
    initialValue,
    contentId: _contentId,
    onSave,
    readOnly = false,
    showStatusBar = true,
    placeholder = "Tell the story of your project...",
    className
}: ProjectEditorRegistryProps) {
    const [saveStatus, setSaveStatus] = useState<SaveStatus>({
        status: 'idle',
        hasUnsavedChanges: false,
    });
    const [lastSavedContent, setLastSavedContent] = useState(initialValue);

    // Update lastSavedContent when initialValue changes
    useEffect(() => {
        setLastSavedContent(initialValue);
    }, [initialValue]);

    const editor = usePlateEditor({
        plugins,
        value: initialValue || getDefaultContent(),
    });

    const handleSave = useCallback(async (content?: any) => {
        const contentToSave = content || editor.children;
        if (!onSave || !contentToSave) return;

        setSaveStatus(prev => ({ ...prev, status: 'saving' }));

        try {
            await onSave(contentToSave);
            setLastSavedContent(contentToSave);
            setSaveStatus({
                status: 'saved',
                lastSaved: new Date(),
                hasUnsavedChanges: false,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setSaveStatus({
                status: 'error',
                error: errorMessage,
                hasUnsavedChanges: true,
            });
        }
    }, [editor.children, onSave]);

    // Track changes for save indication
    useEffect(() => {
        if (!readOnly && editor.children) {
            const hasChanges = JSON.stringify(editor.children) !== JSON.stringify(lastSavedContent);
            setSaveStatus(prev => ({
                ...prev,
                hasUnsavedChanges: hasChanges && prev.status !== 'saving'
            }));
        }
    }, [editor.children, lastSavedContent, readOnly]);

    const getStatusIcon = () => {
        switch (saveStatus.status) {
            case 'saving':
                return <Cloud className="h-4 w-4 animate-pulse text-blue-500" />;
            case 'saved':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'error':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            default:
                return saveStatus.hasUnsavedChanges ? (
                    <CloudOff className="h-4 w-4 text-yellow-500" />
                ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                );
        }
    };

    const getStatusText = () => {
        switch (saveStatus.status) {
            case 'saving':
                return 'Saving...';
            case 'saved':
                return saveStatus.lastSaved
                    ? `Saved ${saveStatus.lastSaved.toLocaleTimeString()}`
                    : 'Saved';
            case 'error':
                return `Error: ${saveStatus.error}`;
            default:
                return saveStatus.hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved';
        }
    };

    return (
        <div className={cn("h-full flex flex-col w-full", className)}>
            {showStatusBar && !readOnly && (
                <div className="flex items-center justify-between p-2 border-t bg-muted/30">
                    <div className={cn(
                        "flex items-center gap-2 text-sm",
                        saveStatus.status === 'error' && "text-red-500",
                        saveStatus.status === 'saved' && "text-green-500",
                        saveStatus.hasUnsavedChanges && saveStatus.status === 'idle' && "text-yellow-600"
                    )}>
                        {getStatusIcon()}
                        <span>{getStatusText()}</span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSave()}
                        disabled={saveStatus.status === 'saving'}
                    >
                        <Save className="h-4 w-4 mr-1" />
                        Save Now
                    </Button>
                </div>
            )}
            <Plate editor={editor} readOnly={readOnly}>
                <EditorContainer className="w-full">
                    <Editor
                        variant="fullWidth"
                        placeholder={placeholder}
                        className="w-full px-2 sm:px-4 pt-4 pb-16 text-base break-words overflow-wrap-anywhere"
                    />
                </EditorContainer>
            </Plate>


        </div>
    );
}

// Helper function to get default content
function getDefaultContent() {
    return normalizeNodeId([
        {
            children: [{ text: 'Tell the story of your project...' }],
            type: 'p',
        },
    ]);
}
