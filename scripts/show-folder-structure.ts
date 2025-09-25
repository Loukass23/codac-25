#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FolderWithChildren {
    id: string;
    name: string;
    color: string;
    parentId: string | null;
    children: FolderWithChildren[];
    documentCount: number;
}

async function showFolderStructure() {
    console.log('📁 Document Folder Structure\n');

    // Get all folders
    const folders = await prisma.documentFolder.findMany({
        include: {
            documents: {
                select: { id: true },
            },
        },
        orderBy: [
            { sortOrder: 'asc' },
            { createdAt: 'asc' },
        ],
    });

    // Build folder tree
    const folderMap = new Map<string, FolderWithChildren>();
    const rootFolders: FolderWithChildren[] = [];

    // Create folder objects
    folders.forEach((folder) => {
        const folderWithChildren: FolderWithChildren = {
            id: folder.id,
            name: folder.name,
            color: folder.color,
            parentId: folder.parentId,
            children: [],
            documentCount: folder.documents.length,
        };
        folderMap.set(folder.id, folderWithChildren);
    });

    // Build tree structure
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

    // Display tree
    function displayFolder(folder: FolderWithChildren, level = 0) {
        const indent = '  '.repeat(level);
        const icon = folder.children.length > 0 ? '📁' : '📄';
        const color = `\x1b[38;2;${parseInt(folder.color.slice(1, 3), 16)};${parseInt(folder.color.slice(3, 5), 16)};${parseInt(folder.color.slice(5, 7), 16)}m`;
        const reset = '\x1b[0m';

        console.log(`${indent}${icon} ${color}${folder.name}${reset} (${folder.documentCount} docs)`);

        folder.children.forEach(child => displayFolder(child, level + 1));
    }

    rootFolders.forEach(folder => displayFolder(folder));

    // Show document distribution
    console.log('\n📊 Document Distribution:');
    const totalDocuments = folders.reduce((sum, folder) => sum + folder.documents.length, 0);
    console.log(`Total documents in folders: ${totalDocuments}`);

    // Show documents without folders
    const documentsWithoutFolders = await prisma.document.count({
        where: {
            folderId: null,
            isArchived: false,
        },
    });
    console.log(`Documents without folders: ${documentsWithoutFolders}`);

    console.log(`\nTotal documents: ${totalDocuments + documentsWithoutFolders}`);
}

async function main() {
    try {
        await showFolderStructure();
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

if (require.main === module) {
    main();
}
