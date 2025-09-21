'use client'

import { type Value } from 'platejs'
import { useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

interface ProjectSummaryEditorProps {
    projectId: string
    initialValue?: Value
    onContentChange?: (content: Value) => void
    canEdit?: boolean
    showStatusBar?: boolean
}

export function ProjectSummaryEditor({
    initialValue,
    onContentChange,
    canEdit = true,
    showStatusBar = false
}: ProjectSummaryEditorProps) {
    const [content, setContent] = useState<string>(
        initialValue ? JSON.stringify(initialValue) : ''
    )

    const handleContentChange = (value: string) => {
        setContent(value)
        if (onContentChange) {
            try {
                const parsedContent = JSON.parse(value)
                onContentChange(parsedContent)
            } catch {
                // If parsing fails, just pass the string
                onContentChange(value as any)
            }
        }
    }

    if (!canEdit) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="prose max-w-none">
                        {content ? (
                            <div dangerouslySetInnerHTML={{ __html: content }} />
                        ) : (
                            <p className="text-muted-foreground">No summary available</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Project Summary Editor</CardTitle>
                <CardDescription>
                    Write a detailed summary of your project. You can use markdown formatting.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="Write your project summary here..."
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="min-h-[200px]"
                />
                {showStatusBar && (
                    <div className="mt-2 text-xs text-muted-foreground">
                        Characters: {content.length}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
