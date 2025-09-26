import { createSlateEditor, PlateStatic } from 'platejs';
import type { Value } from 'platejs';

import { BaseEditorKit } from './editor-base-kit';

interface ServerStaticEditorProps {
  value: Value;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Server-side static editor component for RSC/SSR
 * This component is safe to use in React Server Components
 * and doesn't require client-side JavaScript
 */
export function ServerStaticEditor({
  value,
  className,
  style,
}: ServerStaticEditorProps) {
  const editor = createSlateEditor({
    plugins: BaseEditorKit,
    value,
  });

  return <PlateStatic editor={editor} className={className} style={style} />;
}

/**
 * Server-side static editor with custom plugins
 * Allows for more control over which plugins are included
 */
interface CustomServerStaticEditorProps extends ServerStaticEditorProps {
  plugins?: any[];
}

export function CustomServerStaticEditor({
  value,
  className,
  style,
  plugins = BaseEditorKit,
}: CustomServerStaticEditorProps) {
  const editor = createSlateEditor({
    plugins,
    value,
  });

  return <PlateStatic editor={editor} className={className} style={style} />;
}
