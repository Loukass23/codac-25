'use client';

import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    closestCenter,
    useDraggable,
} from '@dnd-kit/core';
import {
    BookOpen,
    Calendar,
    MoreVertical,
    GripVertical,
    Search,
    Filter,
    Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, use, useEffect } from 'react';
import { toast } from 'sonner';

import { moveDocument } from '@/actions/documents/move-document';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { DocumentWithAuthor } from '@/data/documents/get-folders';
import { cn } from '@/lib/utils';

interface LMSDocumentListProps {
    _documentsPromise: Promise<DocumentWithAuthor[]>;
    selectedFolderId: string | null;
}

interface LMSDocumentCardProps {
    document: DocumentWithAuthor;
    onMove: (documentId: string, folderId: string | null) => void;
}

function LMSDocumentCard({ document, onMove }: LMSDocumentCardProps) {
    const [isDragging, _setIsDragging] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: document.id,
        data: {
            type: 'document',
            document,
        },
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(date);
    };

    const getLMSDocumentTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            lms_lesson: 'bg-blue-100 text-blue-800',
            lms_module: 'bg-purple-100 text-purple-800',
            lms_course: 'bg-green-100 text-green-800',
            lms_assignment: 'bg-orange-100 text-orange-800',
            lms_quiz: 'bg-red-100 text-red-800',
            lms_resource: 'bg-yellow-100 text-yellow-800',
        };
        return colors[type] ?? colors['lms_lesson'];
    };

    const getLMSDocumentTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            lms_lesson: 'Lesson',
            lms_module: 'Module',
            lms_course: 'Course',
            lms_assignment: 'Assignment',
            lms_quiz: 'Quiz',
            lms_resource: 'Resource',
        };
        return labels[type] ?? 'LMS Content';
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={cn(
                'group cursor-pointer transition-all hover:shadow-md h-fit',
                isDragging && 'opacity-50'
            )}
        >
            <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                    <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-2'>
                            <div
                                {...(isMounted ? attributes : {})}
                                {...(isMounted ? listeners : {})}
                                className='cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity'
                            >
                                <GripVertical className='h-3 w-3 text-muted-foreground' />
                            </div>

                            {document.slug ? (
                                <Link href={`/lms/${document.slug}`} className='flex-1 min-w-0'>
                                    <CardTitle className='text-base font-medium truncate'>
                                        {document.title ?? 'Untitled Document'}
                                    </CardTitle>
                                </Link>
                            ) : (
                                <div className='flex-1 min-w-0'>
                                    <CardTitle className='text-base font-medium truncate text-muted-foreground'>
                                        {document.title ?? 'Untitled Document'} (No slug)
                                    </CardTitle>
                                </div>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        className='h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity'
                                    >
                                        <MoreVertical className='h-4 w-4' />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    {document.slug ? (
                                        <DropdownMenuItem asChild>
                                            <Link href={`/lms/${document.slug}`}>Open</Link>
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem disabled>
                                            No slug available
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => onMove(document.id, null)}>
                                        Move to Root
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className='text-destructive'>
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {document.description && (
                            <CardDescription className='line-clamp-2'>
                                {document.description}
                            </CardDescription>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className='pt-0'>
                <div className='space-y-3'>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <div className='flex items-center gap-1 min-w-0 flex-1'>
                            <Avatar className='h-5 w-5 flex-shrink-0'>
                                <AvatarImage src={document.author.avatar ?? undefined} />
                                <AvatarFallback className='text-xs'>
                                    {document.author.name?.charAt(0) ?? 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <span className='truncate'>
                                {document.author.name ?? 'Unknown'}
                            </span>
                        </div>

                        <div className='flex items-center gap-1 flex-shrink-0'>
                            <Calendar className='h-3 w-3' />
                            <span className='text-xs'>{formatDate(document.createdAt)}</span>
                        </div>
                    </div>

                    <div className='flex flex-wrap gap-1'>
                        {document.folder && (
                            <Badge
                                variant='outline'
                                className='text-xs'
                                style={{
                                    borderColor: document.folder.color,
                                    color: document.folder.color,
                                }}
                            >
                                {document.folder.name}
                            </Badge>
                        )}

                        <Badge
                            variant='secondary'
                            className={cn(
                                'text-xs',
                                getLMSDocumentTypeColor(document.documentType)
                            )}
                        >
                            {getLMSDocumentTypeLabel(document.documentType)}
                        </Badge>

                        {document.isPublished && (
                            <Badge variant='default' className='text-xs'>
                                Published
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function LMSDocumentList({
    _documentsPromise,
    selectedFolderId,
}: LMSDocumentListProps) {
    const router = useRouter();
    const [draggedDocument, setDraggedDocument] =
        useState<DocumentWithAuthor | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');

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
            <div className='p-4 border-b space-y-4'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-lg font-semibold flex items-center gap-2'>
                        <BookOpen className='h-5 w-5' />
                        {selectedFolderId ? 'LMS Content in Folder' : 'All LMS Content'}
                    </h2>
                    <Button size='sm'>
                        <Plus className='h-4 w-4 mr-2' />
                        New Content
                    </Button>
                </div>

                <div className='flex items-center gap-4'>
                    <div className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input
                            placeholder='Search LMS content...'
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className='pl-9'
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline' size='sm'>
                                <Filter className='h-4 w-4 mr-2' />
                                {filterType === 'all'
                                    ? 'All Types'
                                    : filterType.replace('lms_', '').replace('_', ' ')}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterType('all')}>
                                All Types
                            </DropdownMenuItem>
                            {documentTypes.map(type => (
                                <DropdownMenuItem
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                >
                                    {type.replace('lms_', '').replace('_', ' ')}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className='flex-1 overflow-y-auto p-4'>
                <DndContext
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    {filteredDocuments.length === 0 ? (
                        <div className='flex flex-col items-center justify-center h-full text-center'>
                            <BookOpen className='h-12 w-12 text-muted-foreground mb-4' />
                            <h3 className='text-lg font-medium mb-2'>No LMS content found</h3>
                            <p className='text-muted-foreground mb-4'>
                                {searchQuery || filterType !== 'all'
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Create your first LMS content to get started'}
                            </p>
                            <Button>
                                <Plus className='h-4 w-4 mr-2' />
                                Create Content
                            </Button>
                        </div>
                    ) : (
                        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'>
                            {filteredDocuments.map(document => (
                                <LMSDocumentCard
                                    key={document.id}
                                    document={document}
                                    onMove={handleMoveDocument}
                                />
                            ))}
                        </div>
                    )}

                    <DragOverlay>
                        {draggedDocument ? (
                            <Card className='w-80 shadow-lg'>
                                <CardHeader className='pb-3'>
                                    <div className='flex items-center gap-2'>
                                        <BookOpen className='h-4 w-4' />
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
