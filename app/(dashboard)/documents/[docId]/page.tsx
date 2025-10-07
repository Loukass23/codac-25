import { DocumentEditor } from '@/components/editor/document-editor';
import { DocumentEditorController } from '@/components/editor/document-editor-controller';
import { getDocumentById } from '@/data/documents/get-document';
import { requireServerAuth } from '@/lib/auth/auth-server';

interface DocumentPageProps {
  params: Promise<{
    docId: string;
  }>;
}

export default async function DocumentPage({
  params,
}: DocumentPageProps) {
  const { docId } = await params;
  const user = await requireServerAuth();
  const _documentPromise = getDocumentById(docId);

  return (
    <div className='min-h-screen bg-background'>
      <DocumentEditorController>
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
      </DocumentEditorController>
    </div>
  );
}
