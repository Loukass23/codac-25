#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

import {
    enhancedMarkdownParser
} from '../lib/plate/enhanced-markdown-parser';
import { FolderStructureManager } from '../lib/plate/folder-structure-manager';

const prisma = new PrismaClient();

interface LMSDocumentData {
    slug: string;
    title: string;
    navTitle?: string;
    metaTitle?: string;
    metaDescription?: string;
    access: string;
    order: number;
    content: unknown; // Plate.js Value
    htmlContent: string;
    prev?: string;
    next?: string;
    documentType: string;
    folderId?: string;
    filePath: string;
    folderPath: string;
    folderName: string;
}

/**
 * Convert markdown files to LMS documents and seed the database with folder structure
 */
async function seedLMSContent() {
    console.log('🌱 Starting enhanced LMS content seeding...');

    try {
        // Initialize folder structure manager
        const folderManager = new FolderStructureManager(prisma);

        // Get all markdown files with folder structure
        const allFiles = enhancedMarkdownParser.getAllMarkdownFiles();
        console.log(`📁 Found ${allFiles.length} markdown files`);

        // Get LMS content structure organized by folders
        const structure = enhancedMarkdownParser.getLMSContentStructure();
        console.log('📚 LMS structure:', Object.keys(structure));

        // Find or create admin user for LMS content
        const adminUser = await findOrCreateAdminUser();

        // Create folder structure
        console.log('📂 Creating folder structure...');
        const folderMapping = await folderManager.createLMSFolderStructure(
            adminUser.id,
            structure
        );
        console.log('✅ Folder structure created:', Object.keys(folderMapping));

        // Process each markdown file
        const lmsDocuments: LMSDocumentData[] = [];

        for (const file of allFiles) {
            try {
                const parsed = await enhancedMarkdownParser.parseMarkdownFile(file.filePath);
                const slug = file.filePath.replace('.md', '');

                // Determine document type based on file path
                const documentType = determineDocumentType(file.filePath);

                // Determine access level
                const access = parsed.metadata.access || 'public';

                // Determine order
                const order = parsed.metadata.order || 0;

                // Get folder ID for this document
                const folderId = folderManager.getFolderIdForDocument(file.filePath, folderMapping) ?? undefined;

                const lmsDoc: LMSDocumentData = {
                    slug,
                    title: parsed.metadata.title || parsed.metadata.navTitle || slug,
                    navTitle: parsed.metadata.navTitle,
                    metaTitle: parsed.metadata.metaTitle,
                    metaDescription: parsed.metadata.metaDescription,
                    access,
                    order,
                    content: parsed.plateValue,
                    htmlContent: parsed.htmlContent,
                    prev: parsed.metadata.prev,
                    next: parsed.metadata.next,
                    documentType,
                    folderId,
                    filePath: file.filePath,
                    folderPath: file.folderPath,
                    folderName: file.folderName,
                };

                lmsDocuments.push(lmsDoc);
                console.log(`✅ Processed: ${file.filePath} -> ${lmsDoc.title} (folder: ${file.folderName})`);

            } catch (error) {
                console.error(`❌ Failed to process ${file.filePath}:`, error);
            }
        }

        // Sort documents by order within each folder
        lmsDocuments.sort((a, b) => {
            if (a.folderName !== b.folderName) {
                return a.folderName.localeCompare(b.folderName);
            }
            return a.order - b.order;
        });

        // Update navigation links
        updateNavigationLinks(lmsDocuments);

        // Seed documents to database
        await seedDocumentsToDatabase(lmsDocuments, adminUser.id);

        // Clean up empty folders
        await folderManager.cleanupEmptyFolders(adminUser.id);

        console.log('🎉 Enhanced LMS content seeding completed successfully!');

    } catch (error) {
        console.error('💥 Error during LMS content seeding:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * Determine document type based on file path
 */
function determineDocumentType(filePath: string): string {
    if (filePath.includes('career/')) return 'lms_career';
    if (filePath.includes('data/')) return 'lms_data';
    if (filePath.includes('web/')) return 'lms_web';
    if (filePath === 'welcome.md') return 'lms_welcome';
    if (filePath === 'guidelines.md') return 'lms_guidelines';
    return 'lms_content';
}

/**
 * Update navigation links between documents within the same folder
 */
function updateNavigationLinks(documents: LMSDocumentData[]): void {
    // Group documents by folder
    const documentsByFolder = new Map<string, LMSDocumentData[]>();

    for (const doc of documents) {
        const folderKey = doc.folderName || 'root';
        if (!documentsByFolder.has(folderKey)) {
            documentsByFolder.set(folderKey, []);
        }
        documentsByFolder.get(folderKey)!.push(doc);
    }

    // Update navigation links within each folder
    for (const [folderName, folderDocs] of documentsByFolder) {
        // Sort documents within folder by order
        folderDocs.sort((a, b) => a.order - b.order);

        for (let i = 0; i < folderDocs.length; i++) {
            const doc = folderDocs[i];
            if (!doc) continue;

            if (i > 0) {
                const prevDoc = folderDocs[i - 1];
                if (prevDoc) {
                    doc.prev = prevDoc.slug;
                }
            }

            if (i < folderDocs.length - 1) {
                const nextDoc = folderDocs[i + 1];
                if (nextDoc) {
                    doc.next = nextDoc.slug;
                }
            }
        }

        console.log(`🔗 Updated navigation links for folder: ${folderName} (${folderDocs.length} documents)`);
    }
}

/**
 * Find or create admin user for LMS content
 */
async function findOrCreateAdminUser() {
    let adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });

    if (!adminUser) {
        // Create a system admin user for LMS content
        adminUser = await prisma.user.create({
            data: {
                email: 'system@codac-berlin.com',
                name: 'System Admin',
                username: 'system-admin',
                role: 'ADMIN',
                status: 'ACTIVE',
                emailVerified: new Date(),
            }
        });
        console.log('👤 Created system admin user');
    }

    return adminUser;
}

/**
 * Seed documents to database with folder structure
 */
async function seedDocumentsToDatabase(documents: LMSDocumentData[], authorId: string) {
    console.log(`💾 Seeding ${documents.length} documents to database...`);

    // Clear existing LMS documents
    await prisma.document.deleteMany({
        where: {
            documentType: {
                startsWith: 'lms_'
            }
        }
    });

    console.log('🗑️ Cleared existing LMS documents');

    // Create documents in batches
    const batchSize = 10;
    for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);

        const createData = batch.map(doc => ({
            title: doc.title,
            description: doc.metaDescription,
            content: doc.content as any, // Cast to any for Prisma compatibility
            documentType: doc.documentType,
            authorId,
            navTitle: doc.navTitle,
            metaTitle: doc.metaTitle,
            metaDescription: doc.metaDescription,
            access: doc.access,
            order: doc.order,
            prev: doc.prev,
            next: doc.next,
            slug: doc.slug,
            folderId: doc.folderId,
            isPublished: true,
        }));

        await prisma.document.createMany({
            data: createData,
        });

        console.log(`📝 Created batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(documents.length / batchSize)}`);
    }

    // Log folder statistics
    const folderStats = new Map<string, number>();
    for (const doc of documents) {
        const folderName = doc.folderName || 'root';
        folderStats.set(folderName, (folderStats.get(folderName) || 0) + 1);
    }

    console.log('📊 Folder statistics:');
    for (const [folderName, count] of folderStats) {
        console.log(`  ${folderName}: ${count} documents`);
    }

    console.log('✅ All documents seeded successfully with folder structure');
}

/**
 * Main execution
 */
if (require.main === module) {
    seedLMSContent()
        .then(() => {
            console.log('🎯 LMS content seeding script completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Script failed:', error);
            process.exit(1);
        });
}

export { seedLMSContent };
