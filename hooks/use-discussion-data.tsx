'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { TDiscussion, UserData } from '@/components/editor/plugins/discussion-kit';
import {
    getCurrentUserForDiscussion,
    getDiscussionUsers,
    getDocumentDiscussions
} from '@/data/documents/get-document-discussions';

interface UseDiscussionDataProps {
    documentId: string;
}

interface UseDiscussionDataReturn {
    discussions: TDiscussion[];
    users: Record<string, UserData>;
    currentUser: UserData | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useDiscussionData({ documentId }: UseDiscussionDataProps): UseDiscussionDataReturn {
    const [discussions, setDiscussions] = useState<TDiscussion[]>([]);
    const [users, setUsers] = useState<Record<string, UserData>>({});
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadDiscussionData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Load all data in parallel
            const [discussionsData, usersData, currentUserData] = await Promise.all([
                getDocumentDiscussions(documentId),
                getDiscussionUsers(documentId),
                getCurrentUserForDiscussion(),
            ]);

            setDiscussions(discussionsData);
            setUsers(usersData);
            setCurrentUser(currentUserData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load discussion data';
            setError(errorMessage);
            toast.error('Failed to load discussions');
            console.error('Error loading discussion data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (documentId) {
            loadDiscussionData();
        }
    }, [documentId]);

    return {
        discussions,
        users,
        currentUser,
        isLoading,
        error,
        refetch: loadDiscussionData,
    };
}
