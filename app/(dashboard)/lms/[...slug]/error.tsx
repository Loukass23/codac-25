"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { logger } from "@/lib/logger";

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function LMSErrorPage({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        // Log the error to our logging service
        logger.error('LMS Content Error', error, {
            action: 'lms_content_error',
            metadata: {
                digest: error.digest,
                stack: error.stack,
            }
        });
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                    </div>
                    <CardTitle>Content Loading Error</CardTitle>
                    <CardDescription>
                        We encountered an error while loading the content. This might be due to a temporary issue or connection problem.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={reset} className="flex-1">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                            className="flex-1"
                        >
                            Reload Page
                        </Button>
                    </div>

                    {process.env.NODE_ENV === 'development' && (
                        <details className="rounded-md bg-muted p-3">
                            <summary className="cursor-pointer font-medium text-sm">
                                Error Details (Development Mode)
                            </summary>
                            <div className="mt-2 space-y-2">
                                <div>
                                    <strong className="text-sm">Message:</strong>
                                    <pre className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">
                                        {error.message}
                                    </pre>
                                </div>
                                {error.digest && (
                                    <div>
                                        <strong className="text-sm">Digest:</strong>
                                        <pre className="text-xs text-muted-foreground mt-1">
                                            {error.digest}
                                        </pre>
                                    </div>
                                )}
                                {error.stack && (
                                    <div>
                                        <strong className="text-sm">Stack Trace:</strong>
                                        <pre className="text-xs text-muted-foreground mt-1 overflow-auto max-h-32 whitespace-pre-wrap">
                                            {error.stack}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </details>
                    )}

                    <p className="text-xs text-muted-foreground text-center mt-4">
                        If this problem continues, please contact support.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
