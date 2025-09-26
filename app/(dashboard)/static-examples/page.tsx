import type { Value } from 'platejs';

import { DocumentStaticViewer } from '@/components/editor/document-static-viewer';
import { MinimalStaticEditor } from '@/components/editor/minimal-static-editor';
import { ServerStaticEditor } from '@/components/editor/server-static-editor';
import { StaticEditor } from '@/components/editor/static-editor';
import {
  createOptimalStaticEditor,
  sanitizeForStatic,
} from '@/lib/plate/plate-static-utils';

// Example content with different complexity levels
const simpleContent: Value = [
  {
    type: 'p',
    children: [
      { text: 'Simple paragraph with ' },
      { bold: true, text: 'bold text' },
    ],
  },
];

const complexContent: Value = [
  {
    type: 'h1',
    children: [{ text: 'Complex Document' }],
  },
  {
    type: 'p',
    children: [
      { text: 'This document contains ' },
      { bold: true, text: 'various' },
      { text: ' formatting and ' },
      { italic: true, text: 'elements' },
      { text: '.' },
    ],
  },
  {
    type: 'blockquote',
    children: [
      {
        type: 'p',
        children: [{ text: 'This is a blockquote example.' }],
      },
    ],
  },
  {
    type: 'ul',
    children: [
      {
        type: 'li',
        children: [{ text: 'List item 1' }],
      },
      {
        type: 'li',
        children: [{ text: 'List item 2' }],
      },
    ],
  },
];

const interactiveContent: Value = [
  {
    type: 'p',
    children: [
      { text: 'This content has ' },
      {
        suggestion: true,
        suggestion_example: {
          id: 'example1',
          createdAt: Date.now(),
          type: 'insert',
          userId: 'user1',
        },
        text: 'suggestions',
      },
      { text: ' and ' },
      {
        comment: true,
        comment_example: true,
        text: 'comments',
      },
      { text: ' that will be sanitized for static rendering.' },
    ],
  },
];

export default function StaticExamplesPage() {
  return (
    <div className='container mx-auto p-6 space-y-8'>
      <div className='space-y-4'>
        <h1 className='text-3xl font-bold'>Static Editor Examples</h1>
        <p className='text-muted-foreground'>
          Comprehensive examples of using static editors in different scenarios.
        </p>
      </div>

      <div className='grid gap-8'>
        {/* Simple content */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>Simple Content</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <h3 className='font-medium'>Server-Side Static</h3>
              <div className='border rounded-lg p-4'>
                <ServerStaticEditor
                  value={simpleContent}
                  className='prose max-w-none'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <h3 className='font-medium'>Minimal Static</h3>
              <div className='border rounded-lg p-4'>
                <MinimalStaticEditor
                  value={simpleContent}
                  className='prose max-w-none'
                />
              </div>
            </div>
          </div>
        </section>

        {/* Complex content */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>Complex Content</h2>
          <div className='border rounded-lg p-4'>
            <ServerStaticEditor
              value={complexContent}
              className='prose max-w-none'
            />
          </div>
        </section>

        {/* Interactive content sanitization */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>
            Interactive Content (Sanitized)
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <h3 className='font-medium'>
                Original (with suggestions/comments)
              </h3>
              <div className='border rounded-lg p-4 bg-muted/20'>
                <StaticEditor
                  value={interactiveContent}
                  className='prose max-w-none'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <h3 className='font-medium'>Sanitized for Static</h3>
              <div className='border rounded-lg p-4'>
                <ServerStaticEditor
                  value={sanitizeForStatic(interactiveContent)}
                  className='prose max-w-none'
                />
              </div>
            </div>
          </div>
        </section>

        {/* Optimal editor selection */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>Optimal Editor Selection</h2>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <h3 className='font-medium'>Simple Content → Minimal Editor</h3>
              <div className='border rounded-lg p-4'>
                <MinimalStaticEditor
                  value={simpleContent}
                  className='prose max-w-none'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <h3 className='font-medium'>Complex Content → Full Editor</h3>
              <div className='border rounded-lg p-4'>
                <ServerStaticEditor
                  value={complexContent}
                  className='prose max-w-none'
                />
              </div>
            </div>
          </div>
        </section>

        {/* Performance comparison */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>Performance Comparison</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <h3 className='font-medium'>Minimal (Fastest)</h3>
              <div className='border rounded-lg p-4'>
                <MinimalStaticEditor
                  value={simpleContent}
                  className='prose max-w-none text-sm'
                />
              </div>
              <p className='text-xs text-muted-foreground'>
                Only basic plugins, minimal bundle size
              </p>
            </div>
            <div className='space-y-2'>
              <h3 className='font-medium'>Standard (Balanced)</h3>
              <div className='border rounded-lg p-4'>
                <ServerStaticEditor
                  value={simpleContent}
                  className='prose max-w-none text-sm'
                />
              </div>
              <p className='text-xs text-muted-foreground'>
                Full feature set, good performance
              </p>
            </div>
            <div className='space-y-2'>
              <h3 className='font-medium'>Client (Interactive)</h3>
              <div className='border rounded-lg p-4'>
                <StaticEditor
                  value={simpleContent}
                  className='prose max-w-none text-sm'
                />
              </div>
              <p className='text-xs text-muted-foreground'>
                Client-side rendering, more overhead
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Usage guidelines */}
      <div className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Usage Guidelines</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-3'>
            <h3 className='font-semibold'>When to Use ServerStaticEditor</h3>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>• React Server Components (RSC)</li>
              <li>• Server-side rendering (SSR)</li>
              <li>• Static site generation</li>
              <li>• SEO-critical content</li>
              <li>• Performance-critical applications</li>
            </ul>
          </div>
          <div className='space-y-3'>
            <h3 className='font-semibold'>When to Use MinimalStaticEditor</h3>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>• Simple text content only</li>
              <li>• Maximum performance requirements</li>
              <li>• Minimal bundle size needed</li>
              <li>• Basic formatting sufficient</li>
              <li>• Mobile-first applications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
