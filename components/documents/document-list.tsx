'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
} from '@dnd-kit/core';
import { FileText, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { toast } from 'sonner';

import { moveDocument } from '@/actions/documents/move-document';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import type { DocumentWithAuthor } from '@/data/documents/get-folders';

import { CreateDocumentForm } from './create-document-form';
import { DocumentCard } from './document-card';
import { DocumentsFilter } from './documents-filter';

interface DocumentListProps {
  _documentsPromise: Promise<DocumentWithAuthor[]>;
  selectedFolderId: string | null;
}


export function DocumentList({
  _documentsPromise,
  selectedFolderId,
}: DocumentListProps) {
  const router = useRouter();
  const [draggedDocument, setDraggedDocument] =
    useState<DocumentWithAuthor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const documents = use(_documentsPromise);

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.['type'] === 'document') {
      setDraggedDocument(event.active.data.current['document']);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setDraggedDocument(null);

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const document = active.data.current?.['document'];
    const targetFolderId =
      over.data.current?.['type'] === 'folder' ? (over.id as string) : null;

    if (!document) {
      return;
    }

    const result = await moveDocument({
      documentId: document.id,
      folderId: targetFolderId ?? undefined,
    });

    if (result.success) {
      toast.success('Document moved successfully');
      router.refresh();
    } else {
      toast.error('Failed to move document');
    }
  };

  const handleMoveDocument = async (
    documentId: string,
    folderId: string | null
  ) => {
    const result = await moveDocument({
      documentId,
      folderId: folderId ?? undefined,
    });

    if (result.success) {
      toast.success('Document moved successfully');
      router.refresh();
    } else {
      toast.error('Failed to move document');
    }
  };

  // Filter documents based on search and type
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
      !searchQuery ||
      (doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);

    const matchesType = filterType === 'all' || doc.documentType === filterType;

    return matchesSearch && matchesType;
  });

  const documentTypes = Array.from(
    new Set(documents.map(doc => doc.documentType))
  );

  return (
    <div className='h-full flex flex-col'>
      <DocumentsFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterType={filterType}
        onFilterChange={setFilterType}
        documentTypes={documentTypes}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedFolderId={selectedFolderId}
        onDocumentCreated={() => router.refresh()}
      />

      <div className='flex-1 overflow-y-auto p-4'>
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {filteredDocuments.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <FileText className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-medium mb-2'>No documents found</h3>
              <p className='text-muted-foreground mb-4'>
                {searchQuery || filterType !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first document to get started'}
              </p>
              <CreateDocumentForm
                selectedFolderId={selectedFolderId}
                onDocumentCreated={() => router.refresh()}
                trigger={
                  <Button>
                    <Plus className='h-4 w-4 mr-2' />
                    Create Document
                  </Button>
                }
              />
            </div>
          ) : (
            <div className={
              viewMode === 'list'
                ? "space-y-2"
                : "grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            }>
              {filteredDocuments.map(document => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onMove={handleMoveDocument}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          <DragOverlay>
            {draggedDocument ? (
              <Card className='w-80 shadow-lg'>
                <CardHeader className='pb-3'>
                  <div className='flex items-center gap-2'>
                    <FileText className='h-4 w-4' />
                    <CardTitle className='text-base font-medium truncate'>
                      {draggedDocument.title ?? 'Untitled Document'}
                    </CardTitle>
                  </div>
                </CardHeader>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
