import { Code2 } from 'lucide-react';

import { TechStackChart } from '@/components/dashboard/tech-stack-chart';
import { SectionErrorBoundary } from '@/components/error/section-error-boundary';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getTechStackDistribution } from '@/data/projects/get-project-trends';

export const dynamic = 'force-dynamic';

export default async function TechStackSlot() {
  let techStackData = await getTechStackDistribution();

  return (
    <SectionErrorBoundary sectionName='tech stack distribution'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Code2 className='h-5 w-5 text-primary' />
                Popular Technologies
              </CardTitle>
              <CardDescription>
                Most used tech stack across all projects
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {techStackData.length > 0 ? (
            <TechStackChart data={techStackData} />
          ) : (
            <div className='flex h-[300px] items-center justify-center text-muted-foreground'>
              No tech stack data available
            </div>
          )}
        </CardContent>
      </Card>
    </SectionErrorBoundary>
  );
}
