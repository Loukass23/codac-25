'use client';

import { createSlateEditor, PlateStatic } from 'platejs';
import type { Value } from 'platejs';
import { useMemo } from 'react';

import { BaseEditorKit } from './editor-base-kit';

interface StaticEditorProps {
  value: Value;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Static editor component for read-only content rendering
 * Uses PlateStatic for server-side rendering and performance optimization
 */
export function StaticEditor({ value, className, style }: StaticEditorProps) {
  const editor = useMemo(() => {
    return createSlateEditor({
      plugins: BaseEditorKit,
      value,
    });
  }, [value]);

  return <PlateStatic editor={editor} className={className} style={style} />;
}

/**
 * Static editor component with custom plugins
 * Allows for more control over which plugins are included
 */
interface CustomStaticEditorProps extends StaticEditorProps {
  plugins?: any[];
}

export function CustomStaticEditor({
  value,
  className,
  style,
  plugins = BaseEditorKit,
}: CustomStaticEditorProps) {
  const editor = useMemo(() => {
    return createSlateEditor({
      plugins,
      value,
    });
  }, [value, plugins]);

  return <PlateStatic editor={editor} className={className} style={style} />;
}
