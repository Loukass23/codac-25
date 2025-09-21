"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParsedMarkdown } from "@/lib/markdown-parser";
import { cn } from "@/lib/utils/utils";

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
        <div className={cn("max-w-4xl mx-auto p-2", className)}>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-primary mb-4 mt-6 border-b-2 border-gray-200 dark:border-gray-700 pb-3">
                    {metadata.title}
                </h1>
                {metadata.metaDescription && (
                    <p className="text-lg my-4 leading-relaxed text-gray-700 dark:text-gray-300">
                        {metadata.metaDescription}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardContent >
                            <div
                                className="prose prose-lg max-w-none dark:prose-invert
                  prose-headings:scroll-mt-20
                  prose-a:text-blue-600 dark:prose-a:text-blue-400
                  prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-lg prose-img:shadow-lg
                  prose-img:max-w-full prose-img:h-auto
                  [&_h1]:!text-4xl [&_h1]:!font-bold [&_h1]:!text-gray-900 [&_h1]:dark:!text-gray-100 [&_h1]:!mb-4 [&_h1]:!mt-6 [&_h1]:!border-b-2 [&_h1]:!border-gray-200 [&_h1]:dark:!border-gray-700 [&_h1]:!pb-3
                  [&_h2]:!text-3xl [&_h2]:!font-bold [&_h2]:!text-gray-900 [&_h2]:dark:!text-gray-100 [&_h2]:!mb-4 [&_h2]:!mt-6 [&_h2]:!border-b [&_h2]:!border-gray-200 [&_h2]:dark:!border-gray-700 [&_h2]:!pb-2
                  [&_h3]:!text-2xl [&_h3]:!font-bold [&_h3]:!text-gray-900 [&_h3]:dark:!text-gray-100 [&_h3]:!mb-4 [&_h3]:!mt-6
                  [&_h4]:!text-xl [&_h4]:!font-bold [&_h4]:!text-gray-900 [&_h4]:dark:!text-gray-100 [&_h4]:!mb-4 [&_h4]:!mt-6
                  [&_h5]:!text-lg [&_h5]:!font-bold [&_h5]:!text-gray-900 [&_h5]:dark:!text-gray-100 [&_h5]:!mb-4 [&_h5]:!mt-6
                  [&_h6]:!text-base [&_h6]:!font-bold [&_h6]:!text-gray-900 [&_h6]:dark:!text-gray-100 [&_h6]:!mb-4 [&_h6]:!mt-6
                  [&_p]:!my-4 [&_p]:!leading-relaxed [&_p]:!text-gray-700 [&_p]:dark:!text-gray-300
                  [&_code]:!bg-gray-100 [&_code]:dark:!bg-gray-800 [&_code]:!text-gray-800 [&_code]:dark:!text-gray-200 [&_code]:!px-1.5 [&_code]:!py-0.5 [&_code]:!rounded [&_code]:!text-sm [&_code]:!font-mono
                  [&_pre]:!bg-gray-900 [&_pre]:dark:!bg-gray-800 [&_pre]:!rounded-lg [&_pre]:!overflow-hidden [&_pre]:!my-6
                  [&_pre_code]:!block [&_pre_code]:!p-4 [&_pre_code]:!text-sm [&_pre_code]:!font-mono [&_pre_code]:!text-gray-100 [&_pre_code]:!overflow-x-auto
                  [&_blockquote]:!border-l-4 [&_blockquote]:!border-blue-500 [&_blockquote]:!bg-blue-50 [&_blockquote]:dark:!bg-blue-900/20 [&_blockquote]:!pl-4 [&_blockquote]:!py-2 [&_blockquote]:!my-4 [&_blockquote]:!italic [&_blockquote]:!text-gray-700 [&_blockquote]:dark:!text-gray-300
                  [&_table]:!w-full [&_table]:!border-collapse [&_table]:!border [&_table]:!border-gray-300 [&_table]:dark:!border-gray-600 [&_table]:!my-6
                  [&_th]:!border [&_th]:!border-gray-300 [&_th]:dark:!border-gray-600 [&_th]:!bg-gray-100 [&_th]:dark:!bg-gray-800 [&_th]:!px-4 [&_th]:!py-2 [&_th]:!text-left [&_th]:!font-semibold
                  [&_td]:!border [&_td]:!border-gray-300 [&_td]:dark:!border-gray-600 [&_td]:!px-4 [&_td]:!py-2
                  [&_ul]:!list-disc [&_ul]:!list-inside [&_ul]:!my-4 [&_ul]:!space-y-2
                  [&_ol]:!list-decimal [&_ol]:!list-inside [&_ol]:!my-4 [&_ol]:!space-y-2"
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
                                <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">Contents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <nav className="space-y-2">
                                    {tableOfContents.map((heading, _index) => (
                                        <button
                                            key={heading.id}
                                            className={cn(
                                                "block text-left text-sm transition-colors",
                                                "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
                                                "hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 py-1",
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
