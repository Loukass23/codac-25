"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";

export function LMSSkeleton() {
    return (
        <div className="h-[calc(100vh-4rem)]">
            <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Left Panel - Navigation Skeleton */}
                <ResizablePanel
                    defaultSize={20}
                    minSize={15}
                    maxSize={40}
                    className="border-r bg-background"
                >
                    <div className="h-full overflow-y-auto">
                        <div className="p-3">
                            <Skeleton className="h-6 w-32 mb-4" />
                            <div className="space-y-2">
                                {/* Navigation Groups */}
                                {Array.from({ length: 4 }).map((_, groupIndex) => (
                                    <div key={groupIndex} className="space-y-1">
                                        {/* Group Header */}
                                        <div className="flex items-center gap-2 px-3 py-2">
                                            <Skeleton className="w-3 h-3" />
                                            <Skeleton className="w-4 h-4" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>

                                        {/* Group Items */}
                                        {Array.from({ length: 3 }).map((_, itemIndex) => (
                                            <div key={itemIndex} className="space-y-1">
                                                <div className="flex items-center gap-2 px-3 py-2 ml-4">
                                                    <Skeleton className="w-3 h-3" />
                                                    <Skeleton className="h-4 w-20" />
                                                </div>

                                                {/* Sub-items */}
                                                {Array.from({ length: 2 }).map((_, subIndex) => (
                                                    <div key={subIndex} className="flex items-center gap-2 px-3 py-2 ml-8">
                                                        <Skeleton className="w-3 h-3" />
                                                        <Skeleton className="h-4 w-16" />
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Panel - Content Skeleton */}
                <ResizablePanel defaultSize={75} minSize={60}>
                    <div className="h-full overflow-y-auto p-4">
                        <div className="max-w-4xl mx-auto">
                            {/* Header Skeleton */}
                            <div className="mb-6">
                                <Skeleton className="h-10 w-3/4 mb-2" />
                                <Skeleton className="h-5 w-1/2" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {/* Main Content Skeleton */}
                                <div className="lg:col-span-3">
                                    <div className="bg-card border rounded-lg p-6">
                                        <div className="space-y-4">
                                            {/* Paragraphs */}
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <div key={index} className="space-y-2">
                                                    <Skeleton className="h-4 w-full" />
                                                    <Skeleton className="h-4 w-5/6" />
                                                    <Skeleton className="h-4 w-4/5" />
                                                </div>
                                            ))}

                                            {/* Code block */}
                                            <div className="bg-muted rounded-lg p-4">
                                                <Skeleton className="h-4 w-3/4 mb-2" />
                                                <Skeleton className="h-4 w-1/2" />
                                            </div>

                                            {/* More paragraphs */}
                                            {Array.from({ length: 3 }).map((_, index) => (
                                                <div key={index} className="space-y-2">
                                                    <Skeleton className="h-4 w-full" />
                                                    <Skeleton className="h-4 w-4/5" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Navigation buttons skeleton */}
                                    <div className="mt-6 flex justify-between">
                                        <Skeleton className="h-10 w-24" />
                                        <Skeleton className="h-10 w-16" />
                                    </div>
                                </div>

                                {/* Sidebar - Table of Contents Skeleton */}
                                <div className="lg:col-span-1">
                                    <div className="bg-card border rounded-lg p-4 sticky top-6">
                                        <Skeleton className="h-6 w-20 mb-4" />
                                        <div className="space-y-2">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <Skeleton
                                                    key={index}
                                                    className={`h-4 ${index > 1 ? 'ml-4' : ''} ${index > 3 ? 'ml-8' : ''}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
