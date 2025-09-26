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
    slug: string | null;
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
    slug?: string | null;
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

export async function getFolderTreeWithDocuments(userId: string): Promise<{
    items: Record<string, FolderTreeItem>;
    rootIds: string[];
}> {
    try {
        // Get all folders for the user
        const folders = await prisma.documentFolder.findMany({
            where: {
                ownerId: userId,
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
        folders.forEach((folder) => {
            const children: string[] = [];

            // Add child folders
            const childFolders = folders.filter(f => f.parentId === folder.id);
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
                documentCount: folderDocuments.length,
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
                author: document.author,
            };
        });

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

/**
 * Get LMS documents in folder (filtered by LMS document types)
 */
export async function getLMSDocumentsInFolder(
    folderId: string | null,
    userId: string,
    limit = 50,
    offset = 0
): Promise<DocumentWithAuthor[]> {
    try {
        const documents = await prisma.document.findMany({
            where: {
                // If folderId is null, show all LMS documents; otherwise filter by folder
                ...(folderId ? { folderId: folderId } : {}),
                isArchived: false,
                documentType: {
                    startsWith: 'lms_'
                },
                isPublished: true,
                slug: {
                    not: null
                },
            },
            select: {
                id: true,
                content: true,
                title: true,
                description: true,
                documentType: true,
                version: true,
                isPublished: true,
                isArchived: true,
                projectId: true,
                folderId: true,
                slug: true,
                createdAt: true,
                updatedAt: true,
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
                order: 'asc',
            },
            take: limit,
            skip: offset,
        });

        return documents as DocumentWithAuthor[];
    } catch (error) {
        logger.error('Failed to fetch LMS documents in folder', error instanceof Error ? error : new Error(String(error)), {
            action: 'get_lms_documents_in_folder',
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

/**
 * Get LMS folder tree with documents (filtered by LMS document types)
 */
export async function getLMSFolderTreeWithDocuments(userId: string): Promise<{
    items: Record<string, FolderTreeItem>;
    rootIds: string[];
}> {
    try {
        // Get all LMS documents first (not filtered by user since LMS content is shared)
        const documents = await prisma.document.findMany({
            where: {
                isArchived: false,
                documentType: {
                    startsWith: 'lms_'
                },
                isPublished: true,
                slug: {
                    not: null
                },
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
                order: 'asc',
            },
        });

        // Get folder IDs that contain LMS documents
        const lmsFolderIds = new Set<string>();
        documents.forEach(doc => {
            if (doc.folderId) {
                lmsFolderIds.add(doc.folderId);
            }
        });

        // Get all folders that contain LMS documents or are parents of such folders
        const allFolders = await prisma.documentFolder.findMany({
            where: {},
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' },
            ],
        });

        // Filter to only include folders that are part of the LMS content hierarchy
        const relevantFolderIds = new Set<string>();

        // Add folders that directly contain LMS documents
        lmsFolderIds.forEach(folderId => {
            relevantFolderIds.add(folderId);
        });

        // Add parent folders of LMS content folders
        const addParentFolders = (folderId: string) => {
            const folder = allFolders.find(f => f.id === folderId);
            if (folder && folder.parentId) {
                relevantFolderIds.add(folder.parentId);
                addParentFolders(folder.parentId); // Recursively add all parents
            }
        };

        lmsFolderIds.forEach(folderId => {
            addParentFolders(folderId);
        });

        // Get only the relevant folders
        const folders = allFolders.filter(folder => relevantFolderIds.has(folder.id));

        // Build the tree structure
        const items: Record<string, FolderTreeItem> = {};
        const rootIds: string[] = [];

        // First, add all folders to items
        folders.forEach((folder) => {
            items[folder.id] = {
                id: folder.id,
                name: folder.name,
                type: 'folder',
                color: folder.color,
                icon: folder.icon,
                documentCount: 0, // Will be calculated later
                children: [],
            };
        });

        // Then, build the parent-child relationships
        folders.forEach((folder) => {
            if (folder.parentId) {
                // This is a child folder
                const parent = items[folder.parentId];
                if (parent) {
                    parent.children!.push(folder.id);
                }
            } else {
                // This is a root folder
                rootIds.push(folder.id);
            }
        });

        // Create virtual folders for root documents based on their slugs
        const virtualFolders = new Map<string, string>(); // slug path -> virtual folder ID
        const virtualFolderItems: Record<string, FolderTreeItem> = {};

        // Process root documents and create virtual folders
        const rootDocuments = documents.filter(doc => !doc.folderId);
        rootDocuments.forEach((document) => {
            if (document.slug) {
                const slugParts = document.slug.split('/');
                if (slugParts.length > 1) {
                    // Document has a path structure, create virtual folders
                    let currentPath = '';
                    let parentFolderId = '';

                    for (let i = 0; i < slugParts.length - 1; i++) {
                        currentPath += (currentPath ? '/' : '') + slugParts[i];

                        if (!virtualFolders.has(currentPath)) {
                            const virtualFolderId = `virtual-${currentPath}`;
                            virtualFolders.set(currentPath, virtualFolderId);

                            virtualFolderItems[virtualFolderId] = {
                                id: virtualFolderId,
                                name: slugParts[i] ?? 'Untitled',
                                type: 'folder',
                                color: '#3B82F6',
                                icon: null,
                                documentCount: 0,
                                children: [],
                            };

                            // Add to parent folder
                            if (parentFolderId) {
                                const parentFolder = virtualFolderItems[parentFolderId];
                                if (parentFolder) {
                                    parentFolder.children!.push(virtualFolderId);
                                }
                            } else {
                                rootIds.push(virtualFolderId);
                            }
                        }

                        parentFolderId = virtualFolders.get(currentPath) || '';
                    }

                    // Add document to the deepest virtual folder
                    if (parentFolderId) {
                        const parentFolder = virtualFolderItems[parentFolderId];
                        if (parentFolder) {
                            parentFolder.children!.push(document.id);
                        }
                    }
                } else {
                    // Single-level document, add to root
                    rootIds.push(document.id);
                }
            }
        });

        // Add virtual folders to items
        Object.assign(items, virtualFolderItems);

        // Add LMS documents to their respective folders (both real and virtual)
        documents.forEach((document) => {
            // Add document to items
            items[document.id] = {
                id: document.id,
                name: document.title || 'Untitled Document',
                type: 'document',
                documentType: document.documentType,
                isPublished: document.isPublished,
                slug: document.slug,
                author: document.author,
            };

            // Add document to its folder's children
            if (document.folderId) {
                const folder = items[document.folderId];
                if (folder) {
                    folder.children!.push(document.id);
                }
            }
            // Root documents are handled above with virtual folders
        });

        // Calculate document counts for folders
        folders.forEach((folder) => {
            const folderItem = items[folder.id];
            if (folderItem) {
                // Count documents in this folder and all subfolders
                const countDocuments = (folderId: string): number => {
                    const folder = items[folderId];
                    if (!folder) return 0;

                    let count = 0;
                    if (folder.children) {
                        for (const childId of folder.children) {
                            const child = items[childId];
                            if (child?.type === 'document') {
                                count++;
                            } else if (child?.type === 'folder') {
                                count += countDocuments(childId);
                            }
                        }
                    }
                    return count;
                };

                folderItem.documentCount = countDocuments(folder.id);
            }
        });


        return { items, rootIds };
    } catch (error) {
        logger.error('Failed to fetch LMS folder tree with documents', error instanceof Error ? error : new Error(String(error)), {
            action: 'get_lms_folder_tree_with_documents',
            metadata: {
                userId,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
        });
        return { items: {}, rootIds: [] };
    }
}