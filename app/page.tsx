import Link from "next/link";
import { redirect } from "next/navigation";

import CodacLogo, { CodacLandingLogo } from "@/components/codac-logo";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/auth-utils";

export default async function LandingPage() {
    // Check if user is authenticated and redirect to dashboard
    const user = await getCurrentUser();
    if (user) {
        redirect("/home");
    }
    return (
        <div
            className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20 isolate"

        >
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="w-full mx-auto px-4 py-4 flex items-center justify-between">
                    <CodacLogo
                        size="sm"

                    />
                    <div className="flex-1 text-left leading-tight group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden">
                        <span className="font-codac-brand text-2xl uppercase tracking-wider text-codac-pink">
                            codac
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" asChild>
                            <Link href="/auth/signin">Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/home">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="w-full h-full flex flex-col items-center justify-center">

                <div className="flex justify-center">
                    <CodacLandingLogo textClassName="text-primary" useGradient />
                </div>
            </div>
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-codac-pink/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-codac-teal/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
        </div>
    );
}
