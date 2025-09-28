import { z } from 'zod';

// Import the shared type
export type { ServerActionResult } from '@/lib/utils/server-action-utils';

// Avatar validation schema - supports both URLs and base64 data URIs
const avatarSchema = z.string().refine(
    (value) => {
        // Allow empty strings
        if (value === '') return true;

        // First check if it's a data URI - must be image type
        if (value.startsWith('data:')) {
            return value.startsWith('data:image/') && value.includes('base64,');
        }

        // Otherwise check if it's a valid HTTP/HTTPS URL
        try {
            const url = new URL(value);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
            return false;
        }
    },
    {
        message: 'Avatar must be a valid URL or base64 image data URI'
    }
).optional();

// Base user validation schema
export const userSchema = z.object({
    email: z.string().email('Invalid email address').max(255, 'Email too long'),
    username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username too long').regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
    name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
    avatar: avatarSchema,
    bio: z.string().max(500, 'Bio too long').optional(),
    role: z.enum(['STUDENT', 'ALUMNI', 'MENTOR', 'ADMIN']).default('STUDENT'),
    status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED']).default('ACTIVE'),
    cohort: z.string().max(100, 'Cohort name too long').optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
    portfolioUrl: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
    currentJob: z.string().max(100, 'Job title too long').optional(),
    currentCompany: z.string().max(100, 'Company name too long').optional(),
});

// Create user schema - required fields for creation
export const createUserSchema = z.object({
    email: z.string().email('Invalid email address').max(255, 'Email too long'),
    username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username too long').regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
    name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
    role: z.enum(['STUDENT', 'ALUMNI', 'MENTOR', 'ADMIN']),
    status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED']),
});

// Update user schema - all fields optional except id
export const updateUserSchema = userSchema.partial().extend({
    id: z.string().cuid('Invalid user ID'),
});

// Delete user schema
export const deleteUserSchema = z.object({
    id: z.string().cuid('Invalid user ID'),
});

// Get user schema
export const getUserSchema = z.object({
    id: z.string().min(1, 'User ID is required'),
});

// Get users with filters schema
export const getUsersSchema = z.object({
    role: z.enum(['STUDENT', 'ALUMNI', 'MENTOR', 'ADMIN']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED']).optional(),
    cohort: z.string().optional(),
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
    search: z.string().max(100).optional(),
});

// Change user role schema (admin only)
export const changeUserRoleSchema = z.object({
    id: z.string().cuid('Invalid user ID'),
    role: z.enum(['STUDENT', 'ALUMNI', 'MENTOR', 'ADMIN']),
});

// Change user status schema
export const changeUserStatusSchema = z.object({
    id: z.string().cuid('Invalid user ID'),
    status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED']),
});

// Bulk operations schemas
export const bulkDeleteUsersSchema = z.object({
    ids: z.array(z.string().cuid()).min(1, 'At least one user ID is required'),
});



// Inferred types for type safety
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type GetUserInput = z.infer<typeof getUserSchema>;
export type GetUsersInput = z.infer<typeof getUsersSchema>;
export type ChangeUserRoleInput = z.infer<typeof changeUserRoleSchema>;
export type ChangeUserStatusInput = z.infer<typeof changeUserStatusSchema>;
export type BulkDeleteUsersInput = z.infer<typeof bulkDeleteUsersSchema>;
