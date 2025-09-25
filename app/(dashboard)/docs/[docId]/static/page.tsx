import { notFound } from 'next/navigation';
import { ServerDocumentViewer } from '@/components/editor/document-static-viewer';
import { getDocumentById } from '@/data/documents/get-document';

interface StaticDocumentPageProps {
  params: Promise<{
    docId: string;
  }>;
}

/**
 * Static document page using server-side rendering
 * This page demonstrates how to use the static editor in a real document context
 */
export default async function StaticDocumentPage({
  params,
}: StaticDocumentPageProps) {
  const { docId } = await params;

  try {
    const document = await getDocumentById(docId);

    return (
      <div className='container mx-auto p-6'>
        <div className='space-y-6'>
          {/* Document header */}
          <div className='space-y-2'>
            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
              <span>rendered statically</span>
              <span>
                created: {new Date(document.createdAt).toLocaleDateString()}
              </span>
              <span>
                updated: {new Date(document.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Document content rendered statically */}
          <div className='border rounded-lg'>
            <div className='p-6'>
              <ServerDocumentViewer
                document={document}
                className='prose max-w-none'
              />
            </div>
          </div>

          {/* Static rendering info */}
          {/* <div className='bg-muted/50 p-4 rounded-lg'>
            <h3 className='font-semibold mb-2'>Static Rendering Info</h3>
            <ul className='text-sm space-y-1 text-muted-foreground'>
              <li>• This content is rendered server-side using PlateStatic</li>
              <li>• No client-side JavaScript required for display</li>
              <li>• Optimized for performance and SEO</li>
              <li>• Compatible with React Server Components</li>
            </ul>
          </div> */}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading document:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: StaticDocumentPageProps) {
  const { docId } = await params;

  try {
    const document = await getDocumentById(docId);

    if (!document) {
      return {
        title: 'Document Not Found',
      };
    }

    return {
      title: `${document.title} (Static)`,
      description: document.description || 'Static document view',
    };
  } catch (error) {
    return {
      title: 'Document Error',
    };
  }
}
