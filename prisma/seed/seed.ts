#!/usr/bin/env tsx

import * as readline from 'readline';

import { PrismaClient } from '@prisma/client';

import { logger } from '../../lib/logger';

// Import all seeder modules
import { cleanAttackOnTitan, seedAttackOnTitan } from './seeders/attack-on-titan';
import { cleanChatData, seedChatData } from './seeders/chat';
import { cleanDocuments, seedDocuments } from './seeders/documents';
import { cleanJobs, seedJobs } from './seeders/jobs';
import { cleanProduction, seedProduction } from './seeders/production';
import { cleanProjects, seedProjects } from './seeders/projects';

const prisma = new PrismaClient();

interface SeedOption {
    id: string;
    name: string;
    description: string;
    action: () => Promise<void>;
    cleanAction?: () => Promise<void>;
}

const seedOptions: SeedOption[] = [
    {
        id: 'production',
        name: 'Production Data',
        description: 'Real cohorts and users from CODAC history (prisma/seed/prod/)',
        action: seedProduction,
        cleanAction: cleanProduction,
    },
    {
        id: 'attack-on-titan',
        name: 'Attack on Titan Theme (Dev)',
        description: 'Demo users and cohorts with Attack on Titan theme (prisma/seed/dev/)',
        action: seedAttackOnTitan,
        cleanAction: cleanAttackOnTitan,
    },
    {
        id: 'jobs',
        name: 'Job Postings',
        description: 'Import job postings data',
        action: seedJobs,
        cleanAction: cleanJobs,
    },
    {
        id: 'projects',
        name: 'Demo Projects',
        description: 'Create demo project showcases with various tech stacks and features',
        action: seedProjects,
        cleanAction: cleanProjects,
    },
    {
        id: 'documents',
        name: 'Demo Documents',
        description: 'Create demo documents with rich content and comments',
        action: seedDocuments,
        cleanAction: cleanDocuments,
    },
    {
        id: 'chat-data',
        name: 'Chat Data',
        description: 'Import chat conversations, participants, and messages from exported data',
        action: seedChatData,
        cleanAction: cleanChatData,
    },
];

function displayMenu() {
    console.log('\n🌱 CODAC Seed Data Manager');
    console.log('═══════════════════════════════════════\n');
    console.log('Available seeding options:');

    seedOptions.forEach((option, index) => {
        console.log(`${index + 1}. ${option.name}`);
        console.log(`   ${option.description}`);
    });

    console.log('\nSpecial commands:');
    console.log('a. Seed ALL data');
    console.log('c. Clean ALL data');
    console.log('x. Exit');
    console.log('\nEnter your choice (number, letter, or comma-separated numbers):');
}

async function seedAll() {
    logger.info('🌱 Starting complete database seeding...');

    try {
        // Seed in order: users/cohorts -> content -> chats -> jobs -> projects -> documents
        // Note: Uses dev data (Attack on Titan theme), not production data
        await seedAttackOnTitan();
        await seedChatData();
        await seedJobs();
        await seedProjects();
        await seedDocuments();

        logger.info('✅ Complete seeding finished successfully!');

        console.log('\n🎉 All data seeded successfully!');
        console.log('═══════════════════════════════════════');
        console.log('📊 Summary:');
        console.log('  • Attack on Titan themed cohorts and users');
        console.log('  • Chat conversations and messages');
        console.log('  • Job postings');
        console.log('  • Demo project showcases');
        console.log('  • Demo documents with rich content and comments');
        console.log('\n🔐 Default login credentials:');
        console.log('  • Email: admin@codac.academy');
        console.log('  • Password: password123');
        console.log('\n📱 You can now start the application!');
        console.log('\n💡 Tip: To seed production data, run: pnpm tsx prisma/seed/seed.ts 1');

    } catch (error) {
        const errorMessage = error instanceof Error ? error : new Error(String(error));
        logger.error('❌ Complete seeding failed:', errorMessage);
        throw errorMessage;
    }
}

async function cleanAll() {
    logger.info('🧹 Starting complete database cleanup...');

    try {
        // Clean in reverse order
        await cleanDocuments();
        await cleanProjects();
        await cleanJobs();
        await cleanChatData();
        await cleanAttackOnTitan();
        // Note: Production data is NOT cleaned by "clean all"
        // To clean production data, run: pnpm tsx prisma/seed/seed.ts clean-prod

        logger.info('✅ Complete cleanup finished successfully!');
        console.log('\n🧹 All data cleaned successfully!');
        console.log('💡 Note: Production data was not cleaned. To clean it, use option 1 in the menu.');

    } catch (error) {
        const errorMessage = error instanceof Error ? error : new Error(String(error));
        logger.error('❌ Complete cleanup failed:', errorMessage);
        throw errorMessage;
    }
}

async function processSelection(input: string) {
    const trimmed = input.trim().toLowerCase();

    if (trimmed === 'a') {
        await seedAll();
        return;
    }

    if (trimmed === 'c') {
        await cleanAll();
        return;
    }

    if (trimmed === 'x') {
        console.log('\n👋 Goodbye!');
        process.exit(0);
    }

    // Handle single number or comma-separated numbers
    const selections = trimmed.split(',').map(s => s.trim());

    for (const selection of selections) {
        const index = parseInt(selection) - 1;

        if (index >= 0 && index < seedOptions.length) {
            const option = seedOptions[index];
            logger.info(`🌱 Starting ${option?.name}...`);
            console.log(`\n🌱 Seeding ${option?.name}...`);

            try {
                await option?.action();
                console.log(`✅ ${option?.name} completed successfully!`);
            } catch (error) {
                const errorMessage = error instanceof Error ? error : new Error(String(error));
                logger.error(`❌ ${option?.name} failed:`, errorMessage);
                console.log(`❌ ${option?.name} failed. Check logs for details.`);
            }
        } else {
            console.log(`❌ Invalid selection: ${selection}`);
        }
    }
}

async function interactiveMode() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function askQuestion(): Promise<string> {
        return new Promise((resolve) => {
            displayMenu();
            rl.question('> ', (answer: string) => {
                resolve(answer);
            });
        });
    }

    try {
        while (true) {
            const input = await askQuestion();

            if (input.trim().toLowerCase() === 'x') {
                console.log('\n👋 Goodbye!');
                break;
            }

            await processSelection(input);

            // Ask if user wants to continue
            const continueAnswer = await new Promise<string>((resolve) => {
                rl.question('\nContinue? (y/n): ', (answer: string) => {
                    resolve(answer);
                });
            });

            if (continueAnswer.toLowerCase() !== 'y') {
                console.log('\n👋 Goodbye!');
                break;
            }
        }
    } finally {
        rl.close();
    }
}

async function main() {
    try {
        // Check if running with command line arguments
        const args = process.argv.slice(2);

        if (args.length > 0) {
            // Non-interactive mode
            // Filter out npm/pnpm separator '--' if present
            const cleanArgs = args.filter(arg => arg !== '--');
            const command = cleanArgs[0];

            if (command === 'all') {
                await seedAll();
            } else if (command === 'clean') {
                await cleanAll();
            } else if (command === '--clean-chat') {
                logger.info('🧹 Cleaning chat data only...');
                await cleanChatData();
                console.log('✅ Chat data cleaned successfully!');
            } else {
                // Try to process as selection
                await processSelection(command!);
            }
        } else {
            // Interactive mode
            await interactiveMode();
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error : new Error(String(error));
        logger.error('❌ Seed script failed:', errorMessage);
        console.error('❌ Seed script failed:', errorMessage.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Help function
function showHelp() {
    console.log(`
🌱 CODAC Seed Data Manager

Usage:
  tsx prisma/seed/seed.ts                    # Interactive mode
  tsx prisma/seed/seed.ts all                # Seed all DEV data (Attack on Titan theme)
  tsx prisma/seed/seed.ts clean              # Clean all DEV data
  tsx prisma/seed/seed.ts 1                  # Seed production data
  tsx prisma/seed/seed.ts 2                  # Seed Attack on Titan theme
  tsx prisma/seed/seed.ts 1,3,4              # Seed multiple options
  tsx prisma/seed/seed.ts --help             # Show this help

Available options:
${seedOptions.map((opt, i) => `  ${i + 1}. ${opt.name} - ${opt.description}`).join('\n')}

Examples:
  tsx prisma/seed/seed.ts all                # Seed all dev data (Attack on Titan + features)
  tsx prisma/seed/seed.ts 1                  # Seed ONLY production data
  tsx prisma/seed/seed.ts 2,3,4              # Seed Attack on Titan + Jobs + Projects
  tsx prisma/seed/seed.ts clean              # Clean dev data (keeps production safe)

Note: Production data (option 1) is NOT included in "all" and must be seeded explicitly.
`);
}

// Handle help command
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showHelp();
    process.exit(0);
}

// Run the main function
if (require.main === module) {
    main();
}

export { cleanAll, seedAll, seedOptions };

