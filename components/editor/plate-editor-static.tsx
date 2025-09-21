"use client";

import { createSlateEditor, PlateStatic, TElement } from 'platejs';
import { memo, useMemo } from "react";

import { logger } from '@/lib/logger';

import { EditorKit } from "./editor-kit";
import { MarkdownKit } from "./plugins/markdown-kit";

interface PlateEditorStaticProps {
    plateValue: TElement[];
    className?: string;
}

export const PlateEditorStatic = memo(function PlateEditorStatic({ plateValue, className }: PlateEditorStaticProps) {
    // Create a static editor instance with necessary plugins
    const editor = useMemo(() => {
        try {
            if (!plateValue || !Array.isArray(plateValue)) {
                logger.warn('Invalid plateValue provided to PlateContent', {
                    action: 'create_plate_editor',
                    metadata: { plateValueType: typeof plateValue }
                });
                return createSlateEditor({
                    plugins: [...EditorKit, ...MarkdownKit],
                    value: [{ type: 'p', children: [{ text: 'Error loading content' }] }],
                });
            }

            return createSlateEditor({
                plugins: [...EditorKit, ...MarkdownKit],
                value: plateValue,
            });
        } catch (error) {
            logger.error('Failed to create Plate.js editor',
                error instanceof Error ? error : new Error(String(error)),
                {
                    action: 'create_plate_editor',
                    metadata: { plateValueLength: plateValue?.length || 0 }
                }
            );

            // Return a fallback editor
            return createSlateEditor({
                plugins: [...EditorKit, ...MarkdownKit],
                value: [{ type: 'p', children: [{ text: 'Error loading content' }] }],
            });
        }
    }, [plateValue]);

    return (
        <div className={className}>
            <PlateStatic
                editor={editor}
            />
        </div>
    );
});
