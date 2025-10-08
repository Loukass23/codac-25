'use server';

import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

export type CohortDistributionData = {
    name: string;
    students: number;
    percentage: number;
    status: 'active' | 'upcoming' | 'completed';
};

export type CohortTimelineData = {
    month: string;
    enrolled: number;
    graduated: number;
};

/**
 * Get cohort distribution with student counts
 */
export async function getCohortDistribution(): Promise<CohortDistributionData[]> {
    try {
        const cohorts = await prisma.cohort.findMany({
            include: {
                _count: {
                    select: {
                        students: true,
                    },
                },
            },
            orderBy: {
                startDate: 'desc',
            },
        });

        const totalStudents = cohorts.reduce((sum, cohort) => sum + cohort._count.students, 0);

        const now = new Date();

        const distribution: CohortDistributionData[] = cohorts.map(cohort => {
            const startDate = new Date(cohort.startDate);
            const endDate = cohort.endDate ? new Date(cohort.endDate) : null;

            let status: 'active' | 'upcoming' | 'completed' = 'active';

            if (startDate > now) {
                status = 'upcoming';
            } else if (endDate && endDate < now) {
                status = 'completed';
            }

            return {
                name: cohort.name,
                students: cohort._count.students,
                percentage: totalStudents > 0 ? Math.round((cohort._count.students / totalStudents) * 100) : 0,
                status,
            };
        });

        // Filter out cohorts with no students for cleaner visualization
        return distribution.filter(cohort => cohort.students > 0);
    } catch (error) {
        logger.error(
            'Failed to get cohort distribution',
            error instanceof Error ? error : new Error(String(error))
        );
        return [];
    }
}

/**
 * Get cohort enrollment timeline over the last 6 months
 */
export async function getCohortTimeline(): Promise<CohortTimelineData[]> {
    try {
        const now = new Date();
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(now.getMonth() - 6);

        // Get users created in the last 6 months with their cohort info
        const users = await prisma.user.findMany({
            where: {
                createdAt: {
                    gte: sixMonthsAgo,
                },
                cohortId: {
                    not: null,
                },
            },
            select: {
                createdAt: true,
                status: true,
            },
        });

        // Initialize months
        const monthlyData = new Map<string, { enrolled: number; graduated: number }>();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now);
            date.setMonth(now.getMonth() - i);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyData.set(monthKey, { enrolled: 0, graduated: 0 });
        }

        // Count enrollments and graduations per month
        users.forEach(user => {
            const date = new Date(user.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            const current = monthlyData.get(monthKey);
            if (current) {
                current.enrolled++;

                // Count as graduated if status is GRADUATED
                if (user.status === 'GRADUATED') {
                    current.graduated++;
                }
            }
        });

        // Convert to array
        const timeline: CohortTimelineData[] = Array.from(monthlyData.entries()).map(
            ([monthKey, data]) => {
                const [year, month] = monthKey.split('-');
                const date = new Date(parseInt(year), parseInt(month) - 1);
                return {
                    month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    enrolled: data.enrolled,
                    graduated: data.graduated,
                };
            }
        );

        return timeline;
    } catch (error) {
        logger.error(
            'Failed to get cohort timeline',
            error instanceof Error ? error : new Error(String(error))
        );
        return [];
    }
}

