import { AppLayout } from '@/components/app-layout';
import { getUserProfile } from '@/lib/auth/auth-utils';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userProfile = await getUserProfile();

  return <AppLayout userProfile={userProfile}>{children}</AppLayout>;
}
