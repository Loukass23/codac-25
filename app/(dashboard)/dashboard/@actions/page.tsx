import { Plus, Trophy, Users } from 'lucide-react';
import Link from 'next/link';

import { SectionErrorBoundary } from '@/components/error/section-error-boundary';
import { BrandButton } from '@/components/ui/brand-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function QuickActionsSlot() {
  return (
    <SectionErrorBoundary sectionName='quick actions'>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <BrandButton
              asChild
              variant='outline'
              className='h-auto flex-col gap-2 p-6'
            >
              <Link href='/projects/create'>
                <Plus className='h-8 w-8 text-primary' />
                <div className='text-center'>
                  <div className='font-medium'>Create Project</div>
                  <div className='text-xs text-muted-foreground'>
                    Start a new project
                  </div>
                </div>
              </Link>
            </BrandButton>

            <BrandButton
              asChild
              variant='outline'
              className='h-auto flex-col gap-2 p-6'
            >
              <Link href='/projects'>
                <Trophy className='h-8 w-8 text-chart-2' />
                <div className='text-center'>
                  <div className='font-medium'>Browse Projects</div>
                  <div className='text-xs text-muted-foreground'>
                    Explore community work
                  </div>
                </div>
              </Link>
            </BrandButton>

            <BrandButton
              asChild
              variant='outline'
              className='h-auto flex-col gap-2 p-6'
            >
              <Link href='/community'>
                <Users className='h-8 w-8 text-chart-3' />
                <div className='text-center'>
                  <div className='font-medium'>Connect</div>
                  <div className='text-xs text-muted-foreground'>
                    Network with community
                  </div>
                </div>
              </Link>
            </BrandButton>
          </div>
        </CardContent>
      </Card>
    </SectionErrorBoundary>
  );
}
