import { Suspense } from 'react';

import { DocumentList } from '@/components/documents/document-list';
import { FolderNavigation } from '@/components/documents/folder-navigation';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import {
  getDocumentsInFolder,
  getFolderTreeWithDocuments,
} from '@/data/documents/get-folders';
import { requireServerAuth } from '@/lib/auth/auth-server';
import { VerticalToolbarSkeleton } from '@/components/skeleton/vertical-toolbar-skeletob';

interface DocumentsPageProps {
  searchParams: Promise<{
    folder?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function DocumentsPage({
  searchParams,
}: DocumentsPageProps) {
  const user = await requireServerAuth();
  const params = await searchParams;
  const selectedFolderId = params.folder ?? null;

  // Fetch folders and documents
  const _treeDataPromise = getFolderTreeWithDocuments(user.id);
  const _documentsPromise = getDocumentsInFolder(
    selectedFolderId,
    user.id,
    50,
    0
  );

  return (
    <div className='min-h-screen bg-background'>
      <ResizablePanelGroup direction='horizontal' className='h-full w-full'>
        <ResizablePanel
          defaultSize={25}
          minSize={20}
          maxSize={40}
          className='border-r'
        >
          <FolderNavigation
            _treeDataPromise={_treeDataPromise}
            selectedFolderId={selectedFolderId}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={75} minSize={60} maxSize={80}>
          <DocumentList
            _documentsPromise={_documentsPromise}
            selectedFolderId={selectedFolderId}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
