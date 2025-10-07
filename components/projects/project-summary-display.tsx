'use client';

import { Value } from 'platejs';
import { Plate, PlateContent } from 'platejs/react';
import { useMemo } from 'react';

import { createOptimalStaticEditor } from '@/lib/plate/plate-static-utils';

interface ProjectSummaryDisplayProps {
  content: Value;
  className?: string;
}

export function ProjectSummaryDisplay({
  content,
  className,
}: ProjectSummaryDisplayProps) {
  // Create a static editor for rendering
  const staticEditor = useMemo(() => {
    if (!content || !Array.isArray(content) || content.length === 0) {
      return null;
    }
    return createOptimalStaticEditor(content);
  }, [content]);

  // If no content or invalid content, show placeholder
  if (!staticEditor || !content || content.length === 0) {
    return (
      <div className={`text-muted-foreground italic ${className || ''}`}>
        No project summary available.
      </div>
    );
  }

  return (
    <div className={className}>
      <Plate editor={staticEditor as any} readOnly>
        <div className='prose prose-sm max-w-none dark:prose-invert'>
          <PlateContent />
        </div>
      </Plate>
    </div>
  );
}
