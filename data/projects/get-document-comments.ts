'use server';

import { Value } from 'platejs';

import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

export interface DocumentCommentWithAuthor {
    id: string;
    contentRich: Value; // Plate.js Value type (matches schema field name)
    discussionId: string;
    parentId: string | null;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
    discussion: {
        id: string;
        documentId: string;
        isResolved: boolean;
        documentContent: string | null;
    };
    user: {
        id: string;
        name: string | null;
        avatar: string | null;
    };
    replies: DocumentCommentWithAuthor[];
}

export async function getDocumentComments(
    documentId: string
): Promise<DocumentCommentWithAuthor[]> {
    try {
        const comments = await prisma.documentComment.findMany({
            where: {
                discussion: {
                    documentId: documentId,
                },
                parentId: null, // Only get top-level comments
            },
            include: {
                discussion: {
                    select: {
                        id: true,
                        documentId: true,
                        isResolved: true,
                        documentContent: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                replies: {
                    include: {
                        discussion: {
                            select: {
                                id: true,
                                documentId: true,
                                isResolved: true,
                                documentContent: true,
                            },
                        },
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return comments as any;
    } catch (error) {
        logger.error('Failed to fetch document comments', error instanceof Error ? error : undefined, {
            action: 'get_document_comments',
            metadata: {
                documentId,
            },
        });
        return [];
    }
}

export async function getDocumentCommentsByDiscussion(
    discussionId: string
): Promise<DocumentCommentWithAuthor[]> {
    try {
        const comments = await prisma.documentComment.findMany({
            where: {
                discussionId,
            },
            include: {
                discussion: {
                    select: {
                        id: true,
                        documentId: true,
                        isResolved: true,
                        documentContent: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                replies: {
                    include: {
                        discussion: {
                            select: {
                                id: true,
                                documentId: true,
                                isResolved: true,
                                documentContent: true,
                            },
                        },
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        return comments as any;
    } catch (error) {
        logger.error('Failed to fetch comments by discussion', error instanceof Error ? error : undefined, {
            action: 'get_document_comments_by_discussion',
            metadata: {
                discussionId,
            },
        });
        return [];
    }
}

export async function getDocumentCommentStats(
    documentId: string
): Promise<{
    totalComments: number;
    resolvedDiscussions: number;
    activeDiscussions: number;
}> {
    try {
        const [totalComments, resolvedDiscussions] = await Promise.all([
            prisma.documentComment.count({
                where: {
                    discussion: {
                        documentId: documentId,
                    },
                },
            }),
            prisma.documentDiscussion.count({
                where: {
                    documentId: documentId,
                    isResolved: true,
                },
            }),
        ]);

        const activeDiscussions = totalComments - resolvedDiscussions;

        return {
            totalComments,
            resolvedDiscussions,
            activeDiscussions,
        };
    } catch (error) {
        logger.error('Failed to fetch document comment stats', error instanceof Error ? error : undefined, {
            action: 'get_document_comment_stats',
            metadata: {
                documentId,
            },
        });
        return {
            totalComments: 0,
            resolvedDiscussions: 0,
            activeDiscussions: 0,
        };
    }
}
