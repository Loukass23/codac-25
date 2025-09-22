'use client';

import { Value } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';

import { MarkdownKit } from '@/lib/plate/plugins/markdown-kit';
import { VariantProps } from 'class-variance-authority';

import { Editor, EditorContainer } from '@/lib/plate/ui/editor';
import { EditorKit } from './editor-kit';
import { editorVariants } from './editor-variants';

interface PlateEditorProps {
  initialValue?: Value;
  className?: string;
}
const errorValue = [
  { type: 'p', children: [{ text: 'Error loading content' }] },
];

export function PlateEditor({
  initialValue = errorValue,
  variant = 'default',
  className,
  ...props
}: PlateEditorProps & VariantProps<typeof editorVariants>) {
  const editor = usePlateEditor({
    plugins: [...EditorKit, ...MarkdownKit],
    value: initialValue,
  });

  return (
    <Plate editor={editor} {...props}>
      <EditorContainer>
        <Editor variant={'none'} />
      </EditorContainer>
    </Plate>
  );
}
