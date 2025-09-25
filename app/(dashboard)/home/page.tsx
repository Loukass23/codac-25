import { Users, Trophy, Plus, Code, Star } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Grid, PageContainer, Section } from '@/components/layout';
import { ProjectCard } from '@/components/projects/project-card';
import { BrandButton } from '@/components/ui/brand-button';
import {
  BrandCard,
  BrandCardContent,
  BrandCardHeader,
  BrandCardTitle,
} from '@/components/ui/brand-card';
import { BrandHeader } from '@/components/ui/brand-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getProjectStats } from '@/data/projects/get-project-stats';
import { getFeaturedProjects } from '@/data/projects/get-projects';
import { getUserProjects } from '@/data/projects/get-projects';
import { getUser } from '@/data/user/get-user';
import { requireServerAuth } from '@/lib/auth/auth-server';
import { SectionErrorBoundary } from '../../../components/error/section-error-boundary';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const authUser = await requireServerAuth();

  const result = await getUser(authUser.id);

  if (!result.success || !result.data) {
    // User has valid session but no database record - redirect to signout to clear session
    redirect('/auth/signout?callbackUrl=/auth/signin');
  }

  const user = result.data;
  let userProjects: Awaited<ReturnType<typeof getUserProjects>> = [];
  let featuredProjects: Awaited<ReturnType<typeof getFeaturedProjects>> = [];
  let stats: Awaited<ReturnType<typeof getProjectStats>> = {
    totalStudents: 0,
    totalProjects: 0,
    totalSkills: 0,
    featuredProjects: 0,
    activeStudents: 0,
    newThisMonth: 0,
  };

  try {
    [userProjects, featuredProjects, stats] = await Promise.all([
      getUserProjects(),
      getFeaturedProjects(3),
      getProjectStats(),
    ]);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    // Fallback data already set above
  }

  return (
    <PageContainer>
      <BrandHeader
        variant='gradient'
        size='lg'
        title={`Welcome back, ${user.name}!`}
        subtitle='Manage your projects and explore the community showcase'
        showLogo={true}
        logoSize='xl'
      />

      <div className='flex justify-end mb-6'>
        <Link href='/projects/create'>
          <BrandButton variant='gradient'>
            <Plus className='h-4 w-4 mr-2' />
            New Project
          </BrandButton>
        </Link>
      </div>
      {/* Quick Stats */}
      <Section>
        <Grid cols='4'>
          <BrandCard variant='outline'>
            <BrandCardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <BrandCardTitle className='text-sm font-medium'>
                My Projects
              </BrandCardTitle>
              <Code className='h-4 w-4 text-codac-pink' />
            </BrandCardHeader>
            <BrandCardContent>
              <div className='text-2xl font-bold text-codac-pink'>
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
              <Trophy className='h-4 w-4 text-codac-teal-dark' />
            </BrandCardHeader>
            <BrandCardContent>
              <div className='text-2xl font-bold text-codac-teal-dark'>
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
              <Users className='h-4 w-4 text-codac-pink-dark' />
            </BrandCardHeader>
            <BrandCardContent>
              <div className='text-2xl font-bold text-codac-pink-dark'>
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

      {/* My Projects */}
      <Section>
        <SectionErrorBoundary sectionName='my projects'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>My Projects</h2>
              <p className='text-muted-foreground'>Your latest project work</p>
            </div>
            <Link href='/projects/my'>
              <BrandButton variant='outline'>View All</BrandButton>
            </Link>
          </div>

          {userProjects.length > 0 ? (
            <Grid cols='3'>
              {userProjects.slice(0, 3).map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  showEditActions={true}
                />
              ))}
            </Grid>
          ) : (
            <Card>
              <CardContent className='flex flex-col items-center justify-center p-12'>
                <Code className='h-16 w-16 text-muted-foreground mb-4' />
                <h3 className='text-lg font-semibold mb-2'>No projects yet</h3>
                <p className='text-muted-foreground text-center mb-6'>
                  Start building your portfolio by creating your first project
                </p>
                <Link href='/projects/create'>
                  <BrandButton variant='gradient'>
                    <Plus className='h-4 w-4 mr-2' />
                    Create Your First Project
                  </BrandButton>
                </Link>
              </CardContent>
            </Card>
          )}
        </SectionErrorBoundary>
      </Section>

      {/* Featured Community Projects */}
      {featuredProjects.length > 0 && (
        <Section>
          <SectionErrorBoundary sectionName='featured projects'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>
                  Featured Projects
                </h2>
                <p className='text-muted-foreground'>
                  Discover amazing work from the community
                </p>
              </div>
              <Link href='/showcase'>
                <BrandButton variant='outline'>View Showcase</BrandButton>
              </Link>
            </div>

            <Grid cols='3'>
              {featuredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </Grid>
          </SectionErrorBoundary>
        </Section>
      )}

      {/* Quick Actions */}
      <Section bottomSpacing='none'>
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
                    <Plus className='h-8 w-8 text-codac-pink' />
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
                    <Trophy className='h-8 w-8 text-codac-teal' />
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
                    <Users className='h-8 w-8 text-codac-pink' />
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
      </Section>
    </PageContainer>
  );
}
