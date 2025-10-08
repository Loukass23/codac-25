import fs from 'fs';
import path from 'path';

import { PrismaClient, ProjectStatus } from '@prisma/client';

import { logger } from '../../../lib/logger';

const prisma = new PrismaClient();

interface DemoProject {
  title: string;
  description: string;
  shortDesc: string;
  summary: any; // Plate.js content
  techStack: string[];
  features: string[];
  challenges: string;
  solutions: string;
  status: string;
  demoUrl?: string;
  githubUrl?: string;
  isPublic: boolean;
  isFeatured: boolean;
  startDate: string;
  endDate?: string;
  images?: string[];
  likes: number;
  views: number;
  authorEmail: string;
}

export async function seedProjects() {
  try {
    logger.info('🚀 Starting projects seed...');

    // Load demo projects data
    const projectsData: DemoProject[] = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'prisma/seed/dev/demo-projects.json'),
        'utf-8'
      )
    );

    // Clean existing demo projects
    logger.info('🧹 Cleaning existing demo projects...');
    await prisma.project.deleteMany({
      where: {
        title: {
          in: projectsData.map(p => p.title),
        },
      },
    });

    // Get existing users to assign as project authors
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: projectsData.map(p => p.authorEmail),
        },
      },
      include: {
        projectProfile: true,
      },
    });

    // Create project profiles for users if they don't exist
    logger.info('👤 Creating project profiles for users...');
    for (const user of users) {
      if (!user.projectProfile) {
        try {
          await prisma.projectProfile.create({
            data: {
              userId: user.id,
              bio: `${user.name}'s project portfolio`,
              headline: 'Software Developer',
              isPublic: true,
              isActive: true,
            },
          });
        } catch (error) {
          // Project profile might already exist, continue
          logger.warn(
            `Project profile creation failed for user ${user.email}: ${error}`
          );
        }
      }
    }

    // Create projects
    logger.info('📁 Creating demo projects...');
    const createdProjects = await Promise.all(
      projectsData.map(async projectData => {
        const user = users.find(u => u.email === projectData.authorEmail);
        if (!user) {
          logger.warn(`User not found for email: ${projectData.authorEmail}`);
          return null;
        }

        // Get or create project profile
        let projectProfile = user.projectProfile;
        if (!projectProfile) {
          try {
            projectProfile = await prisma.projectProfile.create({
              data: {
                userId: user.id,
                bio: `${user.name}'s project portfolio`,
                headline: 'Software Developer',
                isPublic: true,
                isActive: true,
              },
            });
          } catch (error) {
            // Try to get existing project profile
            projectProfile = await prisma.projectProfile.findUnique({
              where: { userId: user.id },
            });
            if (!projectProfile) {
              logger.error(
                `Could not create or find project profile for user ${user.email}`
              );
              return null;
            }
          }
        }

        // Create document for project summary
        const document = await prisma.document.create({
          data: {
            content: projectData.summary,
            title: `${projectData.title} - Project Summary`,
            description: projectData.shortDesc,
            documentType: 'project_summary',
            authorId: user.id,
            isPublished: projectData.isPublic,
          },
        });

        // Generate slug from title
        const baseSlug = projectData.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();

        // Ensure slug is unique by appending username and/or number if needed
        let slug = `${user.username}-${baseSlug}`;
        let counter = 1;
        while (await prisma.project.findUnique({ where: { slug } })) {
          slug = `${user.username}-${baseSlug}-${counter}`;
          counter++;
        }

        return prisma.project.create({
          data: {
            title: projectData.title,
            description: projectData.description,
            shortDesc: projectData.shortDesc,
            slug,
            techStack: projectData.techStack,
            features: projectData.features,
            challenges: projectData.challenges,
            solutions: projectData.solutions,
            status: projectData.status as ProjectStatus,
            demoUrl: projectData.demoUrl,
            githubUrl: projectData.githubUrl,
            isPublic: projectData.isPublic,
            isFeatured: projectData.isFeatured,
            startDate: new Date(projectData.startDate),
            endDate: projectData.endDate ? new Date(projectData.endDate) : null,
            images: projectData.images || [],
            likes: projectData.likes,
            views: projectData.views,
            projectProfileId: projectProfile.id,
            documentId: document.id,
          },
        });
      })
    );

    // Filter out null results
    const validProjects = createdProjects.filter(p => p !== null);

    logger.info(
      `✅ Successfully created ${validProjects.length} demo projects`
    );

    console.log('\n🎉 Demo projects seeded successfully!');
    console.log('═══════════════════════════════════════');
    console.log(`📊 Created ${validProjects.length} projects:`);
    validProjects.forEach(project => {
      console.log(`  • ${project?.title} (${project?.status})`);
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error : new Error(String(error));
    logger.error('❌ Projects seeding failed:', errorMessage);
    throw errorMessage;
  }
}

export async function cleanProjects() {
  try {
    logger.info('🧹 Cleaning demo projects...');

    // Load project titles to clean
    const projectsData: DemoProject[] = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'prisma/seed/data/demo-projects.json'),
        'utf-8'
      )
    );

    // First delete projects (this will cascade to documents)
    await prisma.project.deleteMany({
      where: {
        title: {
          in: projectsData.map(p => p.title),
        },
      },
    });

    // Also clean up any orphaned project summary documents
    await prisma.document.deleteMany({
      where: {
        documentType: 'project_summary',
        title: {
          in: projectsData.map(p => `${p.title} - Project Summary`),
        },
      },
    });

    logger.info('✅ Demo projects cleaned successfully');
    console.log('🧹 Demo projects cleaned successfully!');
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error : new Error(String(error));
    logger.error('❌ Projects cleanup failed:', errorMessage);
    throw errorMessage;
  }
}
