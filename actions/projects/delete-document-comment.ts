'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { getCurrentUser } from '@/lib/auth/auth-utils';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import {
    handlePrismaError,
    type ServerActionResult,
} from '@/lib/utils/server-action-utils';

const deleteDocumentCommentSchema = z.object({
    id: z.string().cuid(),
});

type DeleteDocumentCommentInput = z.infer<typeof deleteDocumentCommentSchema>;

export async function deleteDocumentComment(
    input: DeleteDocumentCommentInput
): Promise<ServerActionResult<{ success: boolean }>> {
    try {
        // Validate input
        const validatedInput = deleteDocumentCommentSchema.parse(input);

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
        });

        if (!existingComment) {
            return {
                success: false,
                error: 'Comment not found or access denied',
            };
        }

        // Delete the comment and all its replies
        await prisma.documentComment.deleteMany({
            where: {
                OR: [
                    { id: validatedInput.id },
                    { parentId: validatedInput.id },
                ],
            },
        });

        // Revalidate relevant pages
        revalidatePath(`/projects/${existingComment.documentId}`);
        revalidatePath('/projects');

        logger.info('Document comment deleted successfully', {
            action: 'delete_document_comment',
            resource: 'document_comment',
            resourceId: validatedInput.id,
            metadata: {
                userId: user.id,
                documentType: existingComment.documentType,
                documentId: existingComment.documentId,
            },
        });

        return {
            success: true,
            data: { success: true },
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
