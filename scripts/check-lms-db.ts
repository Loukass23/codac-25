#!/usr/bin/env tsx

import { prisma } from '../lib/db/prisma';

async function checkLMSDatabase() {
    console.log('🔍 Checking LMS documents in database...');

    const documents = await prisma.document.findMany({
        where: {
            documentType: {
                startsWith: 'lms_'
            }
        },
        select: {
            slug: true,
            title: true,
            folderId: true,
            documentType: true
        },
        orderBy: {
            slug: 'asc'
        }
    });

    console.log(`📊 Found ${documents.length} LMS documents:`);

    // Group by folder
    const byFolder: Record<string, any[]> = {};
    documents.forEach(doc => {
        const folder = doc.folderId || 'root';
        if (!byFolder[folder]) {
            byFolder[folder] = [];
        }
        byFolder[folder].push(doc);
    });

    Object.entries(byFolder).forEach(([folder, docs]) => {
        console.log(`\n📁 Folder: ${folder} (${docs.length} documents)`);
        docs.forEach(doc => {
            console.log(`  - ${doc.slug}: ${doc.title}`);
        });
    });

    // Check for data content
    const dataDocs = documents.filter(doc => doc.slug?.startsWith('data/'));
    console.log(`\n🔍 Data documents (${dataDocs.length}):`);
    dataDocs.forEach(doc => {
        console.log(`  - ${doc.slug}: ${doc.title}`);
    });

    await prisma.$disconnect();
}

checkLMSDatabase().catch(console.error);
