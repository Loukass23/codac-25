'use client';

import { use, useEffect } from 'react';
import { Plate, usePlateEditor } from 'platejs/react';
import { Document, User } from '@prisma/client';

import { Editor, EditorContainer } from '@/components/ui/editor';
import { discussionPlugin } from '@/components/editor/plugins/discussion-plugin-config';
import { EditorKit } from '@/components/editor/editor-kit';
import { jsonToPlateValue } from '@/lib/plate/utils';

interface DiscussionEditorExampleProps {
    documentId: string;
    user: User;
    _documentPromise: Promise<Document>;
    onSave?: (value: unknown) => void;
}

/**
 * Example component showing how to use the discussion plugin with real database data
 */
export function DiscussionEditorExample({
    documentId,
    user,
    _documentPromise,
    onSave
}: DiscussionEditorExampleProps) {
    const document = use(_documentPromise);
    const initialValue = jsonToPlateValue(document.content);

    const editor = usePlateEditor({
        plugins: [
            discussionPlugin.configure({
                options: {
                    currentUserId: user.id,
                    currentUser: { id: user.id, name: user.name, avatarUrl: user.avatar },
                    documentId,
                    discussions: [],
                    users: {},
                } as any
            }),
            ...EditorKit,
        ],
        value: initialValue,
    });

    // Set up user and load discussions after editor is created
    useEffect(() => {
        if (editor && documentId) {
            const plugin = editor.getPlugin(discussionPlugin);
            // Set the current user
            plugin.configure({
                options: {
                    currentUserId: user.id,
                    documentId,
                    discussions: [],
                    users: {},
                }
            });
            // Load discussions
            // plugin.transforms.discussion.loadDiscussions();
        }
    }, [editor, documentId, user.id]);

    return (

        <Plate editor={editor}>
            <EditorContainer>
                <Editor
                    placeholder="Start typing to add content..."
                    className="min-h-[500px] w-full"
                    onBlur={() => {
                        if (onSave) {
                            onSave(editor.children);
                        }
                    }}
                />
            </EditorContainer>
        </Plate>

    );
}
