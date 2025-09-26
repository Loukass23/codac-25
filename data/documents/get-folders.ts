'use server';

import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

export interface DocumentFolderWithChildren {
    id: string;
    name: string;
    description: string | null;
    color: string;
    icon: string | null;
    parentId: string | null;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    children: DocumentFolderWithChildren[];
    documentCount: number;
}

export interface DocumentWithAuthor {
    id: string;
    content: any; // Plate.js Value type
    title: string | null;
    description: string | null;
    documentType: string;
    version: number;
    isPublished: boolean;
    isArchived: boolean;
    projectId: string | null;
    folderId: string | null;
    createdAt: Date;
    updatedAt: Date;
    author: {
        id: string;
        name: string | null;
        avatar: string | null;
    };
    project?: {
        id: string;
        title: string;
    } | null;
    folder?: {
        id: string;
        name: string;
        color: string;
    } | null;
}

export interface FolderTreeItem {
    id: string;
    name: string;
    type: 'folder' | 'document';
    color?: string;
    icon?: string | null;
    documentCount?: number;
    children?: string[];
    documentType?: string;
    isPublished?: boolean;
    slug?: string;
    author?: {
        id: string;
        name: string | null;
        avatar: string | null;
    };
}



export async function getFolderById(folderId: string, userId: string): Promise<DocumentFolderWithChildren | null> {
    try {
        const folder = await prisma.documentFolder.findFirst({
            where: {
                id: folderId,
                ownerId: userId,
            },
            include: {
                _count: {
                    select: {
                        documents: {
                            where: {
                                isArchived: false,
                            },
                        },
                    },
                },
            },
        });

        if (!folder) {
            return null;
        }

        return {
            id: folder.id,
            name: folder.name,
            description: folder.description,
            color: folder.color,
            icon: folder.icon,
            parentId: folder.parentId,
            sortOrder: folder.sortOrder,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
            children: [], // This function doesn't populate children
            documentCount: folder._count.documents,
        };
    } catch (error) {
        logger.error('Failed to fetch folder by ID', error instanceof Error ? error : new Error(String(error)), {
            action: 'get_folder_by_id',
            metadata: {
                folderId,
                userId,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
        });
        return null;
    }
}

export async function getDocumentsInFolder(
    folderId: string | null,
    userId: string,
    limit = 50,
    offset = 0
): Promise<DocumentWithAuthor[]> {
    try {
        const documents = await prisma.document.findMany({
            where: {
                // If folderId is null, show all documents; otherwise filter by folder
                ...(folderId ? { folderId: folderId } : {}),
                authorId: userId,
                isArchived: false,
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
                folder: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
            skip: offset,
        });

        return documents as DocumentWithAuthor[];
    } catch (error) {
        logger.error('Failed to fetch documents in folder', error instanceof Error ? error : new Error(String(error)), {
            action: 'get_documents_in_folder',
            metadata: {
                folderId,
                userId,
                limit,
                offset,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
        });
        return [];
    }
}

export async function getDocumentById(documentId: string, userId: string): Promise<DocumentWithAuthor | null> {
    try {
        const document = await prisma.document.findFirst({
            where: {
                id: documentId,
                authorId: userId,
                isArchived: false,
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
                folder: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                    },
                },
            },
        });

        return document as DocumentWithAuthor | null;
    } catch (error) {
        logger.error('Failed to fetch document by ID', error instanceof Error ? error : new Error(String(error)), {
            action: 'get_document_by_id',
            metadata: {
                documentId,
                userId,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
        });
        return null;
    }
}

export async function getFolderTreeWithDocuments(userId: string): Promise<{
    items: Record<string, FolderTreeItem>;
    rootIds: string[];
}> {
    try {
        // Get all folders for the user with document counts using aggregation
        const foldersWithCounts = await prisma.documentFolder.findMany({
            where: {
                ownerId: userId,
            },
            include: {
                _count: {
                    select: {
                        documents: {
                            where: {
                                isArchived: false,
                            },
                        },
                    },
                },
            },
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' },
            ],
        });

        // Get all documents for the user
        const documents = await prisma.document.findMany({
            where: {
                authorId: userId,
                isArchived: false,
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
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Build the tree structure
        const items: Record<string, FolderTreeItem> = {};
        const rootIds: string[] = [];

        // Add folders to items
        foldersWithCounts.forEach((folder) => {
            const children: string[] = [];

            // Add child folders
            const childFolders = foldersWithCounts.filter(f => f.parentId === folder.id);
            childFolders.forEach(child => children.push(child.id));

            // Add documents in this folder
            const folderDocuments = documents.filter(d => d.folderId === folder.id);
            folderDocuments.forEach(doc => children.push(doc.id));

            items[folder.id] = {
                id: folder.id,
                name: folder.name,
                type: 'folder',
                color: folder.color,
                icon: folder.icon,
                documentCount: folder._count.documents,
                children: children.length > 0 ? children : undefined,
            };

            if (!folder.parentId) {
                rootIds.push(folder.id);
            }
        });

        // Add documents to items
        documents.forEach((document) => {
            items[document.id] = {
                id: document.id,
                name: document.title || 'Untitled Document',
                type: 'document',
                documentType: document.documentType,
                isPublished: document.isPublished,
                slug: document.slug || undefined,
                author: document.author,
            };
        });

        // Add documents without parent folders to rootIds
        const orphanedDocuments = documents.filter(doc => !doc.folderId);
        orphanedDocuments.forEach(doc => rootIds.push(doc.id));

        return { items, rootIds };
    } catch (error) {
        logger.error('Failed to fetch folder tree with documents', error instanceof Error ? error : new Error(String(error)), {
            action: 'get_folder_tree_with_documents',
            metadata: {
                userId,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
        });
        return { items: {}, rootIds: [] };
    }
}
