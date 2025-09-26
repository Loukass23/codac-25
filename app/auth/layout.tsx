import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - CODAC',
  description:
    'Sign in to your CODAC account to access your learning dashboard and community.',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-background to-muted'>
      {children}
    </div>
  );
}
