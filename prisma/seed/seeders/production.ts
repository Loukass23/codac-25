import fs from 'fs';
import path from 'path';

import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { encodeSeedImageToBase64 } from '../../../lib/imaging/encode-image-to-base64';
import { logger } from '../../../lib/logger';

const prisma = new PrismaClient();

interface ProductionCohort {
    legacyId: string;
    name: string;
    slug: string;
    startDate: string;
    endDate?: string;
    description: string;
    image: string;
}

interface ProductionUser {
    legacyId: string;
    name: string;
    username: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    cohortLegacyId?: string;
    bio: string;
    image?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    currentJob?: string;
    currentCompany?: string;
    startDate?: string;
    endDate?: string;
    photoConsent?: boolean;
    imagePrivate?: boolean;
}

/**
 * Seeds production data from prisma/seed/prod/
 * This includes real cohorts and users with proper images
 */
export async function seedProduction() {
    try {
        logger.info('🚀 Starting production data seed...');

        // Default password for all users
        const defaultPassword = await bcrypt.hash('password123', 10);

        // Load data from JSON files
        const cohortsPath = path.join(process.cwd(), 'prisma/seed/prod/cohorts.json');
        const usersPath = path.join(process.cwd(), 'prisma/seed/prod/users.json');

        if (!fs.existsSync(cohortsPath) || !fs.existsSync(usersPath)) {
            throw new Error('Production seed files not found. Make sure prisma/seed/prod/ contains cohorts.json and users.json');
        }

        const cohortsData: ProductionCohort[] = JSON.parse(fs.readFileSync(cohortsPath, 'utf-8'));
        const usersData: ProductionUser[] = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

        // Clean existing data
        logger.info('🧹 Cleaning existing production data...');
        await prisma.user.deleteMany({
            where: {
                email: { in: usersData.map(u => u.email) }
            }
        });
        await prisma.cohort.deleteMany({
            where: {
                slug: { in: cohortsData.map(c => c.slug) }
            }
        });

        // Create cohorts with images
        logger.info(`🏫 Creating ${cohortsData.length} production cohorts...`);
        const cohortMap = new Map<string, string>(); // legacyId -> new id

        for (const cohortData of cohortsData) {
            try {
                // Encode cohort image to base64
                const imagePath = path.join(process.cwd(), 'prisma/seed/prod/', cohortData.image);
                let cohortImageBase64: string | undefined;

                if (fs.existsSync(imagePath)) {
                    cohortImageBase64 = await encodeSeedImageToBase64(cohortData.image, 'prisma/seed/prod/');
                } else {
                    logger.warn(`⚠️ Cohort image not found: ${imagePath}`);
                }

                const cohort = await prisma.cohort.create({
                    data: {
                        name: cohortData.name,
                        slug: cohortData.slug,
                        startDate: new Date(cohortData.startDate),
                        endDate: cohortData.endDate ? new Date(cohortData.endDate) : null,
                        description: cohortData.description,
                        image: cohortImageBase64,
                    },
                });

                cohortMap.set(cohortData.legacyId, cohort.id);
                logger.info(`✅ Created cohort: ${cohort.name} (${cohort.slug})`);
            } catch (error) {
                logger.error(`❌ Failed to create cohort ${cohortData.name}:`, error instanceof Error ? error : new Error(String(error)));
            }
        }

        // Create users with images
        logger.info(`👥 Creating ${usersData.length} production users...`);
        let createdCount = 0;

        for (const userData of usersData) {
            try {
                // Get cohort ID from legacy mapping
                const cohortId = userData.cohortLegacyId ? cohortMap.get(userData.cohortLegacyId) : undefined;

                // Handle user image
                let userImageBase64: string | undefined;

                if (userData.image) {
                    // Check if it's a URL or local path
                    if (userData.image.startsWith('http://') || userData.image.startsWith('https://')) {
                        // Keep the URL as is
                        userImageBase64 = userData.image;
                    } else {
                        // Try to encode local image
                        const imagePath = path.join(process.cwd(), 'prisma/seed/prod/', userData.image);
                        if (fs.existsSync(imagePath)) {
                            userImageBase64 = await encodeSeedImageToBase64(userData.image, 'prisma/seed/prod/');
                        } else {
                            // Try alternative path format (avatar filename)
                            const alternativePath = path.join(
                                process.cwd(),
                                'prisma/seed/prod/images/users/',
                                path.basename(userData.image)
                            );
                            if (fs.existsSync(alternativePath)) {
                                userImageBase64 = await encodeSeedImageToBase64(
                                    `images/users/${path.basename(userData.image)}`,
                                    'prisma/seed/prod/'
                                );
                            } else {
                                logger.warn(`⚠️ User image not found for ${userData.name}: ${imagePath}`);
                            }
                        }
                    }
                }

                await prisma.user.create({
                    data: {
                        name: userData.name,
                        username: userData.username,
                        email: userData.email,
                        password: defaultPassword,
                        role: userData.role,
                        status: userData.status,
                        cohortId,
                        bio: userData.bio,
                        image: userImageBase64,
                        githubUrl: userData.githubUrl,
                        linkedinUrl: userData.linkedinUrl,
                        portfolioUrl: userData.portfolioUrl,
                        currentJob: userData.currentJob,
                        currentCompany: userData.currentCompany,
                        startDate: userData.startDate ? new Date(userData.startDate) : null,
                        endDate: userData.endDate ? new Date(userData.endDate) : null,
                    },
                });

                createdCount++;
                if (createdCount % 10 === 0) {
                    logger.info(`📊 Progress: ${createdCount}/${usersData.length} users created...`);
                }
            } catch (error) {
                logger.error(`❌ Failed to create user ${userData.name} (${userData.email}):`, error instanceof Error ? error : new Error(String(error)));
            }
        }

        logger.info('✅ Production data seed completed successfully!');
        logger.info(`🏫 Created ${cohortMap.size} cohorts`);
        logger.info(`👥 Created ${createdCount} users`);
        logger.info('🔐 Default password for all users: password123');

    } catch (error) {
        const errorMessage = error instanceof Error ? error : new Error(String(error));
        logger.error('❌ Production seed failed:', errorMessage);
        throw errorMessage;
    }
}

/**
 * Cleans production data
 */
export async function cleanProduction() {
    try {
        logger.info('🧹 Cleaning production data...');

        const cohortsPath = path.join(process.cwd(), 'prisma/seed/prod/cohorts.json');
        const usersPath = path.join(process.cwd(), 'prisma/seed/prod/users.json');

        if (fs.existsSync(cohortsPath) && fs.existsSync(usersPath)) {
            const cohortsData: ProductionCohort[] = JSON.parse(fs.readFileSync(cohortsPath, 'utf-8'));
            const usersData: ProductionUser[] = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

            await prisma.user.deleteMany({
                where: {
                    email: { in: usersData.map(u => u.email) }
                }
            });

            await prisma.cohort.deleteMany({
                where: {
                    slug: { in: cohortsData.map(c => c.slug) }
                }
            });
        }

        logger.info('✅ Production data cleaned successfully!');
    } catch (error) {
        const errorMessage = error instanceof Error ? error : new Error(String(error));
        logger.error('❌ Failed to clean production data:', errorMessage);
        throw errorMessage;
    }
}

