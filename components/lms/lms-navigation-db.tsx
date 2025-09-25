'use client';

import { BookOpen, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { LMSNavigationItem } from '@/data/documents/get-lms-documents';

interface LMSNavigationProps {
  navigation: LMSNavigationItem[];
}

export function LMSNavigationDB({ navigation }: LMSNavigationProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const isActive = (slug: string) => {
    return pathname === `/lms/${slug}`;
  };

  const renderNavigationItem = (item: LMSNavigationItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isItemActive = isActive(item.slug);

    return (
      <div key={item.id} className='space-y-1'>
        <div className='flex items-center'>
          {hasChildren && (
            <Button
              variant='ghost'
              size='sm'
              className='h-6 w-6 p-0 mr-1'
              onClick={() => toggleExpanded(item.id)}
            >
              {isExpanded ? (
                <ChevronRight className='h-3 w-3 rotate-90 transition-transform' />
              ) : (
                <ChevronRight className='h-3 w-3 transition-transform' />
              )}
            </Button>
          )}

          <Link
            href={`/lms/${item.slug}`}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              isItemActive && 'bg-accent text-accent-foreground',
              level > 0 && 'ml-6'
            )}
          >
            {hasChildren ? (
              isExpanded ? (
                <FolderOpen className='h-4 w-4' />
              ) : (
                <Folder className='h-4 w-4' />
              )
            ) : (
              <BookOpen className='h-4 w-4' />
            )}
            <span className='truncate'>{item.navTitle || item.title}</span>
          </Link>
        </div>

        {hasChildren && isExpanded && (
          <div className='space-y-1'>
            {item.children!.map(child =>
              renderNavigationItem(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='h-full flex flex-col'>
      {/* Header */}
      <div className='p-4 border-b'>
        <h2 className='text-lg font-semibold flex items-center gap-2'>
          <BookOpen className='h-5 w-5' />
          Learning Content
        </h2>
      </div>

      {/* Navigation */}
      <ScrollArea className='flex-1 p-4'>
        <nav className='space-y-2'>
          {navigation.map(item => renderNavigationItem(item))}
        </nav>
      </ScrollArea>
    </div>
  );
}
