import type { Metadata } from 'next';
import { RetroGrid } from '../../components/ui/retro-grid';

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
    <div className='relative flex h-screen w-full items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>

      <div className='container relative z-10 flex items-center justify-center h-full w-lg min-w-lg opacity-80'>

        {children}

      </div>

      {/* Retro grid background */}
      <RetroGrid
        angle={65}
        cellSize={60}
        opacity={0.5}
        lightLineColor='#00ff41'
        darkLineColor='#00ff41'
      />

    </div>
  );
}
