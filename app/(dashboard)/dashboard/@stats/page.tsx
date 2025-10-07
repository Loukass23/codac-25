import { Code, Star, Trophy, Users } from 'lucide-react';

import { Grid, Section } from '@/components/layout';
import {
  BrandCard,
  BrandCardContent,
  BrandCardHeader,
  BrandCardTitle,
} from '@/components/ui/brand-card';
import { getProjectStats } from '@/data/projects/get-project-stats';
import { getUserProjects } from '@/data/projects/get-projects';

export const dynamic = 'force-dynamic';

export default async function StatsSlot() {
  let userProjects: Awaited<ReturnType<typeof getUserProjects>> = [];
  let stats: Awaited<ReturnType<typeof getProjectStats>> = {
    totalStudents: 0,
    totalProjects: 0,
    totalSkills: 0,
    featuredProjects: 0,
    activeStudents: 0,
    newThisMonth: 0,
  };

  try {
    [userProjects, stats] = await Promise.all([
      getUserProjects(),
      getProjectStats(),
    ]);
  } catch (error) {
    console.error('Error loading stats:', error);
    // Fallback data already set above
  }

  return (
    <Section>
      <Grid cols='4'>
        <BrandCard variant='outline'>
          <BrandCardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <BrandCardTitle className='text-sm font-medium'>
              My Projects
            </BrandCardTitle>
            <Code className='h-4 w-4 text-primary' />
          </BrandCardHeader>
          <BrandCardContent>
            <div className='text-2xl font-bold text-primary'>
              {userProjects.length}
            </div>
            <p className='text-xs text-muted-foreground'>
              {userProjects.filter(p => p.isPublic).length} public
            </p>
          </BrandCardContent>
        </BrandCard>

        <BrandCard variant='teal'>
          <BrandCardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <BrandCardTitle className='text-sm font-medium'>
              Community Projects
            </BrandCardTitle>
            <Trophy className='h-4 w-4 text-chart-2' />
          </BrandCardHeader>
          <BrandCardContent>
            <div className='text-2xl font-bold text-chart-2'>
              {stats.totalProjects}
            </div>
            <p className='text-xs text-muted-foreground'>
              {stats.featuredProjects} featured
            </p>
          </BrandCardContent>
        </BrandCard>

        <BrandCard variant='pink'>
          <BrandCardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <BrandCardTitle className='text-sm font-medium'>
              Active Students
            </BrandCardTitle>
            <Users className='h-4 w-4 text-chart-3' />
          </BrandCardHeader>
          <BrandCardContent>
            <div className='text-2xl font-bold text-chart-3'>
              {stats.activeStudents}
            </div>
            <p className='text-xs text-muted-foreground'>Building projects</p>
          </BrandCardContent>
        </BrandCard>

        <BrandCard variant='gradient'>
          <BrandCardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <BrandCardTitle className='text-sm font-medium text-white'>
              This Month
            </BrandCardTitle>
            <Star className='h-4 w-4 text-white' />
          </BrandCardHeader>
          <BrandCardContent>
            <div className='text-2xl font-bold text-white'>
              {stats.newThisMonth}
            </div>
            <p className='text-xs text-white/80'>New projects</p>
          </BrandCardContent>
        </BrandCard>
      </Grid>
    </Section>
  );
}
