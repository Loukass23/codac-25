'use server';

import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import {
  getUsersSchema,
  type GetUsersInput,
  type ServerActionResult,
} from '@/lib/validation/user';
// import {
//     commonSelects,
//     type UserWithCounts
// } from '@/lib/server-action-utils';

// Define return type
type GetUsersResult = ServerActionResult<{
  users: any[]; // Temporarily using any to resolve type conflicts
  total: number;
  hasMore: boolean;
}>;

export async function getUsers(data: GetUsersInput): Promise<GetUsersResult> {
  const startTime = Date.now();

  try {
    logger.logServerAction('get', 'users', {
      metadata: {
        filters: {
          role: data.role,
          status: data.status,
          cohort: data.cohort,
          search: data.search,
        },
        pagination: {
          limit: data.limit,
          offset: data.offset,
        },
      },
    });

    // Validate input data
    const validatedData = getUsersSchema.parse(data);

    // Build where clause for filtering
    const where: Prisma.UserWhereInput = {};

    if (validatedData.role) {
      where.role = validatedData.role;
    }

    if (validatedData.status) {
      where.status = validatedData.status;
    }

    if (validatedData.cohort) {
      where.cohort = {
        slug: validatedData.cohort,
      };
    }

    if (validatedData.search) {
      where.OR = [
        { name: { contains: validatedData.search } },
        { email: { contains: validatedData.search } },
        { currentJob: { contains: validatedData.search } },
        { currentCompany: { contains: validatedData.search } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.user.count({ where });

    logger.logDatabaseOperation('count', 'users', undefined, {
      metadata: { total, filters: where },
    });

    // Get users with pagination and optimized relation loading
    const users = await prisma.user.findMany({
      // Note: relationLoadStrategy is a Prisma extension feature - remove if not using extensions
      where,
      include: {
        _count: {
          select: {
            projectComments: true,
          },
        },
        cohort: {
          select: {
            id: true,
            name: true,
            slug: true,
            startDate: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: validatedData.limit,
      skip: validatedData.offset,
    });

    logger.logDatabaseOperation('findMany', 'users', undefined, {
      metadata: { count: users.length, filters: where },
    });

    const hasMore = validatedData.offset + users.length < total;

    logger.info('Users retrieved successfully', {
      action: 'get',
      resource: 'users',
      metadata: {
        duration: Date.now() - startTime,
        count: users.length,
        total,
        hasMore,
        filters: {
          role: validatedData.role,
          status: validatedData.status,
          cohort: validatedData.cohort,
          search: validatedData.search,
        },
      },
    });

    return {
      success: true,
      data: {
        users,
        total,
        hasMore,
      },
    };
  } catch (error) {
    logger.logServerActionError(
      'get',
      'users',
      error instanceof Error ? error : new Error(String(error)),
      {
        metadata: {
          duration: Date.now() - startTime,
          filters: data,
        },
      }
    );

    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      logger.logValidationError('users', (error as any).errors);
      return {
        success: false,
        error: (error as any).errors,
      };
    }

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          return {
            success: false,
            error: 'Users not found',
          };
        default:
          return {
            success: false,
            error: 'Database error occurred',
          };
      }
    }

    return {
      success: false,
      error: 'Failed to retrieve users',
    };
  }
}
