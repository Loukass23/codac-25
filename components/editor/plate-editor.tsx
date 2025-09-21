'use client';

import { Value } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';

import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit';
import { MarkdownKit } from '@/components/editor/plugins/markdown-kit';

import { EditorContainer, Editor } from '../ui/editor';



interface PlateEditorProps {
    initialValue?: Value;
}

export function PlateEditor({ initialValue = [] }: PlateEditorProps) {
    const editor = usePlateEditor({
        plugins: [...BasicNodesKit, ...MarkdownKit],
        value: initialValue,
    });

    return (
        <Plate editor={editor}>
            <EditorContainer>
                <Editor variant="demo" placeholder="Type..." />
            </EditorContainer>
        </Plate>
    );
}