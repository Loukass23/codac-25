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

const resolveDocumentDiscussionSchema = z.object({
    discussionId: z.string(),
    documentId: z.string(),
});

type ResolveDocumentDiscussionInput = z.infer<typeof resolveDocumentDiscussionSchema>;

export async function resolveDocumentDiscussion(
    input: ResolveDocumentDiscussionInput
): Promise<ServerActionResult<{ success: boolean }>> {
    try {
        // Validate input
        const validatedInput = resolveDocumentDiscussionSchema.parse(input);

        // Get current user
        const user = await getCurrentUser();
        if (!user) {
            return {
                success: false,
                error: 'Authentication required',
            };
        }

        // Verify the discussion exists and user has access
        const discussion = await prisma.documentComment.findFirst({
            where: {
                discussionId: validatedInput.discussionId,
            },
            include: {
                user: true,
                discussion: {
                    include: {
                        document: {
                            include: {
                                project: {
                                    select: {
                                        id: true,
                                        projectProfile: {
                                            select: {
                                                userId: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!discussion) {
            return {
                success: false,
                error: 'Discussion not found',
            };
        }

        // Check if user owns the discussion or has access to the document
        let hasAccess = discussion.userId === user.id;

        if (!hasAccess) {
            // Check if user owns the document
            hasAccess = discussion.discussion.document.authorId === user.id;

            // Check if user owns the project (for project-related documents)
            if (!hasAccess && discussion.discussion.document.projectId) {
                hasAccess = discussion.discussion.document.project?.projectProfile?.userId === user.id;
            }
        }

        if (!hasAccess) {
            return {
                success: false,
                error: 'Access denied',
            };
        }

        // Mark the discussion as resolved
        await prisma.documentDiscussion.update({
            where: {
                id: validatedInput.discussionId,
            },
            data: {
                isResolved: true,
                updatedAt: new Date(),
            },
        });

        // Revalidate relevant pages
        if (discussion.discussion.document.projectId) {
            revalidatePath(`/projects/${discussion.discussion.document.projectId}`);
        }
        revalidatePath('/projects');

        logger.info('Document discussion resolved successfully', {
            action: 'resolve_document_discussion',
            resource: 'document_comment',
            metadata: {
                userId: user.id,
                discussionId: validatedInput.discussionId,
                documentType: discussion.discussion.document.documentType,
                documentId: validatedInput.documentId,
                projectId: discussion.discussion.document.projectId,
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

        return {
            success: false,
            error: error instanceof Prisma.PrismaClientKnownRequestError
                ? handlePrismaError(error)
                : 'An unexpected error occurred',
        };
    }
}
