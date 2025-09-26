#!/usr/bin/env tsx

import { getLMSNavigation } from '../data/documents/get-lms-documents';

async function testLMSNavigation() {
    try {
        console.log('Testing LMS navigation...');

        const navigation = await getLMSNavigation();

        console.log('Navigation items:', navigation.length);
        console.log('First few items:', navigation.slice(0, 3));

        // Test the extractSlugs logic
        const params: { slug: string[] }[] = [];

        function extractSlugs(
            items: {
                slug?: string;
                children?: { slug?: string; children?: unknown[] }[];
            }[]
        ): void {
            for (const item of items) {
                if (item.slug) {
                    params.push({
                        slug: item.slug.split('/'),
                    });
                }
                if (item.children) {
                    extractSlugs(
                        item.children as {
                            slug?: string;
                            children?: { slug?: string; children?: unknown[] }[];
                        }[]
                    );
                }
            }
        }

        extractSlugs(navigation);
        console.log('Generated params:', params.slice(0, 5));

    } catch (error) {
        console.error('Error:', error);
    }
}

testLMSNavigation();
