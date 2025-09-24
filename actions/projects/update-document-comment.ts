'use server';

import { revalidatePath } from 'next/cache';

import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/auth/auth-utils';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import {
    handlePrismaError,
    type ServerActionResult,
} from '@/lib/utils/server-action-utils';

const updateDocumentCommentSchema = z.object({
    id: z.string().cuid(),
    content: z.any(), // Plate.js Value type
});

type UpdateDocumentCommentInput = z.infer<typeof updateDocumentCommentSchema>;

export async function updateDocumentComment(
    input: UpdateDocumentCommentInput
): Promise<ServerActionResult<{ id: string }>> {
    try {
        // Validate input
        const validatedInput = updateDocumentCommentSchema.parse(input);

        // Get current user
        const user = await getCurrentUser();
        if (!user) {
            return {
                success: false,
                error: 'Authentication required',
            };
        }

        // Verify the comment exists and user owns it
        const existingComment = await prisma.documentComment.findFirst({
            where: {
                id: validatedInput.id,
                authorId: user.id,
            },
            include: {
                author: true,
            },
        });

        if (!existingComment) {
            return {
                success: false,
                error: 'Comment not found or access denied',
            };
        }

        // Update the comment
        const updatedComment = await prisma.documentComment.update({
            where: { id: validatedInput.id },
            data: {
                content: validatedInput.content as Prisma.InputJsonValue,
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
            },
        });

        // Revalidate relevant pages
        revalidatePath(`/projects/${existingComment.documentId}`);
        revalidatePath('/projects');

        logger.info('Document comment updated successfully', {
            action: 'update_document_comment',
            resource: 'document_comment',
            resourceId: updatedComment.id,
            metadata: {
                userId: user.id,
                documentType: existingComment.documentType,
                documentId: existingComment.documentId,
            },
        });

        return {
            success: true,
            data: { id: updatedComment.id },
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
