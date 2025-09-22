import { VariantProps } from 'class-variance-authority';
import { createStaticEditor, PlateStatic, Value } from 'platejs';

import { BaseEditorKit } from '@/components/editor/editor-base-kit';
import { editorVariants } from '@/components/editor/editor-variants';
import { staticComponents } from '@/lib/plate/static-components';
import { cn } from '@/lib/utils';
interface PlateStaticEditorProps {
  initialValue?: Value;
  className?: string;
  variant?: string;
}

const errorValue = [
  { type: 'p', children: [{ text: 'Error loading content' }] },
];

export function PlateStaticEditor({
  initialValue = errorValue,
  variant = 'default',
  className,
  ...props
}: PlateStaticEditorProps & VariantProps<typeof editorVariants>) {
  // Use createStaticEditor for proper static rendering
  const editor = createStaticEditor({
    plugins: [...BaseEditorKit],
    components: staticComponents,
    value: initialValue || errorValue,
  });

  return (
    <PlateStatic
      editor={editor}
      className={cn(editorVariants({ variant }), className)}
      {...props}
    />
  );
}
