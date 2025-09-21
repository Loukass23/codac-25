import { BookOpen, Home, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LMSNotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-2xl">Content Not Found</CardTitle>
                    <CardDescription className="text-base">
                        The learning content you&apos;re looking for doesn&apos;t exist or may have been moved.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button asChild className="flex-1">
                            <Link href="/lms">
                                <Search className="w-4 h-4 mr-2" />
                                Browse Content
                            </Link>
                        </Button>

                        <Button asChild variant="outline" className="flex-1">
                            <Link href="/">
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </Link>
                        </Button>
                    </div>

                    <div className="pt-2">
                        <Button asChild variant="ghost" size="sm" className="w-full">
                            <Link href="/lms" className="flex items-center justify-center">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to LMS
                            </Link>
                        </Button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                        If you believe this content should be available, please check your access permissions or contact support.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
