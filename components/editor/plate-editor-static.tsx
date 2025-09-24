import { createStaticEditor, PlateStatic, Value } from 'platejs';

import { BaseEditorKit } from '@/components/editor/editor-base-kit';
import { staticComponents } from '@/lib/plate/static-components';
interface PlateStaticEditorProps {
  initialValue?: Value;
}

const errorValue = [
  { type: 'p', children: [{ text: 'Error loading content' }] },
];

export function PlateStaticEditor({
  initialValue = errorValue,
  ...props
}: PlateStaticEditorProps) {
  // Use createStaticEditor for proper static rendering
  const editor = createStaticEditor({
    plugins: [...BaseEditorKit],
    components: staticComponents,
    value: initialValue || errorValue,
  });

  return (
    <PlateStatic
      className='prose prose-lg max-w-none dark:prose-invert'
      editor={editor}
      {...props}
    />
  );
}
