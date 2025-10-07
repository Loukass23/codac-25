import { Skeleton } from '@/components/ui/skeleton';

export default function QuickActionsLoading() {
  return (
    <div className='border rounded-lg p-6'>
      <div className='space-y-2 mb-6'>
        <Skeleton className='h-6 w-32' />
        <Skeleton className='h-4 w-48' />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {[1, 2, 3].map(i => (
          <div key={i} className='border rounded-lg p-6 space-y-3'>
            <Skeleton className='h-8 w-8 mx-auto' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24 mx-auto' />
              <Skeleton className='h-3 w-32 mx-auto' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
