'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { getUser } from '@/data/user/get-user';

export function useUserAvatar() {
  const { data: session } = useSession();
  const user = session?.user;
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user avatar from database to ensure consistency with profile
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          const result = await getUser(user.id);
          if (result.success && result.data?.avatar) {
            setUserAvatar(result.data.avatar);
          } else {
            setUserAvatar(undefined);
          }
        } catch (error) {
          console.error('Failed to fetch user avatar:', error);
          setUserAvatar(undefined);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUserAvatar(undefined);
      }
    };

    fetchUserAvatar();
  }, [user?.id]);

  const refreshAvatar = async () => {
    if (user?.id) {
      setIsLoading(true);
      try {
        const result = await getUser(user.id);
        if (result.success && result.data?.avatar) {
          setUserAvatar(result.data.avatar);
        } else {
          setUserAvatar(undefined);
        }
      } catch (error) {
        console.error('Failed to refresh user avatar:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    userAvatar,
    isLoading,
    refreshAvatar,
    // Fallback to session image if no database avatar
    displayAvatar: userAvatar || user?.image || undefined,
  };
}
