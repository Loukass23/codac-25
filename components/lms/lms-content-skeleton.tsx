import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LMSContentSkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Header Skeleton */}
            <div className="mb-6">
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content Skeleton */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardContent className="p-6">
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
                        </CardContent>
                    </Card>

                    {/* Navigation buttons skeleton */}
                    <div className="mt-6 flex justify-between">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-16" />
                    </div>
                </div>

                {/* Sidebar - Table of Contents Skeleton */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <Skeleton className="h-6 w-20" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        className={`h-4 ${index > 1 ? 'ml-4' : ''} ${index > 3 ? 'ml-8' : ''}`}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
