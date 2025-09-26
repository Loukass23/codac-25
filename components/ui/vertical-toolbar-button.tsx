'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { ToolbarButton } from './toolbar';

interface VerticalToolbarButtonProps {
  children: React.ReactNode;
  tooltip?: string;
  className?: string;
  onClick?: () => void;
  pressed?: boolean;
  disabled?: boolean;
  name: string;
}

export function VerticalToolbarButton({
  children,
  tooltip,
  className,
  onClick,
  pressed,
  disabled,
  name,
}: VerticalToolbarButtonProps) {
  return (
    <ToolbarButton
      tooltip={tooltip}
      className={cn(
        'flex items-center gap-2 w-full justify-start h-auto p-2 rounded-md hover:bg-muted',
        pressed && 'bg-accent text-accent-foreground',
        className
      )}
      onClick={onClick}
      pressed={pressed}
      disabled={disabled}
    >
      <span className='flex-shrink-0 w-4 h-4 flex items-center justify-center'>
        {children}
      </span>
      <span className='text-sm font-medium truncate'>{name}</span>
    </ToolbarButton>
  );
}
