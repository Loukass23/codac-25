'use server';

import { revalidatePath } from 'next/cache';

import { Prisma } from '@prisma/client';
import { type Value } from 'platejs';

import { getCurrentUser } from '@/lib/auth/auth-utils';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import {
  handlePrismaError,
  type ServerActionResult,
} from '@/lib/utils/server-action-utils';

export async function updateProjectSummary(
  projectId: string,
  summary: Value
): Promise<ServerActionResult<{ id: string; updated: boolean }>> {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Verify the project exists and user owns it
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        projectProfile: {
          userId: user.id,
        },
      },
      include: {
        projectProfile: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!project) {
      return {
        success: false,
        error: 'Project not found or access denied',
      };
    }

    // Update the project's document content
    if (project.documentId) {
      await prisma.document.update({
        where: { id: project.documentId },
        data: {
          content: summary as Prisma.InputJsonValue,
          updatedAt: new Date(),
        },
      });
    }

    // Revalidate relevant pages
    revalidatePath('/projects');
    revalidatePath(`/projects/${projectId}`);
    revalidatePath('/projects/my');

    logger.info('Project summary updated successfully', {
      action: 'update_project_summary',
      resource: 'project',
      resourceId: projectId,
      metadata: {
        userId: user.id,
        summaryLength: JSON.stringify(summary).length,
      },
    });

    return {
      success: true,
      data: { id: projectId, updated: true },
    };
  } catch (error) {
    const handledError =
      error instanceof Prisma.PrismaClientKnownRequestError
        ? handlePrismaError(error)
        : 'An unexpected error occurred';

    logger.error(
      'Failed to update project summary',
      error instanceof Error ? error : new Error(String(error)),
      {
        action: 'update_project_summary',
        resource: 'project',
        resourceId: projectId,
        metadata: { error: handledError },
      }
    );

    return {
      success: false,
      error: handledError,
    };
  }
}
