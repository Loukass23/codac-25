import { TrendingUp } from 'lucide-react';

import { CohortTimelineChart } from '@/components/dashboard/cohort-timeline-chart';
import { SectionErrorBoundary } from '@/components/error/section-error-boundary';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCohortTimeline } from '@/data/cohort/get-cohort-stats';

export const dynamic = 'force-dynamic';

export default async function CohortTimelineSlot() {
  let timelineData = await getCohortTimeline();

  return (
    <SectionErrorBoundary sectionName='cohort timeline'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <TrendingUp className='h-5 w-5 text-primary' />
                Enrollment Timeline
              </CardTitle>
              <CardDescription>
                Student enrollments and graduations over 6 months
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {timelineData.length > 0 ? (
            <CohortTimelineChart data={timelineData} />
          ) : (
            <div className='flex h-[300px] items-center justify-center text-muted-foreground'>
              No timeline data available
            </div>
          )}
        </CardContent>
      </Card>
    </SectionErrorBoundary>
  );
}
