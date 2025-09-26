#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLMSFolders() {
    try {
        console.log('Checking LMS folders and documents...');

        // Get LMS documents
        const lmsDocuments = await prisma.document.findMany({
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
            select: {
                id: true,
                title: true,
                folderId: true,
                documentType: true,
            }
        });

        console.log(`Found ${lmsDocuments.length} LMS documents:`);

        const documentsInFolders = lmsDocuments.filter(doc => doc.folderId);
        const documentsInRoot = lmsDocuments.filter(doc => !doc.folderId);

        console.log(`- Documents in folders: ${documentsInFolders.length}`);
        console.log(`- Documents in root: ${documentsInRoot.length}`);

        // Get folder IDs that contain LMS documents
        const lmsFolderIds = new Set<string>();
        documentsInFolders.forEach(doc => {
            if (doc.folderId) {
                lmsFolderIds.add(doc.folderId);
            }
        });

        console.log(`\nFolders containing LMS documents: ${lmsFolderIds.size}`);

        // Get all folders
        const allFolders = await prisma.documentFolder.findMany({
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' },
            ],
        });

        console.log(`\nAll folders in system: ${allFolders.length}`);

        // Show which folders contain LMS documents
        for (const folderId of lmsFolderIds) {
            const folder = allFolders.find(f => f.id === folderId);
            if (folder) {
                const docsInFolder = documentsInFolders.filter(doc => doc.folderId === folderId);
                console.log(`- ${folder.name} (${docsInFolder.length} documents)`);
            }
        }

        // Show root documents
        if (documentsInRoot.length > 0) {
            console.log(`\nRoot documents (${documentsInRoot.length}):`);
            documentsInRoot.slice(0, 10).forEach(doc => {
                console.log(`- ${doc.title} (${doc.documentType})`);
            });
            if (documentsInRoot.length > 10) {
                console.log(`... and ${documentsInRoot.length - 10} more`);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkLMSFolders();
