import fs from "fs";
import path from "path";

import matter from "gray-matter";
import { BookOpen, Users, Briefcase, Settings } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { getMarkdownFilesByAccess } from "@/lib/markdown-parser";


const contentDirectory = path.join(process.cwd(), 'content');

interface ContentItem {
    path: string;
    title: string;
    navTitle: string;
    access: string;
    order: number;
    description?: string;
}

function getContentMetadata(filePath: string): ContentItem | null {
    try {
        const fullPath = path.join(contentDirectory, filePath);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
            path: filePath,
            title: data.title || 'Untitled',
            navTitle: data.navTitle || data.title || 'Untitled',
            access: data.access || 'public',
            order: data.order || 999,
            description: data.metaDescription,
        };
    } catch {
        return null;
    }
}

const getAccessIcon = (access: string) => {
    switch (access) {
        case 'web':
            return <BookOpen className="w-5 h-5" />;
        case 'data':
            return <Users className="w-5 h-5" />;
        case 'career':
            return <Briefcase className="w-5 h-5" />;
        case 'admin':
            return <Settings className="w-5 h-5" />;
        default:
            return <BookOpen className="w-5 h-5" />;
    }
};

const getAccessColor = (access: string) => {
    switch (access) {
        case 'web':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'data':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'career':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
        case 'admin':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
};

export default async function LMSPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    // Get user role for access control
    const user = session.user as any;
    const userRole = user.role || 'STUDENT';

    // Determine accessible content based on user role
    let accessibleContent: ContentItem[] = [];

    if (userRole === 'ADMIN') {
        // Admin can access everything
        const adminFiles = await Promise.all(
            ['web', 'data', 'career', 'admin'].map(async (access) => {
                const files = await getMarkdownFilesByAccess(access);
                return files.map(file => getContentMetadata(file)).filter((item): item is ContentItem => item !== null);
            })
        );
        accessibleContent = adminFiles.flat();
    } else if (userRole === 'MENTOR') {
        // Mentors can access web and data content
        const mentorFiles = await Promise.all(
            ['web', 'data', 'career'].map(async (access) => {
                const files = await getMarkdownFilesByAccess(access);
                return files.map(file => getContentMetadata(file)).filter((item): item is ContentItem => item !== null);
            })
        );
        accessibleContent = mentorFiles.flat();
    } else {
        // Students can access content based on their enrollment/role
        const studentFiles = await Promise.all(
            ['web', 'data', 'career'].map(async (access) => {
                const files = await getMarkdownFilesByAccess(access);
                return files.map(file => getContentMetadata(file)).filter((item): item is ContentItem => item !== null);
            })
        );
        accessibleContent = studentFiles.flat();
    }

    // Sort by order and filter out duplicates
    const uniqueContent = accessibleContent
        .filter((item, index, self) =>
            index === self.findIndex(t => t.path === item.path)
        )
        .sort((a, b) => a.order - b.order);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Learning Management System</h1>
                <p className="text-muted-foreground">
                    Access your courses, projects, and learning materials
                </p>
            </div>

            {uniqueContent.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">
                            No content available for your current access level.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uniqueContent.map((item) => (
                        <Card key={item.path} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">{item.navTitle}</CardTitle>
                                    <Badge className={getAccessColor(item.access)}>
                                        {item.access.toUpperCase()}
                                    </Badge>
                                </div>
                                {item.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                )}
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <Link href={`/lms/${item.path.replace('.md', '')}`}>
                                        {getAccessIcon(item.access)}
                                        <span className="ml-2">View Content</span>
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
