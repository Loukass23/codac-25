'use server';

import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

export type ProjectTrendData = {
    date: string;
    projects: number;
    featured: number;
};

export type ActivityData = {
    date: string;
    comments: number;
    likes: number;
    projects: number;
};

export type TechStackData = {
    name: string;
    count: number;
    percentage: number;
};

/**
 * Get project creation trends over the last 6 months
 */
export async function getProjectTrends(): Promise<ProjectTrendData[]> {
    try {
        const now = new Date();
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(now.getMonth() - 6);

        // Get all projects created in the last 6 months
        const projects = await prisma.project.findMany({
            where: {
                isPublic: true,
                createdAt: {
                    gte: sixMonthsAgo,
                },
            },
            select: {
                createdAt: true,
                isFeatured: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        // Group projects by month
        const monthlyData = new Map<string, { projects: number; featured: number }>();

        // Initialize all months with 0
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(now.getMonth() - i);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyData.set(monthKey, { projects: 0, featured: 0 });
        }

        // Count projects per month
        projects.forEach(project => {
            const date = new Date(project.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            const current = monthlyData.get(monthKey) || { projects: 0, featured: 0 };
            current.projects++;
            if (project.isFeatured) {
                current.featured++;
            }
            monthlyData.set(monthKey, current);
        });

        // Convert to array and format
        const trends: ProjectTrendData[] = Array.from(monthlyData.entries()).map(
            ([monthKey, data]) => {
                const [year, month] = monthKey.split('-');
                const date = new Date(parseInt(year), parseInt(month) - 1);
                return {
                    date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    projects: data.projects,
                    featured: data.featured,
                };
            }
        );

        return trends;
    } catch (error) {
        logger.error(
            'Failed to get project trends',
            error instanceof Error ? error : new Error(String(error))
        );
        return [];
    }
}

/**
 * Get platform activity over the last 30 days
 */
export async function getActivityTrends(): Promise<ActivityData[]> {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);

        // Get activity data
        const [comments, likes, projects] = await Promise.all([
            prisma.projectComment.findMany({
                where: {
                    createdAt: {
                        gte: thirtyDaysAgo,
                    },
                },
                select: {
                    createdAt: true,
                },
            }),
            prisma.projectLike.findMany({
                where: {
                    createdAt: {
                        gte: thirtyDaysAgo,
                    },
                },
                select: {
                    createdAt: true,
                },
            }),
            prisma.project.findMany({
                where: {
                    isPublic: true,
                    createdAt: {
                        gte: thirtyDaysAgo,
                    },
                },
                select: {
                    createdAt: true,
                },
            }),
        ]);

        // Group by week
        const weeklyData = new Map<string, { comments: number; likes: number; projects: number }>();

        // Initialize last 4 weeks
        for (let i = 3; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i * 7);
            const weekKey = getWeekKey(date);
            weeklyData.set(weekKey, { comments: 0, likes: 0, projects: 0 });
        }

        // Count activity per week
        comments.forEach(comment => {
            const weekKey = getWeekKey(new Date(comment.createdAt));
            const current = weeklyData.get(weekKey);
            if (current) {
                current.comments++;
            }
        });

        likes.forEach(like => {
            const weekKey = getWeekKey(new Date(like.createdAt));
            const current = weeklyData.get(weekKey);
            if (current) {
                current.likes++;
            }
        });

        projects.forEach(project => {
            const weekKey = getWeekKey(new Date(project.createdAt));
            const current = weeklyData.get(weekKey);
            if (current) {
                current.projects++;
            }
        });

        // Convert to array
        const activity: ActivityData[] = Array.from(weeklyData.entries()).map(
            ([weekKey, data]) => ({
                date: weekKey,
                comments: data.comments,
                likes: data.likes,
                projects: data.projects,
            })
        );

        return activity;
    } catch (error) {
        logger.error(
            'Failed to get activity trends',
            error instanceof Error ? error : new Error(String(error))
        );
        return [];
    }
}

/**
 * Get top tech stack usage across all projects
 */
export async function getTechStackDistribution(): Promise<TechStackData[]> {
    try {
        // Get all public projects with tech stack
        const projects = await prisma.project.findMany({
            where: {
                isPublic: true,
                techStack: {
                    isEmpty: false,
                },
            },
            select: {
                techStack: true,
            },
        });

        // Count tech stack occurrences
        const techCount = new Map<string, number>();
        let totalTech = 0;

        projects.forEach(project => {
            project.techStack.forEach(tech => {
                techCount.set(tech, (techCount.get(tech) || 0) + 1);
                totalTech++;
            });
        });

        // Sort by count and get top 10
        const sorted = Array.from(techCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        // Calculate percentages
        const distribution: TechStackData[] = sorted.map(([name, count]) => ({
            name,
            count,
            percentage: Math.round((count / totalTech) * 100),
        }));

        return distribution;
    } catch (error) {
        logger.error(
            'Failed to get tech stack distribution',
            error instanceof Error ? error : new Error(String(error))
        );
        return [];
    }
}

/**
 * Helper function to get week key (e.g., "Week 1", "Week 2")
 */
function getWeekKey(date: Date): string {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Start of week (Sunday)
    return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

