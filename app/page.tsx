import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth/auth-utils';

import { AnimatedLandingContent } from '../components/codac-brand/animated-landing-content';
import { AnimatedNavigation } from '../components/codac-brand/animated-navigation';
import { RetroGrid } from '../components/ui/retro-grid';

export default async function LandingPage() {
  // Check if user is authenticated and redirect to dashboard
  const user = await getCurrentUser();
  console.log('user', user);
  if (user) {
    redirect('/home');
  }
  return (
    <div className='relative flex h-screen w-full items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
      {/* Navigation */}
      <AnimatedNavigation />

      {/* Your content */}
      <Link
        href="/auth/signin"
        className='relative z-10 flex items-center justify-center h-full w-full cursor-pointer hover:bg-white/5 transition-colors duration-300'
      >
        <AnimatedLandingContent />
      </Link>

      {/* Retro grid background */}
      <RetroGrid
        angle={65}
        cellSize={60}
        opacity={0.5}
        lightLineColor='#00ff41'
        darkLineColor='#00ff41'
      />
      {/* <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-codac-pink/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-codac-teal/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div> */}
    </div>
  );
}
