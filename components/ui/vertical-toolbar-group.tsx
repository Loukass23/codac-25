'use client';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export function VerticalToolbarGroup({
  children,
  className,
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'group/toolbar-group',
        'relative hidden has-[button]:flex',
        'flex-col w-full gap-1',
        className
      )}
    >
      <div className='flex flex-col w-full items-center gap-1'>{children}</div>

      <div className='my-1.5 mx-0.5 group-last/toolbar-group:hidden!'>
        <Separator orientation='horizontal' />
      </div>
    </div>
  );
}
