'use server';

import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { Document, Project } from '@prisma/client';

export type ProjectWithDocument = Project & {
  document: Document;
};

export async function getProjectById(
  projectId: string
): Promise<Project | null> {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        projectProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                githubUrl: true,
                linkedinUrl: true,
              },
            },
          },
        },
        document: {
          select: {
            id: true,
            content: true,
            title: true,
            description: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        projectLikes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            projectLikes: true,
            collaborators: true,
          },
        },
      },
    });

    if (!project) {
      return null;
    }

    // Check if project is public or user has access
    if (!project.isPublic && !project.projectProfile.isPublic) {
      return null;
    }

    // Increment view count (fire and forget)
    prisma.project
      .update({
        where: { id: projectId },
        data: { views: { increment: 1 } },
      })
      .catch(error => {
        logger.error(
          'Failed to increment project view count',
          error instanceof Error ? error : new Error(String(error))
        );
      });

    return project;
  } catch (error) {
    logger.error(
      'Failed to get project by ID',
      error instanceof Error ? error : new Error(String(error)),
      {
        action: 'get_project_by_id',
        metadata: { projectId },
      }
    );
    return null;
  }
}
