import { redirect, notFound } from "next/navigation";

import { MarkdownContent } from "@/components/lms/markdown-content";
import { auth } from "@/lib/auth/auth";
import { parseMarkdownFile } from "@/lib/markdown-parser";


interface LMSContentPageProps {
    params: {
        slug: string[];
    };
}

export async function generateStaticParams() {
    // Generate static params for all markdown files
    const { getAllMarkdownFiles } = await import("@/lib/markdown-parser");
    const files = getAllMarkdownFiles();

    return files.map((file) => ({
        slug: file.replace('.md', '').split('/'),
    }));
}

export async function generateMetadata({ params }: LMSContentPageProps) {
    try {
        const filePath = params.slug.join('/') + '.md';
        const parsedMarkdown = await parseMarkdownFile(filePath);

        return {
            title: parsedMarkdown.metadata.metaTitle || parsedMarkdown.metadata.title,
            description: parsedMarkdown.metadata.metaDescription,
        };
    } catch {
        return {
            title: "Content Not Found",
        };
    }
}

export default async function LMSContentPage({ params }: LMSContentPageProps) {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    try {
        const filePath = params.slug.join('/') + '.md';
        const parsedMarkdown = await parseMarkdownFile(filePath);

        // Check access permissions
        const user = session.user;
        const userRole = user.role || 'STUDENT';
        const access = parsedMarkdown.metadata.access;

        // Admin can access everything
        if (userRole === 'ADMIN') {
            // Allow access
        } else if (access === 'public' || access === 'all') {
            // Allow access
        } else if (
            (access === 'web' || access === 'data') &&
            (userRole === 'STUDENT' || userRole === 'MENTOR')
        ) {
            // Students and mentors can access these
            // Allow access
        } else if (access === 'web' || access === 'data') {
            // Deny access for other roles
            redirect('/lms');
        } else if (access === 'admin') {
            // Only admin can access

        } else {
            // Default deny
            redirect('/lms');
        }

        return (
            <MarkdownContent
                parsedMarkdown={parsedMarkdown}
                currentPath={filePath}
            />
        );
    } catch (error) {
        console.error('Error loading content:', error);
        notFound();
    }
}
