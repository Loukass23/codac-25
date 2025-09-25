import { DocumentEditorController } from '@/components/editor/document-editor-controller';
import { DocumentEditor } from '@/components/editor/document-editor';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { VerticalToolbar } from '@/components/ui/vertical-toolbar';
import { VerticalToolbarButtonsWithNames } from '@/components/ui/vertical-toolbar-buttons-with-names';
import { getDocumentById } from '@/data/documents/get-document';
import { requireServerAuth } from '@/lib/auth/auth-server';

interface DocumentSidePanelPageProps {
  params: Promise<{
    docId: string;
  }>;
}
const SIDE_PANEL_DEFAULT_SIZE = 15;
const MAIN_PANEL_DEFAULT_SIZE = 100 - SIDE_PANEL_DEFAULT_SIZE;

const SIDE_PANEL_MIN_SIZE = 10;
const SIDE_PANEL_MAX_SIZE = 25;

const MAIN_PANEL_MAX_SIZE = 100 - SIDE_PANEL_MIN_SIZE;
const MAIN_PANEL_MIN_SIZE = 100 - SIDE_PANEL_MAX_SIZE;

export default async function DocumentPage({
  params,
}: DocumentSidePanelPageProps) {
  const { docId } = await params;
  const user = await requireServerAuth();
  const _documentPromise = getDocumentById(docId);

  return (
    <div className='min-h-screen bg-background'>
      <DocumentEditorController>
        <ResizablePanelGroup direction='horizontal' className='h-full w-full'>
          <ResizablePanel
            defaultSize={SIDE_PANEL_DEFAULT_SIZE}
            minSize={SIDE_PANEL_MIN_SIZE}
            maxSize={SIDE_PANEL_MAX_SIZE}
          >
            <VerticalToolbar>
              <VerticalToolbarButtonsWithNames />
            </VerticalToolbar>
          </ResizablePanel>

          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={MAIN_PANEL_DEFAULT_SIZE}
            minSize={MAIN_PANEL_MIN_SIZE}
            maxSize={MAIN_PANEL_MAX_SIZE}
          >
            <DocumentEditor
              documentId={docId}
              user={{
                id: user.id,
                name: user.name ?? '',
                avatarUrl: user.avatar ?? '',
              }}
              _documentPromise={_documentPromise}
              autoSave={false}
              saveDelay={5000}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </DocumentEditorController>
    </div>
  );
}
