import { TElement, TText } from 'platejs';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHeadingId from 'remark-heading-id';
import remarkHtml from 'remark-html';
import remarkMath from 'remark-math';
import { unified } from 'unified';

import { logger } from '@/lib/logger';

/**
 * Converts markdown content to Plate.js value format for static rendering
 */
export async function convertMarkdownToPlateValue(markdownContent: string): Promise<TElement[]> {
    try {
        if (!markdownContent || typeof markdownContent !== 'string') {
            logger.warn('Invalid markdown content provided to converter', {
                action: 'convert_markdown_to_plate',
                metadata: { contentLength: markdownContent?.length || 0 }
            });
            return [{ type: 'p', children: [{ text: 'Invalid content' }] }];
        }

        // Process markdown to HTML first
        const processedContent = await remark()
            .use(remarkGfm)
            .use(remarkMath)
            .use(remarkHeadingId, { defaults: true })
            .use(remarkHtml, { sanitize: false })
            .process(markdownContent);

        // Convert HTML to Plate.js value format
        const plateValue = await convertHtmlToPlateValue(processedContent.toString());

        logger.debug('Successfully converted markdown to Plate.js value', {
            action: 'convert_markdown_to_plate',
            metadata: {
                contentLength: markdownContent.length,
                plateValueLength: plateValue.length
            }
        });

        return plateValue;
    } catch (error) {
        logger.error('Failed to convert markdown to Plate.js value',
            error instanceof Error ? error : new Error(String(error)),
            {
                action: 'convert_markdown_to_plate',
                metadata: { contentLength: markdownContent?.length || 0 }
            }
        );

        // Return a fallback element
        return [{ type: 'p', children: [{ text: 'Error loading content' }] }];
    }
}

/**
 * Converts HTML string to Plate.js value format
 */
async function convertHtmlToPlateValue(html: string): Promise<TElement[]> {
    // Parse HTML to AST
    const processor = unified()
        .use(rehypeParse, { fragment: true })
        .use(rehypeStringify);

    const ast = processor.parse(html);

    // Convert AST to Plate.js value
    const plateValue = convertAstToPlateValue(ast);

    return plateValue;
}

/**
 * Converts HTML AST to Plate.js value format
 */
function convertAstToPlateValue(node: any): TElement[] {
    if (!node.children) {
        return [];
    }

    const result: TElement[] = [];

    for (const child of node.children) {
        const plateNode = convertNodeToPlate(child);
        if (plateNode) {
            result.push(plateNode);
        }
    }

    return result;
}

/**
 * Converts a single HTML node to Plate.js node
 */
function convertNodeToPlate(node: any): TElement | null {
    if (node.type === 'text') {
        return {
            type: 'p',
            children: [{ text: node.value }],
        };
    }

    if (node.type === 'element') {
        const tagName = node.tagName.toLowerCase();

        switch (tagName) {
            case 'h1':
                return {
                    type: 'h1',
                    children: convertChildrenToPlate(node.children),
                };
            case 'h2':
                return {
                    type: 'h2',
                    children: convertChildrenToPlate(node.children),
                };
            case 'h3':
                return {
                    type: 'h3',
                    children: convertChildrenToPlate(node.children),
                };
            case 'h4':
                return {
                    type: 'h4',
                    children: convertChildrenToPlate(node.children),
                };
            case 'h5':
                return {
                    type: 'h5',
                    children: convertChildrenToPlate(node.children),
                };
            case 'h6':
                return {
                    type: 'h6',
                    children: convertChildrenToPlate(node.children),
                };
            case 'p':
                return {
                    type: 'p',
                    children: convertChildrenToPlate(node.children),
                };
            case 'blockquote':
                return {
                    type: 'blockquote',
                    children: convertChildrenToPlate(node.children),
                };
            case 'ul':
                return {
                    type: 'ul',
                    children: convertChildrenToPlate(node.children),
                };
            case 'ol':
                return {
                    type: 'ol',
                    children: convertChildrenToPlate(node.children),
                };
            case 'li':
                return {
                    type: 'li',
                    children: convertChildrenToPlate(node.children),
                };
            case 'pre':
                // Handle code blocks
                const codeElement = node.children.find((child: any) => child.tagName === 'code');
                if (codeElement) {
                    const language = codeElement.properties?.className?.[0]?.replace('language-', '') || '';
                    return {
                        type: 'code_block',
                        lang: language,
                        children: [{ text: codeElement.children[0]?.value || '' }],
                    };
                }
                break;
            case 'code':
                // Inline code
                return {
                    type: 'inline_code',
                    children: [{ text: node.children[0]?.value || '' }],
                };
            case 'a':
                return {
                    type: 'a',
                    url: node.properties?.href || '',
                    children: convertChildrenToPlate(node.children),
                };
            case 'strong':
            case 'b':
                return {
                    type: 'bold',
                    children: convertChildrenToPlate(node.children),
                };
            case 'em':
            case 'i':
                return {
                    type: 'italic',
                    children: convertChildrenToPlate(node.children),
                };
            case 'table':
                return {
                    type: 'table',
                    children: convertChildrenToPlate(node.children),
                };
            case 'thead':
                return {
                    type: 'thead',
                    children: convertChildrenToPlate(node.children),
                };
            case 'tbody':
                return {
                    type: 'tbody',
                    children: convertChildrenToPlate(node.children),
                };
            case 'tr':
                return {
                    type: 'tr',
                    children: convertChildrenToPlate(node.children),
                };
            case 'th':
                return {
                    type: 'th',
                    children: convertChildrenToPlate(node.children),
                };
            case 'td':
                return {
                    type: 'td',
                    children: convertChildrenToPlate(node.children),
                };
            case 'hr':
                return {
                    type: 'hr',
                    children: [{ text: '' }],
                };
            case 'img':
                return {
                    type: 'img',
                    url: node.properties?.src || '',
                    alt: node.properties?.alt || '',
                    children: [{ text: '' }],
                };
            default:
                // For unknown elements, try to convert children
                if (node.children && node.children.length > 0) {
                    return {
                        type: 'p',
                        children: convertChildrenToPlate(node.children),
                    };
                }
                break;
        }
    }

    return null;
}

/**
 * Converts children nodes to Plate.js format
 */
function convertChildrenToPlate(children: any[]): (TElement | TText)[] {
    if (!children) return [{ text: '' }];

    const result: (TElement | TText)[] = [];

    for (const child of children) {
        if (child.type === 'text') {
            result.push({ text: child.value });
        } else {
            const plateNode = convertNodeToPlate(child);
            if (plateNode) {
                result.push(plateNode);
            }
        }
    }

    return result.length > 0 ? result : [{ text: '' }];
}

