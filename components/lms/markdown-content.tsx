"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParsedMarkdown } from "@/lib/markdown-parser";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
    parsedMarkdown: ParsedMarkdown;
    currentPath: string;
    className?: string;
}

export function MarkdownContent({
    parsedMarkdown,
    currentPath: _currentPath,
    className
}: MarkdownContentProps) {
    const { metadata, htmlContent } = parsedMarkdown;

    // Generate table of contents from HTML content
    const tableOfContents = useMemo(() => {
        // Only run on client side
        if (typeof window === 'undefined') {
            return [];
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const headings = tempDiv.querySelectorAll('h2, h3, h4');

        return Array.from(headings).map((heading, index) => ({
            id: `heading-${index}`,
            text: heading.textContent || '',
            level: parseInt(heading.tagName.charAt(1)),
        }));
    }, [htmlContent]);

    const scrollToHeading = (headingId: string) => {
        if (typeof window === 'undefined') {
            return;
        }

        const element = document.getElementById(headingId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={cn("max-w-4xl mx-auto ", className)}>
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
                        <CardContent >
                            <div
                                className="prose prose-lg max-w-none dark:prose-invert
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
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
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
                                    {tableOfContents.map((heading, _index) => (
                                        <button
                                            key={heading.id}
                                            className={cn(
                                                "block text-left text-sm transition-colors hover:text-primary",
                                                "text-muted-foreground hover:text-foreground",
                                                heading.level === 3 && "ml-4",
                                                heading.level === 4 && "ml-8"
                                            )}
                                            onClick={() => scrollToHeading(heading.id)}
                                        >
                                            {heading.text}
                                        </button>
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
