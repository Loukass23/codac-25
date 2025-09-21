import { Suspense } from "react";

import { ParsedMarkdown } from "@/lib/markdown-parser";

import { LMSLayoutClient } from "./lms-layout-client";
import { LMSSkeleton } from "./lms-skeleton";

interface LMSLayoutProps {
    parsedMarkdown: ParsedMarkdown;
    currentPath: string;
}

export function LMSLayout({ parsedMarkdown, currentPath }: LMSLayoutProps) {
    return (
        <Suspense fallback={<LMSSkeleton />}>
            <LMSLayoutClient
                parsedMarkdown={parsedMarkdown}
                currentPath={currentPath}
            />
        </Suspense>
    );
}
