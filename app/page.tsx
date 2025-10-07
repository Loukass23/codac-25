import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth/auth-utils';

import { AnimatedLandingContent } from '../components/codac-brand/animated-landing-content';
import { RetroGrid } from '../components/ui/retro-grid';

export default async function LandingPage() {
  // Check if user is authenticated and redirect to dashboard
  const user = await getCurrentUser();
  console.log('user', user);
  if (user) {
    redirect('/dashboard');
  }
  return (
    <div className='relative flex h-screen w-full items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
      <Link
        href='/auth/signin'
        className='relative z-10 flex items-center justify-center h-full w-full cursor-pointer hover:bg-white/5 transition-colors duration-300'
      >
        <AnimatedLandingContent />
      </Link>

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
