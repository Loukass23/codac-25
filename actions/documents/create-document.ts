'use server';

import { requireServerAuth } from '@/lib/auth/auth-server';
import { prisma } from '@/lib/db/prisma';
import { logger } from '@/lib/logger';
import { ServerActionResult } from '@/types/server-action';
import { z } from 'zod';

const CreateDocumentSchema = z.object({
    title: z.string().min(1, 'Document title is required').max(200, 'Title too long'),
    description: z.string().max(500, 'Description too long').optional(),
    documentType: z.string().min(1, 'Document type is required').max(50, 'Document type too long'),
    folderId: z.string().optional(),
    content: z.any().optional(), // Plate.js content - can be any JSON structure
    isPublished: z.boolean().default(false),
    // LMS-specific fields
    navTitle: z.string().max(100, 'Navigation title too long').optional(),
    metaTitle: z.string().max(200, 'Meta title too long').optional(),
    metaDescription: z.string().max(300, 'Meta description too long').optional(),
    access: z.enum(['public', 'all', 'web', 'data', 'admin']).optional(),
    order: z.number().int().min(0).optional(),
    slug: z.string().max(100, 'Slug too long').optional(),
});

type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>;

export async function createDocument(
    input: CreateDocumentInput
): Promise<ServerActionResult<{ id: string; title: string }>> {
    try {
        const user = await requireServerAuth();
        const validatedInput = CreateDocumentSchema.parse(input);

        // Check if folder exists and belongs to user (if provided)
        if (validatedInput.folderId) {
            const folder = await prisma.documentFolder.findFirst({
                where: {
                    id: validatedInput.folderId,
                    ownerId: user.id,
                },
            });

            if (!folder) {
                return {
                    success: false,
                    error: 'Folder not found or access denied',
                };
            }
        }

        // Generate slug if not provided
        let slug = validatedInput.slug;
        if (!slug && validatedInput.title) {
            slug = validatedInput.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
        }

        // Ensure slug is unique
        if (slug) {
            let uniqueSlug = slug;
            let counter = 1;
            while (await prisma.document.findFirst({ where: { slug: uniqueSlug } })) {
                uniqueSlug = `${slug}-${counter}`;
                counter++;
            }
            slug = uniqueSlug;
        }

        // Create the document
        const document = await prisma.document.create({
            data: {
                title: validatedInput.title,
                description: validatedInput.description,
                documentType: validatedInput.documentType,
                content: validatedInput.content || [],
                isPublished: validatedInput.isPublished,
                navTitle: validatedInput.navTitle,
                metaTitle: validatedInput.metaTitle,
                metaDescription: validatedInput.metaDescription,
                access: validatedInput.access,
                order: validatedInput.order,
                slug: slug,
                authorId: user.id,
                folderId: validatedInput.folderId || null,
            },
        });

        logger.info('Document created successfully', {
            action: 'create_document',
            metadata: {
                documentId: document.id,
                userId: user.id,
                title: document.title,
                documentType: document.documentType,
                folderId: document.folderId,
            },
        });

        return {
            success: true,
            data: {
                id: document.id,
                title: document.title || 'Untitled Document',
            },
        };
    } catch (error) {
        logger.error('Failed to create document', error instanceof Error ? error : new Error(String(error)), {
            action: 'create_document',
            metadata: {
                input,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
        });

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: 'Invalid input data',
            };
        }

        return {
            success: false,
            error: 'Failed to create document',
        };
    }
}
