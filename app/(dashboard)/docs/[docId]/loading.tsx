import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function DocumentLoading() {
  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <div className='space-y-6'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
        </div>
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-8 w-8 rounded-full' />
          <div className='space-y-1'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-3 w-16' />
          </div>
        </div>
        <Separator />
        <div className='space-y-4'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-2/3' />
        </div>
      </div>
    </div>
  );
}
