import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        // Check if user is authenticated
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId } = await params;

        // Users can only fetch their own avatar unless they're an admin
        if (session.user.id !== userId && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch avatar from database
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { image: true, avatar: true },
        });

        const avatar = user?.image || user?.avatar;

        return NextResponse.json({ avatar });
    } catch (error) {
        logger.error('Error fetching user avatar:', error instanceof Error ? error : new Error(String(error)));
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 