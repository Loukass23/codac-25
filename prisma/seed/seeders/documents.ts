import fs from 'fs';
import path from 'path';

import { PrismaClient } from '@prisma/client';

import { logger } from '../../../lib/logger';

const prisma = new PrismaClient();

interface DemoDocument {
    title: string;
    description: string;
    content: any; // Plate.js content
    documentType: string;
    authorEmail: string;
    isPublished: boolean;
    discussions?: DemoDocumentDiscussion[];
}

interface DemoDocumentDiscussion {
    id: string;
    isResolved: boolean;
    documentContent?: string;
    authorEmail: string;
    comments: DemoDocumentComment[];
}

interface DemoDocumentComment {
    contentRich: any; // Plate.js content - matches TComment.contentRich
    authorEmail: string;
    parentId?: string;
    isEdited?: boolean;
}

export async function seedDocuments() {
    try {
        logger.info('📄 Starting documents seed...');

        // Load demo documents data
        const documentsData: DemoDocument[] = JSON.parse(
            fs.readFileSync(
                path.join(process.cwd(), 'prisma/seed/data/demo-documents.json'),
                'utf-8'
            )
        );

        // Clean existing demo documents
        logger.info('🧹 Cleaning existing demo documents...');
        await prisma.document.deleteMany({
            where: {
                title: {
                    in: documentsData.map(d => d.title),
                },
            },
        });

        // Get existing users to assign as document authors
        const users = await prisma.user.findMany({
            where: {
                email: {
                    in: documentsData.map(d => d.authorEmail),
                },
            },
        });

        // Create documents
        logger.info('📄 Creating demo documents...');
        const createdDocuments = await Promise.all(
            documentsData.map(async documentData => {
                const user = users.find(u => u.email === documentData.authorEmail);
                if (!user) {
                    logger.warn(`User not found for email: ${documentData.authorEmail}`);
                    return null;
                }

                const document = await prisma.document.create({
                    data: {
                        title: documentData.title,
                        description: documentData.description,
                        content: documentData.content,
                        documentType: documentData.documentType,
                        authorId: user.id,
                        isPublished: documentData.isPublished,
                    },
                });

                // Create discussions for this document if they exist
                if (documentData.discussions && documentData.discussions.length > 0) {
                    logger.info(`💬 Creating discussions for document: ${document.title}`);

                    for (const discussionData of documentData.discussions) {
                        const discussionAuthor = users.find(u => u.email === discussionData.authorEmail);
                        if (!discussionAuthor) {
                            logger.warn(`Discussion author not found for email: ${discussionData.authorEmail}`);
                            continue;
                        }

                        // Create the discussion first
                        const discussion = await prisma.documentDiscussion.create({
                            data: {
                                id: discussionData.id,
                                isResolved: discussionData.isResolved,
                                documentContent: discussionData.documentContent ?? null,
                                documentId: document.id,
                                userId: discussionAuthor.id,
                            },
                        });

                        // Create comments for this discussion
                        if (discussionData.comments && discussionData.comments.length > 0) {
                            logger.info(`💬 Creating ${discussionData.comments.length} comments for discussion: ${discussion.id}`);

                            for (const commentData of discussionData.comments) {
                                const commentAuthor = users.find(u => u.email === commentData.authorEmail);
                                if (!commentAuthor) {
                                    logger.warn(`Comment author not found for email: ${commentData.authorEmail}`);
                                    continue;
                                }

                                await prisma.documentComment.create({
                                    data: {
                                        contentRich: commentData.contentRich,
                                        discussionId: discussion.id,
                                        userId: commentAuthor.id,
                                        parentId: commentData.parentId ?? null,
                                        isEdited: commentData.isEdited ?? false,
                                    },
                                });
                            }
                        }
                    }
                }

                return document;
            })
        );

        // Filter out null results
        const validDocuments = createdDocuments.filter(d => d !== null);

        logger.info(
            `✅ Successfully created ${validDocuments.length} demo documents`
        );

        console.log('\n🎉 Demo documents seeded successfully!');
        console.log('═══════════════════════════════════════');
        console.log(`📊 Created ${validDocuments.length} documents:`);
        validDocuments.forEach(document => {
            console.log(`  • ${document?.title} (${document?.documentType})`);
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error : new Error(String(error));
        logger.error('❌ Documents seeding failed:', errorMessage);
        throw errorMessage;
    }
}

export async function cleanDocuments() {
    try {
        logger.info('🧹 Cleaning demo documents...');

        // Load document titles to clean
        const documentsData: DemoDocument[] = JSON.parse(
            fs.readFileSync(
                path.join(process.cwd(), 'prisma/seed/data/demo-documents.json'),
                'utf-8'
            )
        );

        // Delete documents (this will cascade to discussions and comments)
        await prisma.document.deleteMany({
            where: {
                title: {
                    in: documentsData.map(d => d.title),
                },
            },
        });

        logger.info('✅ Demo documents cleaned successfully');
        console.log('🧹 Demo documents cleaned successfully!');
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error : new Error(String(error));
        logger.error('❌ Documents cleanup failed:', errorMessage);
        throw errorMessage;
    }
}
