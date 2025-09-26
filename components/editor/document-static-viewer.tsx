import type { Value } from 'platejs';

import type { DocumentWithPlateContent } from '@/data/documents/get-document';

import { MinimalStaticEditor } from './minimal-static-editor';
import { ServerStaticEditor } from './server-static-editor';
import { StaticEditor } from './static-editor';


interface DocumentStaticViewerProps {
  document: DocumentWithPlateContent;
  variant?: 'full' | 'minimal' | 'server';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Static document viewer component
 * Renders document content using PlateStatic for optimal performance
 */
export function DocumentStaticViewer({
  document,
  variant = 'full',
  className,
  style,
}: DocumentStaticViewerProps) {
  const content = document.content;

  // Handle empty or invalid content
  if (!content || !Array.isArray(content) || content.length === 0) {
    return (
      <div className={className} style={style}>
        <p className='text-muted-foreground italic'>No content available</p>
      </div>
    );
  }

  switch (variant) {
    case 'server':
      return (
        <ServerStaticEditor
          value={content}
          className={className}
          style={style}
        />
      );

    case 'minimal':
      return (
        <MinimalStaticEditor
          value={content}
          className={className}
          style={style}
        />
      );

    case 'full':
    default:
      return (
        <StaticEditor value={content} className={className} style={style} />
      );
  }
}

/**
 * Server-side document viewer for RSC/SSR
 */
export function ServerDocumentViewer({
  document,
  className,
  style,
}: Omit<DocumentStaticViewerProps, 'variant'>) {
  return (
    <DocumentStaticViewer
      document={document}
      variant='server'
      className={className}
      style={style}
    />
  );
}

/**
 * Minimal document viewer for simple content
 */
export function MinimalDocumentViewer({
  document,
  className,
  style,
}: Omit<DocumentStaticViewerProps, 'variant'>) {
  return (
    <DocumentStaticViewer
      document={document}
      variant='minimal'
      className={className}
      style={style}
    />
  );
}
