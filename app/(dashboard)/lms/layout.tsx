import { Metadata } from 'next';
import { Suspense } from 'react';

import { LMSNavigationDB } from '@/components/lms/lms-navigation-db';
import { LMSSkeleton } from '@/components/lms/lms-skeleton';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { getLMSNavigation } from '@/data/documents/get-lms-documents';

export const metadata: Metadata = {
  title: 'Learning Management System',
  description: 'Access your courses and learning materials',
};

async function LMSNavigationWrapper() {
  const navigation = await getLMSNavigation();
  console.log("navigation", navigation);
  return <LMSNavigationDB navigation={navigation} />;
}

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-background'>
      <div className='h-[calc(100vh-4rem)]'>
        <ResizablePanelGroup direction='horizontal' className='h-full'>
          {/* Left Panel - Navigation (Persistent) */}
          <ResizablePanel
            defaultSize={20}
            minSize={15}
            maxSize={40}
            className='border-r bg-background'
          >
            <Suspense fallback={<LMSSkeleton />}>
              <LMSNavigationWrapper />
            </Suspense>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Content (Updates on route change) */}
          <ResizablePanel defaultSize={75} minSize={60}>
            <div className='h-full overflow-y-auto'>{children}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
