'use client';

import { Value } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';

import { EditorKit } from '@/components/editor/editor-kit';
import { MarkdownKit } from '@/components/editor/plugins/markdown-kit';

import { Editor, EditorContainer } from '../ui/editor';



interface PlateEditorProps {
    initialValue?: Value;
}

export function PlateEditor({ initialValue = [] }: PlateEditorProps) {
    const editor = usePlateEditor({
        plugins: [...EditorKit,
        ...MarkdownKit
        ],
        value: initialValue,
    });

    return (
        <Plate editor={editor}>
            <EditorContainer >
                <Editor variant="default" />
            </EditorContainer>
        </Plate>
    );
}