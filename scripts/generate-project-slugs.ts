#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { generateSlug, generateUniqueSlug } from '../lib/utils';

const prisma = new PrismaClient();

async function generateProjectSlugs() {
    console.log('🔗 Starting project slug generation...');


    try {
        // Get all projects without slugs
        const projectsWithoutSlugs = await prisma.project.findMany({
            where: {
                slug: undefined,
            },
            include: {
                projectProfile: {
                    include: {
                        user: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
            },
        });

        if (projectsWithoutSlugs.length === 0) {
            console.log('✅ All projects already have slugs!');
            return;
        }

        console.log(`📝 Found ${projectsWithoutSlugs.length} projects without slugs`);

        // Generate slugs for each project
        for (const project of projectsWithoutSlugs) {
            const baseSlug = generateSlug(project.title);
            const projectSlug = await generateUniqueSlug(
                baseSlug,
                async (slug) => {
                    const existingProject = await prisma.project.findUnique({
                        where: { slug }
                    });
                    return !!existingProject;
                }
            );

            // Update the project with the generated slug
            await prisma.project.update({
                where: { id: project.id },
                data: { slug: projectSlug },
            });

            console.log(`✅ Generated slug for "${project.title}": ${projectSlug}`);
        }

        console.log('🎉 Project slug generation completed successfully!');

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
    generateProjectSlugs()
        .then(() => {
            console.log('✅ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Script failed:', error);
            process.exit(1);
        });
}

export { generateProjectSlugs };

