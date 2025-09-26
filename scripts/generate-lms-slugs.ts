#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Generate slugs for LMS documents that don't have them
 */
async function generateLMSDocumentSlugs() {
    console.log('🔗 Starting LMS document slug generation...');

    try {
        // Find all LMS documents without slugs
        const documentsWithoutSlugs = await prisma.document.findMany({
            where: {
                documentType: {
                    startsWith: 'lms_'
                },
                slug: null,
                isPublished: true,
                isArchived: false,
            },
            select: {
                id: true,
                title: true,
                documentType: true,
            },
        });

        console.log(`📄 Found ${documentsWithoutSlugs.length} LMS documents without slugs`);

        if (documentsWithoutSlugs.length === 0) {
            console.log('✅ All LMS documents already have slugs!');
            return;
        }

        // Generate slugs for each document
        for (const doc of documentsWithoutSlugs) {
            const baseSlug = doc.title
                ? doc.title
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                    .replace(/\s+/g, '-') // Replace spaces with hyphens
                    .replace(/-+/g, '-') // Replace multiple hyphens with single
                    .trim()
                : `lms-${doc.documentType.replace('lms_', '')}-${doc.id.slice(-8)}`;

            // Ensure slug is unique
            let slug = baseSlug;
            let counter = 1;

            while (await prisma.document.findFirst({ where: { slug } })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }

            // Update the document with the generated slug
            await prisma.document.update({
                where: { id: doc.id },
                data: { slug },
            });

            console.log(`✅ Generated slug for "${doc.title}": ${slug}`);
        }

        console.log('🎉 LMS document slug generation completed successfully!');

    } catch (error) {
        console.error('💥 Error during slug generation:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * Main execution
 */
if (require.main === module) {
    generateLMSDocumentSlugs()
        .then(() => {
            console.log('✅ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Script failed:', error);
            process.exit(1);
        });
}

export { generateLMSDocumentSlugs };
