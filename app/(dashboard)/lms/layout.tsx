import { Metadata } from 'next';
import { Suspense } from 'react';

import { LMSFolderNavigation } from '@/components/lms/lms-folder-navigation';
import { VerticalToolbarSkeleton } from '@/components/skeleton/vertical-toolbar-skeletob';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { getLMSNavigation } from '@/data/lms/get-lms-documents';

export const metadata: Metadata = {
  title: 'Learning Management System',
  description: 'Access your courses and learning materials',
};

interface LMSLayoutProps {
  children: React.ReactNode;
  searchParams?: Promise<{
    folder?: string;
    search?: string;
    page?: string;
  }>;
}

const SIDE_PANEL_DEFAULT_SIZE = 25;
const MAIN_PANEL_DEFAULT_SIZE = 100 - SIDE_PANEL_DEFAULT_SIZE;

const SIDE_PANEL_MIN_SIZE = 15;
const SIDE_PANEL_MAX_SIZE = 30;

const MAIN_PANEL_MAX_SIZE = 100 - SIDE_PANEL_MIN_SIZE;
const MAIN_PANEL_MIN_SIZE = 100 - SIDE_PANEL_MAX_SIZE;

// async function LMSNavigationWrapper({ currentSlug }: { currentSlug?: string }) {
//   const _navigationPromise = getLMSNavigation();

//   return (
//     <LMSFolderNavigation
//       _navigationPromise={_navigationPromise}
//       currentSlug={currentSlug}
//     />
//   );
// }

// LMS content is now handled by the dynamic route [slug] pages

export default async function LMSLayout({
  children,
  searchParams,
}: LMSLayoutProps) {
  let currentSlug: string | undefined = undefined;

  try {
    if (searchParams) {
      const params = await searchParams;
      currentSlug = params?.slug as string;
    }
  } catch (_error) {
    // If there's an error parsing search params, default to no slug
    currentSlug = undefined;
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='h-[calc(100vh-4rem)]'>
        <ResizablePanelGroup direction='horizontal' className='h-full w-full'>
          <ResizablePanel
            defaultSize={SIDE_PANEL_DEFAULT_SIZE}
            minSize={SIDE_PANEL_MIN_SIZE}
            maxSize={SIDE_PANEL_MAX_SIZE}
            className='border-r'
          >
            <Suspense fallback={<VerticalToolbarSkeleton />}>
              {/* <LMSNavigationWrapper currentSlug={currentSlug} /> */}
            </Suspense>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            defaultSize={MAIN_PANEL_DEFAULT_SIZE}
            minSize={MAIN_PANEL_MIN_SIZE}
            maxSize={MAIN_PANEL_MAX_SIZE}
          >
            <Suspense
              fallback={<div className='p-4'>Loading LMS content...</div>}
            >
              {children}
            </Suspense>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
