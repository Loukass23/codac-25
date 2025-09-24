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

const deleteDocumentSchema = z.object({
    id: z.string().cuid(),
});

type DeleteDocumentInput = z.infer<typeof deleteDocumentSchema>;

export async function deleteDocument(
    input: DeleteDocumentInput
): Promise<ServerActionResult<{ success: boolean }>> {
    try {
        // Validate input
        const validatedInput = deleteDocumentSchema.parse(input);

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
                project: {
                    select: {
                        id: true,
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

        // Use transaction to handle related data
        await prisma.$transaction(async (tx) => {
            // Delete all document comments first
            await tx.documentComment.deleteMany({
                where: {
                    documentId: validatedInput.id,
                },
            });

            // If this document is linked to a project as a summary, unlink it
            if (existingDocument.projectId) {
                await tx.project.updateMany({
                    where: {
                        summaryDocumentId: validatedInput.id,
                    },
                    data: {
                        summaryDocumentId: null,
                    },
                });
            }

            // Delete the document
            await tx.document.delete({
                where: { id: validatedInput.id },
            });
        });

        // Revalidate relevant pages
        if (existingDocument.projectId) {
            revalidatePath(`/projects/${existingDocument.projectId}`);
        }
        revalidatePath('/projects');

        logger.info('Document deleted successfully', {
            action: 'delete_document',
            resource: 'document',
            resourceId: validatedInput.id,
            metadata: {
                userId: user.id,
                documentType: existingDocument.documentType,
                projectId: existingDocument.projectId,
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
