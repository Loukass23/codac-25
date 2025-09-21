"use client";

import { useState, useEffect, useTransition, useRef } from "react";

import { ParsedMarkdown } from "@/lib/markdown-parser";

// import { PlateMarkdownContentServer } from "./plate-markdown-content-server";
import { LMSContentSkeleton } from "./lms-content-skeleton";
import { MarkdownContent } from "./markdown-content";

interface LMSContentWrapperProps {
    parsedMarkdown: ParsedMarkdown;
    currentPath: string;
}

export function LMSContentWrapper({ parsedMarkdown, currentPath }: LMSContentWrapperProps) {
    const [isPending, startTransition] = useTransition();
    const [currentContent, setCurrentContent] = useState(parsedMarkdown);
    const [currentPathState, setCurrentPathState] = useState(currentPath);
    const previousPathRef = useRef(currentPath);

    useEffect(() => {
        // Only show loading if the path actually changed
        if (currentPath !== previousPathRef.current) {
            previousPathRef.current = currentPath;

            startTransition(() => {
                setCurrentPathState(currentPath);
                setCurrentContent(parsedMarkdown);
            });
        } else {
            // Update content without transition for same path
            setCurrentContent(parsedMarkdown);
        }
    }, [parsedMarkdown, currentPath]);

    if (isPending) {
        return <LMSContentSkeleton />;
    }

    return (
        <MarkdownContent
            parsedMarkdown={currentContent}
            currentPath={currentPathState}
        />
    );
}
