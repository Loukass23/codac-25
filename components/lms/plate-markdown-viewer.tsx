"use client";

import { type Value } from 'platejs';
import { createPlateEditor, Plate } from 'platejs/react';
import { useMemo } from 'react';

import { BasicNodesKit } from '@/components/basic-nodes-kit';
import { ListKit } from '@/components/list-kit';
import { MediaKit } from '@/components/media-kit';
import { TableKit } from '@/components/table-kit';
import { MarkdownKit } from '@/components/markdown-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { ParsedMarkdown } from '@/lib/markdown-parser';

interface PlateMarkdownViewerProps {
    parsedMarkdown: ParsedMarkdown;
    className?: string;
}

// Minimal plugins for viewing - no editing features
const viewerPlugins = [
    ...BasicNodesKit,
    ...ListKit,
    ...MediaKit,
    ...TableKit,
    ...MarkdownKit,
];

// Simple markdown to Plate.js converter
function convertMarkdownToPlate(markdown: string): Value {
    const lines = markdown.split('\n');
    const elements: Value = [];
    let currentList: any = null;
    let inCodeBlock = false;
    let codeBlockLanguage = '';
    let codeBlockLines: string[] = [];

    for (const line of lines) {
        const trimmedLine = line.trim();

        // Handle code blocks
        if (trimmedLine.startsWith('```')) {
            if (!inCodeBlock) {
                // Start code block
                if (currentList) {
                    elements.push(currentList);
                    currentList = null;
                }
                inCodeBlock = true;
                codeBlockLanguage = trimmedLine.slice(3) || 'text';
                codeBlockLines = [];
            } else {
                // End code block
                inCodeBlock = false;
                if (codeBlockLines.length > 0) {
                    elements.push({
                        type: 'code_block',
                        lang: codeBlockLanguage,
                        children: [{ text: codeBlockLines.join('\n') }]
                    });
                }
                codeBlockLines = [];
            }
            continue;
        }

        if (inCodeBlock) {
            codeBlockLines.push(line);
            continue;
        }

        // Handle headings
        if (trimmedLine.startsWith('#')) {
            if (currentList) {
                elements.push(currentList);
                currentList = null;
            }

            const level = Math.min(trimmedLine.match(/^#+/)?.[0].length || 1, 6);
            const text = trimmedLine.replace(/^#+\s*/, '');

            if (text) {
                elements.push({
                    type: `h${level}`,
                    children: [{ text }]
                });
            }
            continue;
        }

        // Handle bullet lists
        if (trimmedLine.match(/^[-*+]\s/)) {
            const text = trimmedLine.replace(/^[-*+]\s/, '');

            if (!currentList) {
                currentList = {
                    type: 'ul',
                    children: []
                };
            }

            currentList.children.push({
                type: 'li',
                children: [{ text }]
            });
            continue;
        }

        // Handle numbered lists
        if (trimmedLine.match(/^\d+\.\s/)) {
            const text = trimmedLine.replace(/^\d+\.\s/, '');

            if (!currentList || currentList.type !== 'ol') {
                if (currentList) {
                    elements.push(currentList);
                }
                currentList = {
                    type: 'ol',
                    children: []
                };
            }

            currentList.children.push({
                type: 'li',
                children: [{ text }]
            });
            continue;
        }

        // Handle regular paragraphs
        if (trimmedLine) {
            if (currentList) {
                elements.push(currentList);
                currentList = null;
            }

            elements.push({
                type: 'p',
                children: [{ text: trimmedLine }]
            });
        } else {
            // Empty line - close current list if any
            if (currentList) {
                elements.push(currentList);
                currentList = null;
            }
        }
    }

    // Close any remaining list
    if (currentList) {
        elements.push(currentList);
    }

    return elements.length > 0 ? elements : [{ type: 'p', children: [{ text: 'No content' }] }];
}

export function PlateMarkdownViewer({ parsedMarkdown, className }: PlateMarkdownViewerProps) {
    // Convert markdown content to Plate.js Value format
    const plateValue = useMemo((): Value => {
        return convertMarkdownToPlate(parsedMarkdown.content);
    }, [parsedMarkdown.content]);

    const editor = useMemo(() => createPlateEditor({
        plugins: viewerPlugins,
        value: plateValue,
    }), [plateValue]);

    return (
        <div className={className}>
            <Plate editor={editor} readOnly={true}>
                <EditorContainer className="max-w-full">
                    <Editor
                        variant="default"
                        className="max-w-full prose prose-lg dark:prose-invert
                            prose-headings:scroll-mt-20 prose-headings:font-semibold
                            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                            prose-p:text-gray-700 dark:prose-p:text-gray-300
                            prose-a:text-blue-600 dark:prose-a:text-blue-400
                            prose-a:no-underline hover:prose-a:underline
                            prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                            prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                            prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900
                            prose-blockquote:border-l-4 prose-blockquote:border-blue-500
                            prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800
                            prose-table:border-collapse prose-table:border
                            prose-th:border prose-th:bg-gray-50 dark:prose-th:bg-gray-800
                            prose-td:border prose-td:px-4 prose-td:py-2
                            prose-img:rounded-lg prose-img:shadow-lg
                            prose-img:max-w-full prose-img:h-auto"
                    />
                </EditorContainer>
            </Plate>
        </div>
    );
}
