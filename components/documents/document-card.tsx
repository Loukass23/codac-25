'use client';

import { useDraggable } from '@dnd-kit/core';
import { Calendar, GripVertical, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DocumentWithAuthor } from '@/data/documents/get-folders';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
  document: DocumentWithAuthor;
  onMove: (documentId: string, folderId: string | null) => void;
  viewMode?: 'grid' | 'list';
}

export function DocumentCard({
  document,
  onMove,
  viewMode = 'list',
}: DocumentCardProps) {
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

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      project_summary: 'bg-blue-100 text-blue-800',
      community_post: 'bg-green-100 text-green-800',
      lesson_content: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800',
    };
    return colors[type] ?? colors['general'];
  };

  if (viewMode === 'list') {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className={cn(
          'group cursor-pointer transition-all hover:shadow-md py-2',
          isDragging && 'opacity-50'
        )}
      >
        <CardContent className='p-2'>
          <div className='flex items-center gap-4'>
            <div
              {...(isMounted ? attributes : {})}
              {...(isMounted ? listeners : {})}
              className='cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity'
            >
              <GripVertical className='h-4 w-4 text-muted-foreground' />
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex items-center justify-between'>
                <Link
                  href={`/documents/${document.id}`}
                  className='flex-1 min-w-0'
                >
                  <h3 className='text-base font-medium truncate'>
                    {document.title ?? 'Untitled Document'}
                  </h3>
                </Link>

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
                    <DropdownMenuItem asChild>
                      <Link href={`/documents/${document.id}`}>Open</Link>
                    </DropdownMenuItem>
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
                <p className='text-sm text-muted-foreground line-clamp-1 mt-1'>
                  {document.description}
                </p>
              )}

              <div className='flex items-center gap-4 mt-2 text-sm text-muted-foreground'>
                <div className='flex items-center gap-1'>
                  <Avatar className='h-4 w-4'>
                    <AvatarImage src={document.author.avatar ?? undefined} />
                    <AvatarFallback className='text-xs'>
                      {document.author.name?.charAt(0) ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className='text-xs'>
                    {document.author.name ?? 'Unknown'}
                  </span>
                </div>

                <div className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  <span className='text-xs'>
                    {formatDate(document.createdAt)}
                  </span>
                </div>

                <div className='flex items-center gap-1'>
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
                      getDocumentTypeColor(document.documentType)
                    )}
                  >
                    {document.documentType.replace('_', ' ')}
                  </Badge>

                  {document.isPublished && (
                    <Badge variant='default' className='text-xs'>
                      Published
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'group cursor-pointer transition-all hover:shadow-md min-h-100 w-full max-w-xs',
        isDragging && 'opacity-50'
      )}
    >
      <CardHeader className='flex flex-col pb-3'>
        <div className='flex items-center justify-between'>
          <div
            {...(isMounted ? attributes : {})}
            {...(isMounted ? listeners : {})}
            className='cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity'
          >
            <GripVertical className='h-3 w-3 text-muted-foreground' />
          </div>

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
              <DropdownMenuItem asChild>
                <Link href={`/documents/${document.id}`}>Open</Link>
              </DropdownMenuItem>
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

        <Link href={`/documents/${document.id}`} className='block'>
          <CardTitle className='text-base font-medium line-clamp-2 mb-2'>
            {document.title ?? 'Untitled Document'}
          </CardTitle>
        </Link>

        {document.description && (
          <CardDescription className='line-clamp-3 text-sm'>
            {document.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className='pt-0 flex-1 flex flex-col justify-between'>
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
        </div>

        <div className='flex flex-wrap gap-1 mt-auto'>
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
              getDocumentTypeColor(document.documentType)
            )}
          >
            {document.documentType.replace('_', ' ')}
          </Badge>

          {document.isPublished && (
            <Badge variant='default' className='text-xs'>
              Published
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
