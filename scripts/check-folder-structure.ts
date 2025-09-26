#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkFolderStructure() {
    try {
        console.log('Checking folder structure...');

        // Get all folders
        const folders = await prisma.documentFolder.findMany({
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' },
            ],
        });

        console.log(`Found ${folders.length} folders:`);
        folders.forEach(folder => {
            console.log(`- ${folder.name} (ID: ${folder.id}) - Parent: ${folder.parentId || 'ROOT'}`);
        });

        // Check for nested structure
        const rootFolders = folders.filter(f => !f.parentId);
        console.log(`\nRoot folders: ${rootFolders.length}`);

        const nestedFolders = folders.filter(f => f.parentId);
        console.log(`Nested folders: ${nestedFolders.length}`);

        // Show nesting levels
        const nestingLevels = new Map<number, number>();
        folders.forEach(folder => {
            let level = 0;
            let current = folder;
            while (current.parentId) {
                level++;
                current = folders.find(f => f.id === current.parentId)!;
                if (!current) break;
            }
            nestingLevels.set(level, (nestingLevels.get(level) || 0) + 1);
        });

        console.log('\nNesting levels:');
        for (const [level, count] of nestingLevels) {
            console.log(`  Level ${level}: ${count} folders`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkFolderStructure();
