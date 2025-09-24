'use client';

import { ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import Link from 'next/link';
import { TElement } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';
import { useMemo } from 'react';

import { PlateStaticEditor } from '@/components/editor/plate-editor-static';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlateLMSWrapperProps {
  plateValue: TElement[];
  title?: string;
  description: string;
  showNavigation?: boolean;
  prevLink?: string;
  nextLink?: string;
  showTableOfContents?: boolean;
  showEditButton?: boolean;
  editLink?: string;
  className?: string;
}

export function PlateLMSWrapper({
  plateValue,
  title,
  description = '',
  showNavigation = false,
  prevLink,
  nextLink,
  showTableOfContents = true,
  showEditButton = false,
  editLink,
  className,
}: PlateLMSWrapperProps) {
  const editor = usePlateEditor({
    value: plateValue || [],
  });

  // Generate table of contents from Plate.js value
  const tableOfContents = useMemo(() => {
    if (!showTableOfContents) return [];

    const headings: Array<{ id: string; text: string; level: number }> = [];

    function extractHeadings(nodes: any[], level = 0): void {
      for (const node of nodes) {
        if (node.type?.startsWith('h') && node.type.length === 2) {
          const headingLevel = parseInt(node.type.charAt(1));
          const text = extractTextFromNode(node);
          if (text) {
            headings.push({
              id: `heading-${headings.length}`,
              text,
              level: headingLevel,
            });
          }
        }

        if (node.children && Array.isArray(node.children)) {
          extractHeadings(node.children, level + 1);
        }
      }
    }

    extractHeadings(plateValue || []);
    return headings;
  }, [plateValue, showTableOfContents]);

  const scrollToHeading = (headingId: string) => {
    if (typeof window === 'undefined') {
      return;
    }

    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Plate editor={editor}>
      <div className={cn('max-w-4xl mx-auto p-2', className)}>
        {/* Header */}
        {(title || description || showEditButton) && (
          <div className='mb-6'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                {title && (
                  <h1 className='text-4xl font-bold mb-4 mt-6 border-b-2 border-gray-200 dark:border-gray-700 pb-3'>
                    {title}
                  </h1>
                )}
                {description && (
                  <p className='text-lg my-4 leading-relaxed text-gray-700 dark:text-gray-300'>
                    {description}
                  </p>
                )}
              </div>

              {showEditButton && editLink && (
                <div className='ml-4 mt-6'>
                  <Button variant='outline' size='sm' asChild>
                    <Link href={editLink}>
                      <Edit className='w-4 h-4 mr-2' />
                      Edit
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Main Content */}
          <div className='lg:col-span-3'>
            <Card>
              <CardContent>
                <PlateStaticEditor initialValue={plateValue} />
              </CardContent>
            </Card>

            {/* Navigation */}
            {showNavigation && (prevLink ?? nextLink) && (
              <div className='mt-6 flex justify-between'>
                {prevLink && (
                  <Button variant='outline' asChild>
                    <Link href={prevLink}>
                      <ChevronLeft className='w-4 h-4 mr-2' />
                      Previous
                    </Link>
                  </Button>
                )}

                {nextLink && (
                  <Button variant='outline' asChild>
                    <Link href={nextLink}>
                      Next
                      <ChevronRight className='w-4 h-4 ml-2' />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Table of Contents */}
          {tableOfContents.length > 0 && (
            <div className='lg:col-span-1'>
              <Card className='sticky top-6'>
                <CardHeader>
                  <CardTitle className='text-lg font-bold text-gray-900 dark:text-gray-100'>
                    Contents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className='space-y-2'>
                    {tableOfContents.map((heading, _index) => (
                      <button
                        key={heading.id}
                        className={cn(
                          'block text-left text-sm transition-colors',
                          'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
                          'hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 py-1',
                          heading.level === 3 && 'ml-4',
                          heading.level === 4 && 'ml-8'
                        )}
                        onClick={() => scrollToHeading(heading.id)}
                      >
                        {heading.text}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Plate>
  );
}

// Helper function to extract text from a Plate.js node
function extractTextFromNode(node: any): string {
  if (typeof node === 'string') {
    return node;
  }

  if (node.text) {
    return node.text;
  }

  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractTextFromNode).join('');
  }

  return '';
}
