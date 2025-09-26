import type { Value } from 'platejs';

import {
  MinimalStaticEditor,
  LightweightStaticEditor,
} from '@/components/editor/minimal-static-editor';
import { ServerStaticEditor } from '@/components/editor/server-static-editor';
import {
  StaticEditor,
  CustomStaticEditor,
} from '@/components/editor/static-editor';


// Sample content for demonstration
const sampleContent: Value = [
  {
    type: 'h1',
    children: [{ text: 'Static Editor Demo' }],
  },
  {
    type: 'p',
    children: [
      { text: 'This is a demonstration of the static editor using ' },
      { bold: true, text: 'PlateStatic' },
      { text: ' for server-side rendering and performance optimization.' },
    ],
  },
  {
    type: 'h2',
    children: [{ text: 'Features' }],
  },
  {
    type: 'ul',
    children: [
      {
        type: 'li',
        children: [{ text: 'Server-side rendering support' }],
      },
      {
        type: 'li',
        children: [{ text: 'React Server Component compatible' }],
      },
      {
        type: 'li',
        children: [{ text: 'Optimized performance with memoization' }],
      },
      {
        type: 'li',
        children: [{ text: 'No client-side JavaScript required' }],
      },
    ],
  },
  {
    type: 'h2',
    children: [{ text: 'Rich Content Example' }],
  },
  {
    type: 'p',
    children: [
      { text: 'You can include ' },
      { italic: true, text: 'italic text' },
      { text: ', ' },
      { bold: true, text: 'bold text' },
      { text: ', ' },
      { underline: true, text: 'underlined text' },
      { text: ', and ' },
      { strikethrough: true, text: 'strikethrough text' },
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
    type: 'p',
    children: [
      { text: 'You can also include ' },
      {
        type: 'a',
        url: 'https://platejs.org',
        children: [{ text: 'links' }],
      },
      { text: ' in your content.' },
    ],
  },
];

// Minimal content for lightweight editor
const minimalContent: Value = [
  {
    type: 'p',
    children: [
      { text: 'This is a ' },
      { bold: true, text: 'minimal' },
      { text: ' static editor with only basic formatting.' },
    ],
  },
];

export default function StaticEditorDemoPage() {
  return (
    <div className='container mx-auto p-6 space-y-8'>
      <div className='space-y-4'>
        <h1 className='text-3xl font-bold'>Static Editor Demo</h1>
        <p className='text-muted-foreground'>
          Demonstrating different static editor configurations using PlateStatic
          with MCP.
        </p>
      </div>

      <div className='grid gap-8'>
        {/* Server-side static editor */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>
            Server-Side Static Editor (RSC Compatible)
          </h2>
          <div className='border rounded-lg p-4'>
            <ServerStaticEditor
              value={sampleContent}
              className='prose max-w-none'
            />
          </div>
        </section>

        {/* Client-side static editor */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>Client-Side Static Editor</h2>
          <div className='border rounded-lg p-4'>
            <StaticEditor value={sampleContent} className='prose max-w-none' />
          </div>
        </section>

        {/* Minimal static editor */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>Minimal Static Editor</h2>
          <div className='border rounded-lg p-4'>
            <MinimalStaticEditor
              value={sampleContent}
              className='prose max-w-none'
            />
          </div>
        </section>

        {/* Lightweight static editor */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>Lightweight Static Editor</h2>
          <div className='border rounded-lg p-4'>
            <LightweightStaticEditor
              value={minimalContent}
              className='prose max-w-none'
            />
          </div>
        </section>

        {/* Custom static editor */}
        <section className='space-y-4'>
          <h2 className='text-2xl font-semibold'>Custom Static Editor</h2>
          <div className='border rounded-lg p-4'>
            <CustomStaticEditor
              value={sampleContent}
              className='prose max-w-none'
            />
          </div>
        </section>
      </div>

      <div className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Usage Examples</h2>
        <div className='space-y-4 text-sm'>
          <div>
            <h3 className='font-semibold'>Server Component (RSC):</h3>
            <pre className='bg-muted p-3 rounded mt-2 overflow-x-auto'>
              <code>{`import { ServerStaticEditor } from '@/components/editor/server-static-editor';

export default function MyPage() {
  return (
    <ServerStaticEditor 
      value={content}
      className="prose max-w-none"
    />
  );
}`}</code>
            </pre>
          </div>

          <div>
            <h3 className='font-semibold'>Client Component:</h3>
            <pre className='bg-muted p-3 rounded mt-2 overflow-x-auto'>
              <code>{`'use client';
import { StaticEditor } from '@/components/editor/static-editor';

export function MyComponent() {
  return (
    <StaticEditor 
      value={content}
      className="prose max-w-none"
    />
  );
}`}</code>
            </pre>
          </div>

          <div>
            <h3 className='font-semibold'>Minimal Editor:</h3>
            <pre className='bg-muted p-3 rounded mt-2 overflow-x-auto'>
              <code>{`import { MinimalStaticEditor } from '@/components/editor/minimal-static-editor';

export default function MyPage() {
  return (
    <MinimalStaticEditor 
      value={content}
      className="prose max-w-none"
    />
  );
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
