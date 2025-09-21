"use client";

import { ParsedMarkdown } from "@/lib/markdown-parser";

import { LMSContentWrapper } from "./lms-content-wrapper";

interface LMSLayoutClientProps {
    parsedMarkdown: ParsedMarkdown;
    currentPath: string;
}

export function LMSLayoutClient({ parsedMarkdown, currentPath }: LMSLayoutClientProps) {
    return (
        <LMSContentWrapper
            parsedMarkdown={parsedMarkdown}
            currentPath={currentPath}
        />
    );
}
