import { TrendingUp } from 'lucide-react';

import { ProjectTrendsChart } from '@/components/dashboard/project-trends-chart';
import { SectionErrorBoundary } from '@/components/error/section-error-boundary';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getProjectTrends } from '@/data/projects/get-project-trends';

export const dynamic = 'force-dynamic';

export default async function ProjectTrendsSlot() {
  let trendData = await getProjectTrends();

  return (
    <SectionErrorBoundary sectionName='project trends'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <TrendingUp className='h-5 w-5 text-primary' />
                Project Growth
              </CardTitle>
              <CardDescription>
                Project creation trends over the last 6 months
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {trendData.length > 0 ? (
            <ProjectTrendsChart data={trendData} />
          ) : (
            <div className='flex h-[300px] items-center justify-center text-muted-foreground'>
              No trend data available
            </div>
          )}
        </CardContent>
      </Card>
    </SectionErrorBoundary>
  );
}
