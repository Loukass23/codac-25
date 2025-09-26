'use client';

import {
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconPalette,
  IconUserCircle,
} from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Suspense } from 'react';

import { ThemePicker } from '@/components/theme-picker';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function NavUserStreaming() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <NavUser />
    </Suspense>
  );
}

function ProfileSkeleton() {
  return (
    <div className='flex items-center gap-2 px-1 py-1.5'>
      <div className='h-8 w-8 rounded bg-muted animate-pulse' />
      <div className='flex-1 space-y-1'>
        <div className='h-4 bg-muted rounded animate-pulse' />
        <div className='h-3 bg-muted rounded w-3/4 animate-pulse' />
      </div>
    </div>
  );
}

function NavUser() {
  const { data: session, status } = useSession();
  const { isMobile } = useSidebar();

  console.log('NavUser - session:', session, 'status:', status);

  // Handle loading state (when session is still loading)
  if (status === 'loading') {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' disabled>
            <div className='h-8 w-8 rounded bg-muted animate-pulse' />
            <div className='flex-1 space-y-1'>
              <div className='h-4 bg-muted rounded animate-pulse' />
              <div className='h-3 bg-muted rounded w-3/4 animate-pulse' />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Handle unauthenticated state (when user is not logged in)
  if (!session?.user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild size='lg'>
            <Link href='/auth/signin' className='w-full justify-start'>
              Sign In
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const user = session.user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded'>
                <AvatarFallback className='rounded'>
                  {(
                    user.name?.charAt(0) ||
                    user.email?.charAt(0) ||
                    'U'
                  ).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>
                  {user.name || 'User'}
                </span>
                <span className='truncate text-xs text-muted-foreground'>
                  {user.email}
                </span>
                {user.role && (
                  <span className='truncate text-xs text-muted-foreground capitalize'>
                    {user.role.toLowerCase()}
                  </span>
                )}
              </div>
              <IconDotsVertical className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded'>
                  <AvatarFallback className='rounded'>
                    {(
                      user.name?.charAt(0) ||
                      user.email?.charAt(0) ||
                      'U'
                    ).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>
                    {user.name || 'User'}
                  </span>
                  <span className='truncate text-xs text-muted-foreground'>
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href='/profile' className='cursor-pointer'>
                  <IconUserCircle />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/profile/settings' className='cursor-pointer'>
                  <IconUserCircle />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <div className='flex items-center cursor-pointer'>
                  <IconPalette />
                  <span className='flex-1'>Theme</span>
                  <ThemePicker variant='dropdown' align='start' />
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='cursor-pointer'
              onSelect={event => {
                event.preventDefault();
                signOut({ callbackUrl: '/' });
              }}
            >
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
