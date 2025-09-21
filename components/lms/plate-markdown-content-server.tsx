import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParsedMarkdown } from "@/lib/markdown-parser";
import { cn } from "@/lib/utils";

import { PlateMarkdownViewer } from "./plate-markdown-viewer";

interface PlateMarkdownContentServerProps {
    parsedMarkdown: ParsedMarkdown;
    currentPath: string;
    className?: string;
}

// Server-side table of contents generation
function generateTableOfContents(content: string) {
    const lines = content.split('\n');
    const headings: Array<{ id: string; text: string; level: number }> = [];

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('#')) {
            const level = Math.min(trimmedLine.match(/^#+/)?.[0].length || 1, 6);
            const text = trimmedLine.replace(/^#+\s*/, '');
            if (text && level >= 2 && level <= 4) {
                headings.push({
                    id: `heading-${index}`,
                    text,
                    level
                });
            }
        }
    });

    return headings;
}

export function PlateMarkdownContentServer({
    parsedMarkdown,
    currentPath: _currentPath,
    className
}: PlateMarkdownContentServerProps) {
    const { metadata } = parsedMarkdown;
    const tableOfContents = generateTableOfContents(parsedMarkdown.content);

    return (
        <div className={cn("max-w-4xl mx-auto p-4", className)}>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold mb-2">{metadata.title}</h1>
                {metadata.metaDescription && (
                    <p className="text-lg text-muted-foreground">{metadata.metaDescription}</p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardContent className="p-6">
                            <PlateMarkdownViewer
                                parsedMarkdown={parsedMarkdown}
                                className="w-full"
                            />
                        </CardContent>
                    </Card>

                    {/* Navigation */}
                    {(metadata.prev || metadata.next) && (
                        <div className="mt-6 flex justify-between">
                            {metadata.prev && (
                                <Button variant="outline" asChild>
                                    <Link href={`/lms/${metadata.prev}`}>
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Previous
                                    </Link>
                                </Button>
                            )}

                            {metadata.next && (
                                <Button variant="outline" asChild>
                                    <Link href={`/lms/${metadata.next}`}>
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar - Table of Contents */}
                {tableOfContents.length > 0 && (
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Contents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <nav className="space-y-2">
                                    {tableOfContents.map((heading) => (
                                        <a
                                            key={heading.id}
                                            href={`#${heading.id}`}
                                            className={cn(
                                                "block text-left text-sm transition-colors hover:text-primary",
                                                "text-muted-foreground hover:text-foreground",
                                                heading.level === 3 && "ml-4",
                                                heading.level === 4 && "ml-8"
                                            )}
                                        >
                                            {heading.text}
                                        </a>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
