'use client';

import { Value } from 'platejs';
import { Plate, usePlateEditor, useEditorRef, useEditorSelector, useEditorState } from 'platejs/react';

import { Editor, EditorContainer } from '@/lib/plate/ui/editor';

import { EditorKit } from './editor-kit';

interface PlateEditorProps {
  initialValue?: Value;
}
const errorValue = [
  { type: 'p', children: [{ text: 'Error loading content' }] },
];
export function PlateEditor({ initialValue = errorValue }: PlateEditorProps) {
  // const value = normalizeNodeId(initialValue ?? errorValue);
  const editor = usePlateEditor({
    plugins: EditorKit,
    value: initialValue,


  });

  const handleChange = (value: Value) => {
    const isAstChange = editor.operations.some(
      op => 'set_selection' !== op.type
    )
    if (isAstChange) {
      // Save the value to Local Storage.
      const content = JSON.stringify(value)
      localStorage.setItem('content', content)
    }
  };

  return (
    <Plate editor={editor}

    // onChange={handleChange}
    >
      {/* <SaveToDatabase /> */}
      <EditorContainer>
        <Editor variant={'none'} />
      </EditorContainer>
    </Plate>
  );
}

const SaveToDatabase = () => {
  const editor = useEditorRef();
  const hasSelection = useEditorSelector((editor) => !!editor.selection, []);
  const editorState = useEditorState();
  console.log(editorState);
  console.log(hasSelection);
  console.log(editor);
  // ...
};
