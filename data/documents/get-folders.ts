'use server';

import type { DocumentWithAuthor } from '@/data/projects/get-documents';
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

export async function getUserFolders(userId: string): Promise<DocumentFolderWithChildren[]> {
    try {
        // Get all folders for the user
        const folders = await prisma.documentFolder.findMany({
            where: {
                ownerId: userId,
            },
            include: {
                documents: {
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' },
            ],
        });

        // Get document counts for each folder
        const folderDocumentCounts = await prisma.document.groupBy({
            by: ['folderId'],
            where: {
                authorId: userId,
                isArchived: false,
            },
            _count: {
                folderId: true,
            },
        });

        const documentCountMap = new Map<string, number>();
        documentCountMap.set('', 0); // Root folder count

        folderDocumentCounts.forEach((count) => {
            documentCountMap.set(count.folderId ?? '', count._count.folderId);
        });

        // Build the folder tree
        const folderMap = new Map<string, DocumentFolderWithChildren>();
        const rootFolders: DocumentFolderWithChildren[] = [];

        // First pass: create all folder objects
        folders.forEach((folder) => {
            const folderWithChildren: DocumentFolderWithChildren = {
                id: folder.id,
                name: folder.name,
                description: folder.description,
                color: folder.color,
                icon: folder.icon,
                parentId: folder.parentId,
                sortOrder: folder.sortOrder,
                createdAt: folder.createdAt,
                updatedAt: folder.updatedAt,
                children: [],
                documentCount: documentCountMap.get(folder.id) ?? 0,
            };
            folderMap.set(folder.id, folderWithChildren);
        });

        // Second pass: build the tree structure
        folders.forEach((folder) => {
            const folderWithChildren = folderMap.get(folder.id)!;

            if (folder.parentId) {
                const parent = folderMap.get(folder.parentId);
                if (parent) {
                    parent.children.push(folderWithChildren);
                }
            } else {
                rootFolders.push(folderWithChildren);
            }
        });

        return rootFolders;
    } catch (error) {
        logger.error('Failed to fetch user folders', error instanceof Error ? error : new Error(String(error)), {
            action: 'get_user_folders',
            metadata: {
                userId,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
        });
        return [];
    }
}

export async function getFolderById(folderId: string, userId: string): Promise<DocumentFolderWithChildren | null> {
    try {
        const folder = await prisma.documentFolder.findFirst({
            where: {
                id: folderId,
                ownerId: userId,
            },
        });

        if (!folder) {
            return null;
        }

        // Get document count for this folder
        const documentCount = await prisma.document.count({
            where: {
                folderId: folderId,
                authorId: userId,
                isArchived: false,
            },
        });

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
            documentCount,
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
