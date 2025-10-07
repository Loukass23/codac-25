'use client';

import { ChevronDown, Settings } from 'lucide-react';
import Link from 'next/link';

import { AppBreadcrumb } from '@/components/app-breadcrumb';
import CodacLeftAngleBracket from '@/components/codac-brand/codac-left-angle-bracket';
import { NotificationDropdown } from '@/components/notifications/notification-dropdown';
import { ThemePicker } from '@/components/theme-picker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { UserProfile } from '../lib/auth/auth-utils';

interface AppHeaderProps {
  userProfile: UserProfile | null;
}

export function AppHeader({ userProfile }: AppHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6'
      )}
    >
      <div className='container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4'>
        {/* Left side */}
        <div className='flex items-center gap-2'>
          <SidebarTrigger className='-ml-1' />
          <AppBreadcrumb />
        </div>

        {/* Right side */}
        <div className='flex items-center gap-4'>
          <ThemePicker variant='dropdown' align='end' />
          {userProfile && <NotificationDropdown />}

          {userProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='h-9 px-2 py-0 hover:bg-accent hover:text-accent-foreground'
                >
                  <Avatar className='h-7 w-7'>
                    <AvatarImage
                      src={userProfile.avatar ?? ''}
                      alt={userProfile.name ?? 'codac member'}
                    />
                    <AvatarFallback className='text-xs'>
                      <CodacLeftAngleBracket size='sm' animated />
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className='h-3 w-3 ml-1' />
                  <span className='sr-only'>User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel>
                  <div className='flex flex-col space-y-1'>
                    {userProfile.name && (
                      <p className='text-sm font-medium leading-none'>
                        {userProfile.name}
                      </p>
                    )}
                    {userProfile.email && (
                      <p className='text-xs leading-none text-muted-foreground'>
                        {userProfile.email}
                      </p>
                    )}
                    {userProfile.role && (
                      <p className='text-xs text-muted-foreground capitalize'>
                        {userProfile.role.toLowerCase()}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href='/profile/settings'>
                    <Settings className='mr-2 h-4 w-4' />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href='/auth/signout'>
                    <span>Sign out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
