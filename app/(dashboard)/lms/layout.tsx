import { Metadata } from 'next';
import { Suspense } from 'react';

import { FolderNavigation } from '@/components/documents/folder-navigation';
import { LMSDocumentList } from '@/components/lms/lms-document-list';
import { VerticalToolbarSkeleton } from '@/components/skeleton/vertical-toolbar-skeletob';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  getLMSFolderTreeWithDocuments,
  getLMSDocumentsInFolder,
} from '@/data/documents/get-folders';
import { requireServerAuth } from '@/lib/auth/auth-server';

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

async function LMSNavigationWrapper({
  selectedFolderId,
}: {
  selectedFolderId: string | null;
}) {
  const user = await requireServerAuth();
  const _treeDataPromise = getLMSFolderTreeWithDocuments(user.id);

  return (
    <FolderNavigation
      _treeDataPromise={_treeDataPromise}
      selectedFolderId={selectedFolderId}
    />
  );
}

async function LMSContentWrapper({
  selectedFolderId,
}: {
  selectedFolderId: string | null;
}) {
  const user = await requireServerAuth();
  const _documentsPromise = getLMSDocumentsInFolder(
    selectedFolderId,
    user.id,
    50,
    0
  );

  return (
    <LMSDocumentList
      _documentsPromise={_documentsPromise}
      selectedFolderId={selectedFolderId}
    />
  );
}

export default async function LMSLayout({
  children,
  searchParams
}: LMSLayoutProps) {
  let selectedFolderId: string | null = null;

  try {
    if (searchParams) {
      const params = await searchParams;
      selectedFolderId = params?.folder ?? null;
    }
  } catch (_error) {
    // If there's an error parsing search params, default to no folder selected
    selectedFolderId = null;
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
              <LMSNavigationWrapper selectedFolderId={selectedFolderId} />
            </Suspense>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            defaultSize={MAIN_PANEL_DEFAULT_SIZE}
            minSize={MAIN_PANEL_MIN_SIZE}
            maxSize={MAIN_PANEL_MAX_SIZE}
          >
            <Suspense fallback={<div className="p-4">Loading LMS content...</div>}>
              {children ?? <LMSContentWrapper selectedFolderId={selectedFolderId} />}
            </Suspense>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
