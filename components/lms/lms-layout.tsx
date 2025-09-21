"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ParsedMarkdown } from "@/lib/markdown-parser";

import { LMSNavigation } from "./lms-navigation";
import { MarkdownContent } from "./markdown-content";

interface LMSLayoutProps {
    parsedMarkdown: ParsedMarkdown;
    currentPath: string;
}

export function LMSLayout({ parsedMarkdown, currentPath }: LMSLayoutProps) {
    return (
        <div className="h-[calc(100vh-4rem)]">
            <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Left Panel - Navigation */}
                <ResizablePanel
                    defaultSize={20}
                    minSize={15}
                    maxSize={40}
                    className="border-r bg-background"
                >
                    <LMSNavigation />
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Panel - Content */}
                <ResizablePanel defaultSize={75} minSize={60}>
                    <div className="h-full overflow-y-auto">
                        <MarkdownContent
                            parsedMarkdown={parsedMarkdown}
                            currentPath={currentPath}
                        />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
