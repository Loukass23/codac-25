'use client';
import { usePlateEditor, Plate } from "platejs/react";
import { Editor, EditorContainer } from "../ui/editor";
import { getDocumentById } from "../../data/documents/get-document";
import { jsonToPlateValue } from "../../lib/plate/utils";

export function AsyncEditor({ documentId }: { documentId: string }) {
    const editor = usePlateEditor({
        value: async () => {
            const { content } = await getDocumentById(documentId);
            const plateValue = jsonToPlateValue(content);
            return plateValue;
        },
        autoSelect: 'end',
        onReady: ({ editor, value }) => {
            console.info('Editor ready with loaded value:', value);

        },
    });

    if (!editor.children.length) return <div>Loading…</div>;

    return (
        <Plate editor={editor}>
            <EditorContainer>
                <Editor />
            </EditorContainer>
        </Plate>
    );
}