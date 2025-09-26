import { Calendar } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

export function DocumentPreviewSkeleton() {
    return (
        <div className="h-full flex flex-col">
            {/* Document Header Skeleton */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
            </div>

            {/* Document Content Skeleton */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6">
                    {/* Document Metadata Skeleton */}
                    <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-6 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-3 w-3 rounded-full" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    </div>

                    {/* Document Content Skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />

                        <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                            <div className="text-center space-y-2">
                                <Skeleton className="h-6 w-32 mx-auto" />
                                <Skeleton className="h-4 w-48 mx-auto" />
                                <Skeleton className="h-4 w-24 mx-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
