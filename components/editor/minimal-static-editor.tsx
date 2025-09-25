import { createSlateEditor, PlateStatic } from 'platejs';
import type { Value } from 'platejs';

// Import only the essential base plugins for minimal static rendering
import { BaseBasicBlocksKit } from './plugins/basic-blocks-base-kit';
import { BaseBasicMarksKit } from './plugins/basic-marks-base-kit';
import { BaseLinkKit } from './plugins/link-base-kit';

// Minimal kit with only essential plugins
const MinimalStaticKit = [
  ...BaseBasicBlocksKit, // Headings, paragraphs, blockquotes
  ...BaseBasicMarksKit, // Bold, italic, underline, etc.
  ...BaseLinkKit, // Links
];

interface MinimalStaticEditorProps {
  value: Value;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Minimal static editor component for basic content rendering
 * Only includes essential plugins for performance
 * Safe to use in server components and SSR
 */
export function MinimalStaticEditor({
  value,
  className,
  style,
}: MinimalStaticEditorProps) {
  const editor = createSlateEditor({
    plugins: MinimalStaticKit,
    value,
  });

  return <PlateStatic editor={editor} className={className} style={style} />;
}

/**
 * Lightweight static editor for simple text content
 * Only includes paragraph and basic marks
 */
const LightweightStaticKit = [
  ...BaseBasicMarksKit, // Bold, italic, underline, etc.
];

export function LightweightStaticEditor({
  value,
  className,
  style,
}: MinimalStaticEditorProps) {
  const editor = createSlateEditor({
    plugins: LightweightStaticKit,
    value,
  });

  return <PlateStatic editor={editor} className={className} style={style} />;
}
