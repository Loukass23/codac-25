import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CohortTimelineLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-48' />
        <Skeleton className='h-4 w-64' />
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          <Skeleton className='h-[300px] w-full' />
        </div>
      </CardContent>
    </Card>
  );
}
