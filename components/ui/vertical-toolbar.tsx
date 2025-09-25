'use client';

import { cn } from '@/lib/utils';

import { Toolbar } from './toolbar';

export function VerticalToolbar(props: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar
      {...props}
      className={cn(
        'sticky top-0 left-0 z-50 scrollbar-hide h-full w-full justify-start overflow-y-auto rounded-l-lg border-r border-r-border bg-background/95 p-3 backdrop-blur-sm supports-backdrop-blur:bg-background/60 flex-col gap-2',
        props.className
      )}
    />
  );
}
