'use client';

import { Value } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';
import { useCallback, useState } from 'react';

import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { Label } from '@/components/ui/label';

interface ProjectSummaryEditorProps {
    initialValue?: Value;
    onChange: (value: Value) => void;
    placeholder?: string;
}

export function ProjectSummaryEditor({
    initialValue = [
        {
            type: 'p',
            children: [{ text: '' }],
        },
    ],
    onChange,
    placeholder = 'Write your project summary...'
}: ProjectSummaryEditorProps) {
    const [value, setValue] = useState<Value>(initialValue);

    const editor = usePlateEditor({
        plugins: [...EditorKit],
        value,
    });

    const handleChange = useCallback((newValue: Value) => {
        setValue(newValue);
        onChange(newValue);
    }, [onChange]);

    return (
        <div className="space-y-2">
            <Label htmlFor="project-summary">Project Summary</Label>
            <div className="border rounded-md">
                <Plate editor={editor}>
                    <EditorContainer>
                        <Editor
                            placeholder={placeholder}
                            variant="fullWidth"
                            onChange={handleChange}
                        />
                    </EditorContainer>
                </Plate>
            </div>
            <p className="text-sm text-muted-foreground">
                Use the rich text editor to create a detailed project summary with formatting, lists, and more.
            </p>
        </div>
    );
}
