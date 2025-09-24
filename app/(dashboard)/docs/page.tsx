import { FileText, Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { PageErrorBoundary, SectionErrorBoundary } from '@/components/error';
import { Grid, PageContainer, Section } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { BrandButton } from '@/components/ui/brand-button';
import { BrandHeader } from '@/components/ui/brand-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getUserDocuments,
  getDocumentStats,
  type DocumentWithAuthor,
} from '@/data/projects/get-documents';
import { requireServerAuth } from '@/lib/auth/auth-server';

export const dynamic = 'force-dynamic';

interface DocumentsPageProps {
  searchParams: {
    type?: string;
    search?: string;
    page?: string;
  };
}

function DocumentCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
          <Skeleton className='h-6 w-16' />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className='h-4 w-full mb-2' />
        <Skeleton className='h-4 w-2/3' />
        <div className='flex items-center justify-between mt-4'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-20' />
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentCard({ document }: { document: DocumentWithAuthor }) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const getDocumentTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      project_summary: 'Project Summary',
      community_post: 'Community Post',
      lesson_content: 'Lesson Content',
      personal_note: 'Personal Note',
      draft: 'Draft',
    };
    return (
      typeMap[type] ??
      type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    );
  };

  const getDocumentTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      project_summary: 'bg-blue-100 text-blue-800',
      community_post: 'bg-green-100 text-green-800',
      lesson_content: 'bg-purple-100 text-purple-800',
      personal_note: 'bg-gray-100 text-gray-800',
      draft: 'bg-yellow-100 text-yellow-800',
    };
    return colorMap[type] ?? 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='space-y-1'>
            <CardTitle className='text-lg'>
              {document.title ?? 'Untitled Document'}
            </CardTitle>
            {document.description && (
              <CardDescription className='line-clamp-2'>
                {document.description}
              </CardDescription>
            )}
          </div>
          <Badge
            variant='secondary'
            className={getDocumentTypeColor(document.documentType)}
          >
            {getDocumentTypeLabel(document.documentType)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {document.project && (
            <div className='text-sm text-muted-foreground'>
              <span className='font-medium'>Project:</span>{' '}
              {document.project.title}
            </div>
          )}

          <div className='flex items-center justify-between text-sm text-muted-foreground'>
            <span>Created {formatDate(document.createdAt)}</span>
            <div className='flex items-center gap-2'>
              {document.isPublished ? (
                <Badge
                  variant='outline'
                  className='text-green-600 border-green-600'
                >
                  Published
                </Badge>
              ) : (
                <Badge
                  variant='outline'
                  className='text-orange-600 border-orange-600'
                >
                  Draft
                </Badge>
              )}
              <span>v{document.version}</span>
            </div>
          </div>

          <div className='flex gap-2 pt-2'>
            <BrandButton asChild variant='outline' size='sm' className='flex-1'>
              <Link href={`/docs/${document.id}`}>
                <FileText className='h-4 w-4 mr-2' />
                View
              </Link>
            </BrandButton>
            {!document.isPublished && (
              <BrandButton
                asChild
                variant='outline'
                size='sm'
                className='flex-1'
              >
                <Link href={`/docs/${document.id}/edit`}>
                  <Plus className='h-4 w-4 mr-2' />
                  Edit
                </Link>
              </BrandButton>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

async function DocumentsList({
  userId,
  documentType,
  search,
}: {
  userId: string;
  documentType?: string;
  search?: string;
}) {
  const documents = await getUserDocuments(userId, documentType, 50, 0);

  // Filter documents by search term if provided
  const filteredDocuments = search
    ? documents.filter(
        doc =>
          (doc.title?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
          (doc.description?.toLowerCase().includes(search.toLowerCase()) ??
            false)
      )
    : documents;

  if (filteredDocuments.length === 0) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center justify-center p-12'>
          <FileText className='h-16 w-16 text-muted-foreground mb-4' />
          <h3 className='text-lg font-semibold mb-2'>
            {search ? 'No documents found' : 'No documents yet'}
          </h3>
          <p className='text-muted-foreground text-center mb-6'>
            {search
              ? 'Try adjusting your search terms or filters'
              : 'Start creating your first document to get started'}
          </p>
          {!search && (
            <BrandButton variant='gradient'>
              <Plus className='h-4 w-4 mr-2' />
              Create Your First Document
            </BrandButton>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid cols='2'>
      {filteredDocuments.map(document => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </Grid>
  );
}

export default async function DocumentsPage({
  searchParams,
}: DocumentsPageProps) {
  const user = await requireServerAuth();
  const { type: documentType, search } = searchParams;

  // Get document stats for the user
  const stats = await getDocumentStats(undefined, user.id);

  return (
    <PageErrorBoundary pageName='Documents'>
      <PageContainer>
        <BrandHeader
          variant='gradient'
          size='lg'
          title='My Documents'
          subtitle='Manage and organize your documents'
          showLogo={true}
          logoSize='xl'
        />

        {/* Quick Stats */}
        <Section>
          <Grid cols='4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Documents
                </CardTitle>
                <FileText className='h-4 w-4 text-codac-pink' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-codac-pink'>
                  {stats.totalDocuments}
                </div>
                <p className='text-xs text-muted-foreground'>All documents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Published</CardTitle>
                <FileText className='h-4 w-4 text-green-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-green-600'>
                  {stats.publishedDocuments}
                </div>
                <p className='text-xs text-muted-foreground'>
                  Public documents
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Drafts</CardTitle>
                <FileText className='h-4 w-4 text-orange-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-orange-600'>
                  {stats.totalDocuments - stats.publishedDocuments}
                </div>
                <p className='text-xs text-muted-foreground'>
                  Work in progress
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Versions</CardTitle>
                <FileText className='h-4 w-4 text-blue-600' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-blue-600'>
                  {stats.totalVersions}
                </div>
                <p className='text-xs text-muted-foreground'>Total versions</p>
              </CardContent>
            </Card>
          </Grid>
        </Section>

        {/* Search and Filters */}
        <Section>
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>
                Find and organize your documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex gap-4'>
                <div className='flex-1'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                      placeholder='Search documents...'
                      className='pl-10'
                      defaultValue={search}
                    />
                  </div>
                </div>
                <BrandButton variant='outline'>
                  <Filter className='h-4 w-4 mr-2' />
                  Filter
                </BrandButton>
                <BrandButton variant='gradient'>
                  <Plus className='h-4 w-4 mr-2' />
                  New Document
                </BrandButton>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* Documents List */}
        <Section>
          <SectionErrorBoundary sectionName='documents list'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>
                  {documentType
                    ? `${documentType.replace(/_/g, ' ')} Documents`
                    : 'All Documents'}
                </h2>
                <p className='text-muted-foreground'>
                  {search
                    ? `Search results for "${search}"`
                    : 'Your document collection'}
                </p>
              </div>
            </div>

            <Suspense
              fallback={
                <Grid cols='2'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <DocumentCardSkeleton key={i} />
                  ))}
                </Grid>
              }
            >
              <DocumentsList
                userId={user.id}
                documentType={documentType}
                search={search}
              />
            </Suspense>
          </SectionErrorBoundary>
        </Section>
      </PageContainer>
    </PageErrorBoundary>
  );
}
