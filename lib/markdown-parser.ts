import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import { rehype } from 'rehype';
import rehypeSlug from 'rehype-slug';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHeadingId from 'remark-heading-id';
import remarkHtml from 'remark-html';
import remarkMath from 'remark-math';
// import remarkPrism from 'remark-prism'; // Temporarily disabled due to file descriptor issues

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

/**
 * Enhances markdown HTML with better styling classes and structure
 */
function enhanceMarkdownHtml(html: string): string {
    let enhanced = html;

    // Enhance headings with better classes and structure
    enhanced = enhanced.replace(
        /<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/g,
        (_, level, attributes, content) => {
            const levelNum = parseInt(level);
            const baseClasses = 'font-bold text-gray-900 dark:text-gray-100 mb-4 mt-6';
            const levelClasses = {
                1: 'text-4xl border-b-2 border-gray-200 dark:border-gray-700 pb-3',
                2: 'text-3xl border-b border-gray-200 dark:border-gray-700 pb-2',
                3: 'text-2xl',
                4: 'text-xl',
                5: 'text-lg',
                6: 'text-base'
            };

            const classes = `${baseClasses} ${levelClasses[levelNum as keyof typeof levelClasses] || levelClasses[6]}`;

            return `<h${level}${attributes} class="${classes}">${content}</h${level}>`;
        }
    );

    // Enhance code blocks with better styling
    enhanced = enhanced.replace(
        /<pre([^>]*)><code([^>]*)>(.*?)<\/code><\/pre>/gs,
        (_, preAttrs, codeAttrs, content) => {
            const hasLanguage = codeAttrs.includes('class=');
            const wrapperClasses = 'bg-gray-900 dark:bg-gray-800 rounded-lg overflow-hidden my-6';
            const codeClasses = hasLanguage
                ? 'block p-4 text-sm font-mono text-gray-100 overflow-x-auto'
                : 'block p-4 text-sm font-mono text-gray-100 overflow-x-auto';

            return `<div class="${wrapperClasses}"><pre${preAttrs}><code${codeAttrs} class="${codeClasses}">${content}</code></pre></div>`;
        }
    );

    // Enhance inline code with better styling
    enhanced = enhanced.replace(
        /<code([^>]*)>(.*?)<\/code>/g,
        (match, attrs, content) => {
            // Skip if it's already inside a pre block
            if (match.includes('<pre>') || match.includes('</pre>')) {
                return match;
            }

            const classes = 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono';
            return `<code${attrs} class="${classes}">${content}</code>`;
        }
    );

    // Enhance blockquotes
    enhanced = enhanced.replace(
        /<blockquote([^>]*)>(.*?)<\/blockquote>/gs,
        (_, attrs, content) => {
            const classes = 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300';
            return `<blockquote${attrs} class="${classes}">${content}</blockquote>`;
        }
    );

    // Enhance tables
    enhanced = enhanced.replace(
        /<table([^>]*)>(.*?)<\/table>/gs,
        (_, attrs, content) => {
            const classes = 'w-full border-collapse border border-gray-300 dark:border-gray-600 my-6';
            return `<div class="overflow-x-auto"><table${attrs} class="${classes}">${content}</table></div>`;
        }
    );

    // Enhance table headers
    enhanced = enhanced.replace(
        /<th([^>]*)>(.*?)<\/th>/g,
        (_, attrs, content) => {
            const classes = 'border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold';
            return `<th${attrs} class="${classes}">${content}</th>`;
        }
    );

    // Enhance table cells
    enhanced = enhanced.replace(
        /<td([^>]*)>(.*?)<\/td>/g,
        (_, attrs, content) => {
            const classes = 'border border-gray-300 dark:border-gray-600 px-4 py-2';
            return `<td${attrs} class="${classes}">${content}</td>`;
        }
    );

    // Enhance lists
    enhanced = enhanced.replace(
        /<ul([^>]*)>(.*?)<\/ul>/gs,
        (_, attrs, content) => {
            const classes = 'list-disc list-inside my-4 space-y-2';
            return `<ul${attrs} class="${classes}">${content}</ul>`;
        }
    );

    enhanced = enhanced.replace(
        /<ol([^>]*)>(.*?)<\/ol>/gs,
        (_, attrs, content) => {
            const classes = 'list-decimal list-inside my-4 space-y-2';
            return `<ol${attrs} class="${classes}">${content}</ol>`;
        }
    );

    // Enhance paragraphs
    enhanced = enhanced.replace(
        /<p([^>]*)>(.*?)<\/p>/g,
        (_, attrs, content) => {
            const classes = 'my-4 leading-relaxed text-gray-700 dark:text-gray-300';
            return `<p${attrs} class="${classes}">${content}</p>`;
        }
    );

    return enhanced;
}

export async function parseMarkdownFile(filePath: string): Promise<ParsedMarkdown> {
    const fullPath = path.join(contentDirectory, filePath);

    if (!fs.existsSync(fullPath)) {
        throw new Error(`Markdown file not found: ${filePath}`);
    }

    // Use async file reading to avoid file descriptor issues
    let fileContents: string;
    try {
        fileContents = await fs.promises.readFile(fullPath, 'utf8');
    } catch {
        // Fallback to sync if async fails
        fileContents = fs.readFileSync(fullPath, 'utf8');
    }

    const { data, content } = matter(fileContents);

    // Process markdown to HTML with enhanced features
    // Remove remark-prism temporarily to avoid file descriptor issues
    const processedContent = await remark()
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkHeadingId, { defaults: true }) // Add custom heading IDs
        .use(remarkHtml, { sanitize: false })
        .process(content);

    // Process HTML with rehype plugins for additional enhancements
    const finalHtml = await rehype()
        .use(rehypeSlug) // Add slug IDs to headings
        .process(processedContent);

    // Replace staticAsset references with proper asset URLs
    let htmlWithAssets = finalHtml.toString().replace(
        /staticAsset\//g,
        '/lms/assets/'
    );

    // Enhance HTML with better styling classes
    htmlWithAssets = enhanceMarkdownHtml(htmlWithAssets);

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

export async function getMarkdownFilesByAccess(access: string): Promise<string[]> {
    const allFiles = getAllMarkdownFiles();
    const accessibleFiles: string[] = [];

    for (const file of allFiles) {
        try {
            const fullPath = path.join(contentDirectory, file);
            let fileContents: string;
            try {
                fileContents = await fs.promises.readFile(fullPath, 'utf8');
            } catch {
                fileContents = fs.readFileSync(fullPath, 'utf8');
            }
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

    // Sort files by order if available, otherwise alphabetically
    const sortedFiles = await Promise.all(
        accessibleFiles.map(async (file) => {
            try {
                const filePath = path.join(contentDirectory, file);
                let fileContents: string;
                try {
                    fileContents = await fs.promises.readFile(filePath, 'utf8');
                } catch {
                    fileContents = fs.readFileSync(filePath, 'utf8');
                }
                const { data } = matter(fileContents);
                const metadata = data as MarkdownMetadata;
                return { file, order: metadata.order || 999 };
            } catch {
                return { file, order: 999 };
            }
        })
    );

    return sortedFiles
        .sort((a, b) => a.order - b.order)
        .map(item => item.file);
}
