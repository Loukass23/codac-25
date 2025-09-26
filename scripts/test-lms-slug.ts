#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { getLMSDocumentBySlug } from '../data/lms/get-lms-documents';

const prisma = new PrismaClient();

async function testLMSSlug() {
    try {
        // Test with a known slug
        const testSlug = 'welcome';
        console.log(`Testing slug: ${testSlug}`);

        const document = await getLMSDocumentBySlug(testSlug);

        if (document) {
            console.log('✅ Document found:', {
                id: document.id,
                title: document.title,
                slug: document.slug,
                documentType: document.documentType
            });
        } else {
            console.log('❌ Document not found');
        }

        // Also test direct database query
        const directQuery = await prisma.document.findFirst({
            where: {
                slug: testSlug,
                documentType: {
                    startsWith: 'lms_'
                },
                isPublished: true,
                isArchived: false,
            }
        });

        console.log('Direct query result:', directQuery ? 'Found' : 'Not found');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testLMSSlug();
