'use server';

import { revalidatePath } from 'next/cache';

import { Prisma } from '@prisma/client';
import { type Value } from 'platejs';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/auth/auth-utils';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import {
    handlePrismaError,
    type ServerActionResult,
} from '@/lib/utils/server-action-utils';

const updateDocumentSchema = z.object({
    id: z.string().cuid(),
    content: z.any(), // Plate.js Value type
    title: z.string().optional(),
    description: z.string().optional(),
    isPublished: z.boolean().optional(),
});

type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;

export async function updateDocument(
    input: UpdateDocumentInput
): Promise<ServerActionResult<{ id: string }>> {
    try {
        // Validate input
        const validatedInput = updateDocumentSchema.parse(input);

        // Get current user
        const user = await getCurrentUser();
        if (!user) {
            return {
                success: false,
                error: 'Authentication required',
            };
        }

        // Verify the document exists and user owns it
        const existingDocument = await prisma.document.findFirst({
            where: {
                id: validatedInput.id,
                authorId: user.id,
            },
            include: {
                author: true,
                project: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        if (!existingDocument) {
            return {
                success: false,
                error: 'Document not found or access denied',
            };
        }

        // Update the document
        const updatedDocument = await prisma.document.update({
            where: { id: validatedInput.id },
            data: {
                content: validatedInput.content as Prisma.InputJsonValue,
                title: validatedInput.title,
                description: validatedInput.description,
                isPublished: validatedInput.isPublished,
                version: existingDocument.version + 1,
                updatedAt: new Date(),
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                project: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        // Revalidate relevant pages
        if (existingDocument.projectId) {
            revalidatePath(`/projects/${existingDocument.projectId}`);
        }
        revalidatePath('/projects');

        logger.info('Document updated successfully', {
            action: 'update_document',
            resource: 'document',
            resourceId: updatedDocument.id,
            metadata: {
                userId: user.id,
                documentType: existingDocument.documentType,
                projectId: existingDocument.projectId,
                version: updatedDocument.version,
            },
        });

        return {
            success: true,
            data: { id: updatedDocument.id },
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: 'Invalid input data',
            };
        }

        return handlePrismaError(error);
    }
}
