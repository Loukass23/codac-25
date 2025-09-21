import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import remarkMath from 'remark-math';

export interface MarkdownMetadata {
    navTitle?: string;
    title: string;
    metaTitle: string;
    metaDescription?: string;
    access: 'web' | 'data' | 'all' | 'admin' | 'public';
    order?: number;
    next?: string;
    prev?: string;
}

export interface ParsedMarkdown {
    metadata: MarkdownMetadata;
    content: string;
    htmlContent: string;
}

const contentDirectory = path.join(process.cwd(), 'content');

export async function parseMarkdownFile(filePath: string): Promise<ParsedMarkdown> {
    const fullPath = path.join(contentDirectory, filePath);

    if (!fs.existsSync(fullPath)) {
        throw new Error(`Markdown file not found: ${filePath}`);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Process markdown to HTML
    const processedContent = await remark()
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkHtml, { sanitize: false })
        .process(content);

    // Replace staticAsset references with proper asset URLs
    const htmlWithAssets = processedContent.toString().replace(
        /staticAsset\//g,
        '/lms/assets/'
    );

    return {
        metadata: data as MarkdownMetadata,
        content,
        htmlContent: htmlWithAssets,
    };
}

export function getAllMarkdownFiles(): string[] {
    const files: string[] = [];

    function scanDirectory(dir: string, basePath = ''): void {
        const fullDir = path.join(contentDirectory, basePath);

        if (!fs.existsSync(fullDir)) {
            return;
        }

        const items = fs.readdirSync(fullDir);

        for (const item of items) {
            const itemPath = path.join(fullDir, item);
            const relativePath = path.join(basePath, item);
            const stat = fs.statSync(itemPath);

            if (stat.isDirectory()) {
                scanDirectory(dir, relativePath);
            } else if (item.endsWith('.md')) {
                files.push(relativePath.replace(/\\/g, '/'));
            }
        }
    }

    scanDirectory(contentDirectory);
    return files.sort();
}

export function getMarkdownFilesByAccess(access: string): string[] {
    const allFiles = getAllMarkdownFiles();
    const accessibleFiles: string[] = [];

    for (const file of allFiles) {
        try {
            const fullPath = path.join(contentDirectory, file);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            const metadata = data as MarkdownMetadata;

            // Check access permissions
            if (metadata.access === 'all' ||
                metadata.access === 'public' ||
                metadata.access === access) {
                accessibleFiles.push(file);
            }
        } catch (error) {
            console.error(`Error reading file ${file}:`, error);
        }
    }

    return accessibleFiles.sort((a, b) => {
        // Sort by order if available, otherwise alphabetically
        try {
            const aPath = path.join(contentDirectory, a);
            const bPath = path.join(contentDirectory, b);
            const aContents = fs.readFileSync(aPath, 'utf8');
            const bContents = fs.readFileSync(bPath, 'utf8');
            const aData = matter(aContents).data as MarkdownMetadata;
            const bData = matter(bContents).data as MarkdownMetadata;

            const aOrder = aData.order || 999;
            const bOrder = bData.order || 999;

            return aOrder - bOrder;
        } catch {
            return a.localeCompare(b);
        }
    });
}
