import { Activity } from 'lucide-react';

import { ActivityChart } from '@/components/dashboard/activity-chart';
import { SectionErrorBoundary } from '@/components/error/section-error-boundary';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getActivityTrends } from '@/data/projects/get-project-trends';

export const dynamic = 'force-dynamic';

export default async function ActivityChartSlot() {
  let activityData = await getActivityTrends();

  return (
    <SectionErrorBoundary sectionName='activity chart'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Activity className='h-5 w-5 text-primary' />
                Community Activity
              </CardTitle>
              <CardDescription>
                Platform engagement over the last 4 weeks
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activityData.length > 0 ? (
            <ActivityChart data={activityData} />
          ) : (
            <div className='flex h-[300px] items-center justify-center text-muted-foreground'>
              No activity data available
            </div>
          )}
        </CardContent>
      </Card>
    </SectionErrorBoundary>
  );
}
