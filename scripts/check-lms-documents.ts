#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLMSDocuments() {
    try {
        const documents = await prisma.document.findMany({
            where: {
                documentType: {
                    startsWith: 'lms_'
                }
            },
            select: {
                id: true,
                title: true,
                slug: true,
                documentType: true,
                isPublished: true,
            }
        });

        console.log(`Found ${documents.length} LMS documents:`);
        documents.forEach(doc => {
            console.log(`- ${doc.title} (${doc.documentType}) - Slug: ${doc.slug || 'NULL'} - Published: ${doc.isPublished}`);
        });

        const documentsWithoutSlugs = documents.filter(doc => !doc.slug);
        console.log(`\nDocuments without slugs: ${documentsWithoutSlugs.length}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkLMSDocuments();
