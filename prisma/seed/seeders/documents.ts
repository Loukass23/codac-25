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
    userId: string; // This is actually an email address in the JSON data
    parentId?: string;
    isEdited?: boolean;
}

export async function seedDocuments() {
    try {
        logger.info('📄 Starting documents seed...');

        // Load demo documents data
        const documentsData: DemoDocument[] = JSON.parse(
            fs.readFileSync(
                path.join(process.cwd(), 'prisma/seed/dev/demo-documents.json'),
                'utf-8'
            )
        );

        // Clean existing demo documents and folders
        logger.info('🧹 Cleaning existing demo documents and folders...');

        // First, delete documents (this will cascade to discussions and comments)
        await prisma.document.deleteMany({
            where: {
                title: {
                    in: documentsData.map(d => d.title),
                },
            },
        });

        // Get existing users to assign as document authors and clean folders
        const users = await prisma.user.findMany({
            where: {
                email: {
                    in: documentsData.map(d => d.authorEmail),
                },
            },
        });

        // Clean up existing folders for the user
        if (users.length > 0 && users[0]) {
            const userId = users[0].id;
            logger.info(`🧹 Cleaning existing folders for user: ${userId}`);

            // Delete all folders owned by the user
            await prisma.documentFolder.deleteMany({
                where: {
                    ownerId: userId,
                },
            });
        }

        // Create folder structure first
        logger.info('🌳 Creating folder structure...');
        const folders = await createFolderStructure(users[0]?.id);

        // Create documents
        logger.info('📄 Creating demo documents...');
        const createdDocuments = await Promise.all(
            documentsData.map(async documentData => {
                const user = users.find(u => u.email === documentData.authorEmail);
                if (!user) {
                    logger.warn(`User not found for email: ${documentData.authorEmail}`);
                    return null;
                }

                // Assign document to appropriate folder based on document type
                const folderId = assignDocumentToFolder(documentData.documentType, folders);

                const document = await prisma.document.create({
                    data: {
                        title: documentData.title,
                        description: documentData.description,
                        content: documentData.content,
                        documentType: documentData.documentType,
                        authorId: user.id,
                        isPublished: documentData.isPublished,
                        folderId: folderId,
                    },
                });

                // Create discussions for this document if they exist
                if (documentData.discussions && documentData.discussions.length > 0) {
                    logger.info(`💬 Creating ${documentData.discussions.length} discussions for document: ${document.title}`);

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
                                const commentAuthor = users.find(u => u.email === commentData.userId);
                                if (!commentAuthor) {
                                    logger.warn(`Comment author not found for email: ${commentData.userId}`);
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
                } else {
                    logger.info(`📄 No discussions found for document: ${document.title}`);
                }

                return document;
            })
        );

        // Filter out null results
        const validDocuments = createdDocuments.filter(d => d !== null);

        // Count total discussions and comments created
        const totalDiscussions = documentsData.reduce((sum, doc) => sum + (doc.discussions?.length ?? 0), 0);
        const totalComments = documentsData.reduce((sum, doc) =>
            sum + (doc.discussions?.reduce((discSum, disc) => discSum + (disc.comments?.length ?? 0), 0) ?? 0), 0
        );

        logger.info(
            `✅ Successfully created ${validDocuments.length} demo documents with ${totalDiscussions} discussions and ${totalComments} comments`
        );

        console.log('\n🎉 Demo documents seeded successfully!');
        console.log('═══════════════════════════════════════');
        console.log(`📊 Created ${validDocuments.length} documents:`);
        validDocuments.forEach(document => {
            console.log(`  • ${document?.title} (${document?.documentType})`);
        });
        console.log(`💬 Created ${totalDiscussions} discussions with ${totalComments} comments`);
        console.log(`🌳 Created folder structure with organized documents`);

    } catch (error) {
        const errorMessage =
            error instanceof Error ? error : new Error(String(error));
        logger.error('❌ Documents seeding failed:', errorMessage);
        throw errorMessage;
    }
}

export async function cleanDocuments() {
    try {
        logger.info('🧹 Cleaning demo documents and folders...');

        // Load document titles to clean
        const documentsData: DemoDocument[] = JSON.parse(
            fs.readFileSync(
                path.join(process.cwd(), 'prisma/seed/data/demo-documents.json'),
                'utf-8'
            )
        );

        // Get users to clean their folders
        const users = await prisma.user.findMany({
            where: {
                email: {
                    in: documentsData.map(d => d.authorEmail),
                },
            },
        });

        // Delete documents (this will cascade to discussions and comments)
        await prisma.document.deleteMany({
            where: {
                title: {
                    in: documentsData.map(d => d.title),
                },
            },
        });

        // Clean up folders for all users
        if (users.length > 0) {
            logger.info(`🧹 Cleaning folders for ${users.length} users...`);

            for (const user of users) {
                await prisma.documentFolder.deleteMany({
                    where: {
                        ownerId: user.id,
                    },
                });
            }
        }

        logger.info('✅ Demo documents and folders cleaned successfully');
        console.log('🧹 Demo documents and folders cleaned successfully!');
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error : new Error(String(error));
        logger.error('❌ Documents and folders cleanup failed:', errorMessage);
        throw errorMessage;
    }
}

async function createFolderStructure(userId: string | undefined) {
    if (!userId) {
        logger.warn('No user found for folder creation');
        return {};
    }

    logger.info('🌳 Creating document folder structure...');

    // Create root-level folders
    const workFolder = await prisma.documentFolder.create({
        data: {
            name: 'Work Projects',
            description: 'All work-related documents and project files',
            color: '#3B82F6',
            icon: 'folder',
            ownerId: userId,
            sortOrder: 1,
        },
    });

    const personalFolder = await prisma.documentFolder.create({
        data: {
            name: 'Personal',
            description: 'Personal documents and notes',
            color: '#10B981',
            icon: 'folder',
            ownerId: userId,
            sortOrder: 2,
        },
    });

    const learningFolder = await prisma.documentFolder.create({
        data: {
            name: 'Learning Resources',
            description: 'Educational materials and study notes',
            color: '#8B5CF6',
            icon: 'folder',
            ownerId: userId,
            sortOrder: 3,
        },
    });

    const archiveFolder = await prisma.documentFolder.create({
        data: {
            name: 'Archive',
            description: 'Old and completed documents',
            color: '#6B7280',
            icon: 'folder',
            ownerId: userId,
            sortOrder: 4,
        },
    });

    // Create subfolders under Work Projects
    const frontendFolder = await prisma.documentFolder.create({
        data: {
            name: 'Frontend Development',
            description: 'React, Next.js, and UI components',
            color: '#F59E0B',
            icon: 'folder',
            parentId: workFolder.id,
            ownerId: userId,
            sortOrder: 1,
        },
    });

    const backendFolder = await prisma.documentFolder.create({
        data: {
            name: 'Backend Development',
            description: 'API, database, and server-side code',
            color: '#EF4444',
            icon: 'folder',
            parentId: workFolder.id,
            ownerId: userId,
            sortOrder: 2,
        },
    });

    const docsFolder = await prisma.documentFolder.create({
        data: {
            name: 'Documentation',
            description: 'Project documentation and specifications',
            color: '#06B6D4',
            icon: 'folder',
            parentId: workFolder.id,
            ownerId: userId,
            sortOrder: 3,
        },
    });

    // Create subfolders under Learning Resources
    const tutorialsFolder = await prisma.documentFolder.create({
        data: {
            name: 'Tutorials',
            description: 'Step-by-step learning guides',
            color: '#EC4899',
            icon: 'folder',
            parentId: learningFolder.id,
            ownerId: userId,
            sortOrder: 1,
        },
    });

    const notesFolder = await prisma.documentFolder.create({
        data: {
            name: 'Study Notes',
            description: 'Personal notes and summaries',
            color: '#84CC16',
            icon: 'folder',
            parentId: learningFolder.id,
            ownerId: userId,
            sortOrder: 2,
        },
    });

    // Create subfolders under Personal
    const ideasFolder = await prisma.documentFolder.create({
        data: {
            name: 'Ideas & Concepts',
            description: 'Random ideas and concept exploration',
            color: '#F97316',
            icon: 'folder',
            parentId: personalFolder.id,
            ownerId: userId,
            sortOrder: 1,
        },
    });

    const journalFolder = await prisma.documentFolder.create({
        data: {
            name: 'Journal',
            description: 'Daily thoughts and reflections',
            color: '#A855F7',
            icon: 'folder',
            parentId: personalFolder.id,
            ownerId: userId,
            sortOrder: 2,
        },
    });

    // Create a deep nested structure under Frontend Development
    const reactFolder = await prisma.documentFolder.create({
        data: {
            name: 'React Components',
            description: 'Reusable React components and hooks',
            color: '#61DAFB',
            icon: 'folder-open',
            parentId: frontendFolder.id,
            ownerId: userId,
            sortOrder: 1,
        },
    });

    const nextjsFolder = await prisma.documentFolder.create({
        data: {
            name: 'Next.js Projects',
            description: 'Next.js applications and configurations',
            color: '#000000',
            icon: 'folder',
            parentId: frontendFolder.id,
            ownerId: userId,
            sortOrder: 2,
        },
    });

    // Create another level under React Components
    const hooksFolder = await prisma.documentFolder.create({
        data: {
            name: 'Custom Hooks',
            description: 'Custom React hooks and utilities',
            color: '#4F46E5',
            icon: 'folder',
            parentId: reactFolder.id,
            ownerId: userId,
            sortOrder: 1,
        },
    });

    const componentsFolder = await prisma.documentFolder.create({
        data: {
            name: 'UI Components',
            description: 'Button, Input, Modal, and other UI components',
            color: '#059669',
            icon: 'folder',
            parentId: reactFolder.id,
            ownerId: userId,
            sortOrder: 2,
        },
    });

    logger.info('✅ Document folder structure created successfully');

    return {
        workFolder,
        personalFolder,
        learningFolder,
        archiveFolder,
        frontendFolder,
        backendFolder,
        docsFolder,
        tutorialsFolder,
        notesFolder,
        ideasFolder,
        journalFolder,
        reactFolder,
        nextjsFolder,
        hooksFolder,
        componentsFolder,
    };
}

function assignDocumentToFolder(documentType: string, folders: Record<string, any>): string | null {
    // Assign documents to folders based on their type
    switch (documentType) {
        case 'lesson_content':
            // Randomly assign to learning-related folders
            const learningFolders = [folders['learningFolder']?.id, folders['tutorialsFolder']?.id, folders['notesFolder']?.id].filter(Boolean);
            return learningFolders[Math.floor(Math.random() * learningFolders.length)] || null;

        case 'project_summary':
            // Assign to work-related folders
            const workFolders = [folders['workFolder']?.id, folders['docsFolder']?.id, folders['frontendFolder']?.id, folders['backendFolder']?.id].filter(Boolean);
            return workFolders[Math.floor(Math.random() * workFolders.length)] || null;

        case 'community_post':
            // Assign to personal folders
            const personalFolders = [folders['personalFolder']?.id, folders['ideasFolder']?.id, folders['journalFolder']?.id].filter(Boolean);
            return personalFolders[Math.floor(Math.random() * personalFolders.length)] || null;

        case 'technical_documentation':
            // Assign to technical folders
            const techFolders = [folders['docsFolder']?.id, folders['frontendFolder']?.id, folders['backendFolder']?.id, folders['reactFolder']?.id, folders['hooksFolder']?.id, folders['componentsFolder']?.id].filter(Boolean);
            return techFolders[Math.floor(Math.random() * techFolders.length)] || null;

        default:
            // Default to work folder or null
            return folders['workFolder']?.id || null;
    }
}
