'use server';

import { requireServerAuth } from '@/lib/auth/auth-server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { ServerActionResult } from '@/types/server-action';
import { z } from 'zod';

const UpdateFolderSchema = z.object({
    id: z.string().min(1, 'Folder ID is required'),
    name: z.string().min(1, 'Folder name is required').max(100, 'Folder name too long').optional(),
    description: z.string().optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
    icon: z.string().optional(),
    parentId: z.string().nullable().optional(),
    sortOrder: z.number().int().min(0).optional(),
});

type UpdateFolderInput = z.infer<typeof UpdateFolderSchema>;

export async function updateFolder(
    input: UpdateFolderInput
): Promise<ServerActionResult<{ id: string; name: string }>> {
    try {
        const user = await requireServerAuth();
        const validatedInput = UpdateFolderSchema.parse(input);

        // Check if folder exists and belongs to user
        const existingFolder = await prisma.documentFolder.findFirst({
            where: {
                id: validatedInput.id,
                ownerId: user.id,
            },
        });

        if (!existingFolder) {
            return {
                success: false,
                error: 'Folder not found or access denied',
            };
        }

        // If changing parent, validate the new parent
        if (validatedInput.parentId && validatedInput.parentId !== existingFolder.parentId) {
            // Prevent moving folder into itself or its children
            if (validatedInput.parentId === validatedInput.id) {
                return {
                    success: false,
                    error: 'Cannot move folder into itself',
                };
            }

            // Check if new parent exists and belongs to user
            const newParent = await prisma.documentFolder.findFirst({
                where: {
                    id: validatedInput.parentId,
                    ownerId: user.id,
                },
            });

            if (!newParent) {
                return {
                    success: false,
                    error: 'Parent folder not found or access denied',
                };
            }

            // Check for circular reference
            const isCircular = await checkCircularReference(validatedInput.id, validatedInput.parentId);
            if (isCircular) {
                return {
                    success: false,
                    error: 'Cannot move folder into its own subfolder',
                };
            }
        }

        const updateData: any = {};
        if (validatedInput.name !== undefined) updateData.name = validatedInput.name;
        if (validatedInput.description !== undefined) updateData.description = validatedInput.description;
        if (validatedInput.color !== undefined) updateData.color = validatedInput.color;
        if (validatedInput.icon !== undefined) updateData.icon = validatedInput.icon;
        if (validatedInput.parentId !== undefined) updateData.parentId = validatedInput.parentId;
        if (validatedInput.sortOrder !== undefined) updateData.sortOrder = validatedInput.sortOrder;

        const folder = await prisma.documentFolder.update({
            where: {
                id: validatedInput.id,
            },
            data: updateData,
        });

        logger.info('Folder updated successfully', {
            action: 'update_folder',
            metadata: {
                folderId: folder.id,
                userId: user.id,
                changes: Object.keys(updateData),
            },
        });

        return {
            success: true,
            data: {
                id: folder.id,
                name: folder.name,
            },
        };
    } catch (error) {
        logger.error('Failed to update folder', error instanceof Error ? error : new Error(String(error)), {
            action: 'update_folder',
            metadata: {
                input,
                error: error instanceof Error ? error.message : 'Unknown error',
            },
        });

        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: 'Invalid input data',
            };
        }

        return {
            success: false,
            error: 'Failed to update folder',
        };
    }
}

async function checkCircularReference(
    folderId: string,
    newParentId: string
): Promise<boolean> {
    let currentParentId = newParentId;

    while (currentParentId) {
        if (currentParentId === folderId) {
            return true;
        }

        const parent = await prisma.documentFolder.findUnique({
            where: { id: currentParentId },
            select: { parentId: true },
        });

        currentParentId = parent?.parentId ?? '';
    }

    return false;
}
