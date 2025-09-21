'use client'

import React from 'react'

import { ProjectEditorRegistry } from './project-editor-registry'

interface ProjectSummaryDisplayRegistryProps {
    summary?: any
    fallbackDescription?: string
    className?: string
}

export function ProjectSummaryDisplayRegistry({
    summary,
    fallbackDescription,
    className = "prose prose-sm max-w-none"
}: ProjectSummaryDisplayRegistryProps) {
    // If no summary exists, show fallback description or nothing
    if (!summary || !Array.isArray(summary) || summary.length === 0) {
        if (fallbackDescription) {
            return (
                <div className={className}>
                    <p className="text-muted-foreground">{fallbackDescription}</p>
                </div>
            )
        }
        return null
    }

    // Check if summary is just empty or placeholder content
    if (isEmptySummary(summary)) {
        if (fallbackDescription) {
            return (
                <div className={className}>
                    <p className="text-muted-foreground">{fallbackDescription}</p>
                </div>
            )
        }
        return null
    }

    return (
        <div className={className}>
            <ProjectEditorRegistry
                initialValue={summary}
                contentId="display-only"
                readOnly={true}
                showStatusBar={false}
                placeholder=""
                className="border-none"
            />
        </div>
    )
}

// Helper function to check if summary contains actual content
function isEmptySummary(summary: any): boolean {
    if (!summary || summary.length === 0) return true

    // Check if it's just empty paragraphs or placeholder text
    for (const node of summary) {
        if (node.type === 'p') {
            const text = node.children?.[0]?.text
            if (text && typeof text === 'string' && text.trim() !== '' &&
                text !== 'Tell the story of your project...' &&
                text !== 'Tell your project story...') {
                return false // Found actual content
            }
        } else if (node.type !== 'p') {
            // Any non-paragraph content counts as actual content
            return false
        }
    }

    return true // Only found empty or placeholder content
}
