"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function LMSSkeleton() {
    return (
        <div className="h-[calc(100vh-4rem)]">

            <div className="h-full overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header Skeleton */}
                    <div className="mb-6">
                        <Skeleton className="h-10 w-3/4 mb-2" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>

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


                </div>
            </div>


        </div>
    );
}
