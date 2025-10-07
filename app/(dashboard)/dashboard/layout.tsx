import { PageContainer } from '@/components/layout';

type DashboardLayoutProps = {
  children: React.ReactNode;
  stats: React.ReactNode;
  projectTrends: React.ReactNode;
  activityChart: React.ReactNode;
  myProjects: React.ReactNode;
  featured: React.ReactNode;
  techStack: React.ReactNode;
  actions: React.ReactNode;
};

export default function DashboardLayout({
  children,
  stats,
  projectTrends,
  activityChart,
  myProjects,
  featured,
  techStack,
  actions,
}: DashboardLayoutProps) {
  return (
    <PageContainer>
      {children}
      {stats}

      {/* Analytics & Trends Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {projectTrends}
        {activityChart}
      </div>

      {/* Projects Section */}
      {myProjects}
      {featured}

      {/* Tech Stack & Actions */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {techStack}
        <div className='lg:col-span-1'>{actions}</div>
      </div>
    </PageContainer>
  );
}
