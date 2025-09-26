'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  GripVertical,
  MoreVertical,
  Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { createFolder } from '@/actions/documents/create-folder';
import { deleteFolder as deleteFolderAction } from '@/actions/documents/delete-folder';
import { moveDocument } from '@/actions/documents/move-document';
import { updateFolder as updateFolderAction } from '@/actions/documents/update-folder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FolderTreeItem } from '@/data/documents/get-folders';
import { cn } from '@/lib/utils';

interface FolderNavigationProps {
  _treeDataPromise: Promise<{
    items: Record<string, FolderTreeItem>;
    rootIds: string[];
  }>;
  selectedFolderId: string | null;
}

export function DocsFolderNavigation({
  _treeDataPromise,
  selectedFolderId,
}: FolderNavigationProps) {
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#3B82F6');
  const [createInFolder, setCreateInFolder] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState('');
  const [draggedItem, setDraggedItem] = useState<FolderTreeItem | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const treeData = use(_treeDataPromise);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const itemId = event.active.id as string;
    const item = treeData.items[itemId];
    if (item) {
      setDraggedItem(item);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setDraggedItem(null);

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const draggedItem = active.data.current?.['item'] as FolderTreeItem;
    const targetFolderId = over.data.current?.['type'] === 'folder' ? (over.id as string) : null;

    if (!draggedItem) {
      return;
    }

    // Only handle document moves for now (folders would need different logic)
    if (draggedItem.type === 'document') {
      const result = await moveDocument({
        documentId: draggedItem.id,
        folderId: targetFolderId ?? undefined,
      });

      if (result.success) {
        toast.success('Document moved successfully');
        router.refresh();
      } else {
        toast.error('Failed to move document');
      }
    }
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
      // When collapsing a folder, remove search param to show all documents
      const basePath = '/docs';
      router.push(basePath);
    } else {
      // Clear all other expanded folders (only one folder open at a time)
      newExpanded.clear();
      newExpanded.add(folderId);
      // When expanding a folder, navigate to it to update the list view
      const params = new URLSearchParams();
      if (folderId !== 'root') {
        params.set('folder', folderId);
      }
      const queryString = params.toString();

      const basePath = '/docs';
      router.push(
        `${basePath}${queryString ? `?${queryString}` : ''}`
      );
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Folder name is required');
      return;
    }

    const result = await createFolder({
      name: newFolderName.trim(),
      color: newFolderColor,
      parentId: createInFolder ?? undefined,
    });

    if (result.success) {
      toast.success('Folder created successfully');
      setShowCreateDialog(false);
      setNewFolderName('');
      setCreateInFolder(null);
      router.refresh();
    } else {
      toast.error('Failed to create folder');
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    const folder = treeData.items[folderId];
    if (!folder) return;

    if (
      confirm(
        `Are you sure you want to delete "${folder.name}" and all its contents?`
      )
    ) {
      const result = await deleteFolderAction({
        id: folderId,
      });

      if (result.success) {
        toast.success('Folder deleted successfully');
        router.refresh();
        if (selectedFolderId === folderId) {
          router.push('/docs');
        }
      } else {
        toast.error('Failed to delete folder');
      }
    }
  };

  const handleRenameFolder = async (folderId: string) => {
    if (!editFolderName.trim()) {
      toast.error('Folder name is required');
      return;
    }

    const result = await updateFolderAction({
      id: folderId,
      name: editFolderName.trim(),
    });

    if (result.success) {
      toast.success('Folder renamed successfully');
      setEditingFolder(null);
      setEditFolderName('');
      router.refresh();
    } else {
      toast.error('Failed to rename folder');
    }
  };

  // Draggable item component
  const DraggableItem = ({ item, level, children }: { item: FolderTreeItem; level: number; children: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: item.id,
      data: {
        type: item.type,
        item,
      },
      disabled: !isMounted,
    });

    const style = transform
      ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
      : undefined;

    // For folders, create a grip zone; for documents, make the whole item draggable
    if (item.type === 'folder') {
      return (
        <div
          ref={setNodeRef}
          style={style}
          className={cn(
            isDragging && 'opacity-50',
            level > 0 && 'ml-4'
          )}
          {...(isMounted ? attributes : {})}
        >
          <div className="flex items-center">
            <div className="flex-1">
              {children}
            </div>
            {/* Grip zone for folders */}
            <div
              className={cn(
                'h-6 w-6 flex items-center justify-center cursor-grab hover:bg-muted/50 rounded transition-colors',
                isDragging && 'cursor-grabbing'
              )}
              {...(isMounted ? listeners : {})}
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
        </div>
      );
    }

    // For documents, make the whole item draggable
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          isDragging && 'opacity-50',
          level > 0 && 'ml-4'
        )}
        {...(isMounted ? attributes : {})}
        {...(isMounted ? listeners : {})}
      >
        {children}
      </div>
    );
  };

  // Droppable folder component
  const DroppableFolder = ({ folderId, children }: { folderId: string; children: React.ReactNode }) => {
    const { isOver, setNodeRef } = useDroppable({
      id: folderId,
      data: {
        type: 'folder',
      },
      disabled: !isMounted,
    });

    return (
      <div
        ref={setNodeRef}
        className={cn(
          isOver && isMounted && 'bg-primary/10 border-primary/20 border-2 border-dashed rounded-md'
        )}
      >
        {children}
      </div>
    );
  };

  const renderTreeItem = (itemId: string, level = 0) => {
    const item = treeData.items[itemId];
    if (!item) return null;

    const isFolder = item.type === 'folder';
    const isExpanded = expandedFolders.has(itemId);
    const isSelected = selectedFolderId === itemId;
    const isEditing = editingFolder === itemId;

    const itemContent = (
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors group',
          'hover:bg-muted/50',
          isSelected && 'bg-primary/10 text-primary'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => {
          if (isFolder) {
            // For folders, toggle expand/collapse
            toggleFolder(itemId);
          } else {
            // Handle document click
            const isLMSContext =
              window.location.pathname.startsWith('/lms');
            const basePath = isLMSContext ? '/lms' : '/docs';
            router.push(`${basePath}/${itemId}`);
          }
        }}
      >
        {/* Expand/Collapse button for folders */}
        {isFolder && (
          <Button
            variant='ghost'
            size='sm'
            className='h-4 w-4 p-0'
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {isExpanded ? (
              <ChevronDown className='h-3 w-3' />
            ) : (
              <ChevronRight className='h-3 w-3' />
            )}
          </Button>
        )}

        {/* Icon */}
        <div className='flex-shrink-0'>
          {isFolder ? (
            isExpanded ? (
              <FolderOpen className='h-4 w-4' style={{ color: item.color }} />
            ) : (
              <Folder className='h-4 w-4' style={{ color: item.color }} />
            )
          ) : (
            <FileText className='h-4 w-4 text-muted-foreground' />
          )}
        </div>

        {/* Name */}
        <div className='flex-1 min-w-0'>
          {isEditing ? (
            <Input
              value={editFolderName}
              onChange={e => setEditFolderName(e.target.value)}
              onBlur={() => {
                setEditingFolder(null);
                setEditFolderName('');
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleRenameFolder(itemId);
                } else if (e.key === 'Escape') {
                  setEditingFolder(null);
                  setEditFolderName('');
                }
              }}
              autoFocus
              className='h-6 text-xs'
            />
          ) : (
            <span
              className='text-xs font-medium truncate'
            >
              {item.name}
            </span>
          )}
        </div>

        {/* Document count badge for folders */}
        {isFolder &&
          item?.documentCount !== undefined &&
          item?.documentCount > 0 && (
            <Badge className='h-5 min-w-5 rounded-full px-1  tabular-nums'>
              {item.documentCount}
            </Badge>
          )}


        {/* Actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className='h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center hover:bg-muted rounded'
              onClick={e => e.stopPropagation()}
            >
              <MoreVertical className='h-3 w-3' />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            {isFolder ? (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (itemId !== 'root') {
                      params.set('folder', itemId);
                    }
                    const queryString = params.toString();
                    const isLMSContext =
                      window.location.pathname.startsWith('/lms');
                    const basePath = isLMSContext ? '/lms' : '/docs';
                    router.push(
                      `${basePath}${queryString ? `?${queryString}` : ''}`
                    );
                  }}
                >
                  Open Folder
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setEditingFolder(itemId);
                    setEditFolderName(item.name);
                  }}
                >
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setCreateInFolder(itemId);
                    setShowCreateDialog(true);
                  }}
                >
                  <Plus className='h-3 w-3 mr-2' />
                  Add Subfolder
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteFolder(itemId)}
                  className='text-destructive'
                >
                  Delete
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    const isLMSContext = window.location.pathname.startsWith('/lms');
                    const basePath = isLMSContext ? '/lms' : '/docs';
                    router.push(`${basePath}/${itemId}`);
                  }}
                >
                  Open
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );

    return (
      <div key={itemId} className='select-none'>
        {isMounted ? (
          isFolder ? (
            <DroppableFolder folderId={itemId}>
              <DraggableItem item={item} level={level}>
                {itemContent}
              </DraggableItem>
            </DroppableFolder>
          ) : (
            <DraggableItem item={item} level={level}>
              {itemContent}
            </DraggableItem>
          )
        ) : (
          <div className={cn(level > 0 && 'ml-4')}>
            {itemContent}
          </div>
        )}

        {/* Render children if folder is expanded */}
        {isFolder && isExpanded && item.children && (
          <div>
            {item.children.map((childId: string) => renderTreeItem(childId, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!isMounted) {
    // Render without DnD functionality during SSR
    return (
      <div className='h-full w-full flex flex-col'>
        <div className='flex items-center justify-between p-3 border-b'>
          <h3 className='font-semibold text-sm'>Folders</h3>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              setCreateInFolder(null);
              setShowCreateDialog(true);
            }}
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>

        <div className='overflow-y-auto flex-1'>
          <div className='p-2'>
            {/* Root folder (all documents) */}
            <div
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors',
                'hover:bg-muted/50',
                selectedFolderId === null && 'bg-primary/10 text-primary'
              )}
              onClick={() => {
                const isLMSContext = window.location.pathname.startsWith('/lms');
                const basePath = isLMSContext ? '/lms' : '/docs';
                router.push(basePath);
              }}
            >
              <FileText className='h-4 w-4' />
              <span className='text-xs font-medium text-left'>All Documents</span>

            </div>

            {/* Tree items */}
            {treeData.rootIds.length > 0 ? (
              treeData.rootIds.map(itemId => renderTreeItem(itemId))
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No folders found. Create your first folder to get started.
              </div>
            )}
          </div>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                {createInFolder
                  ? 'Create a new subfolder'
                  : 'Create a new folder in your documents'}
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='folder-name'>Folder Name</Label>
                <Input
                  id='folder-name'
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  placeholder='Enter folder name'
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor='folder-color'>Color</Label>
                <div className='flex items-center gap-2'>
                  <input
                    type='color'
                    id='folder-color'
                    value={newFolderColor}
                    onChange={e => setNewFolderColor(e.target.value)}
                    className='w-10 h-8 border rounded'
                  />
                  <Input
                    value={newFolderColor}
                    onChange={e => setNewFolderColor(e.target.value)}
                    className='flex-1'
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateFolder}>Create Folder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className='h-full w-full flex flex-col'>
        <div className='flex items-center justify-between p-3 border-b'>
          <h3 className='font-semibold text-sm'>Folders</h3>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              setCreateInFolder(null);
              setShowCreateDialog(true);
            }}
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>

        <div className='overflow-y-auto flex-1'>
          <div className='p-2'>
            {/* Root folder (all documents) */}
            <div
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors',
                'hover:bg-muted/50',
                selectedFolderId === null && 'bg-primary/10 text-primary'
              )}
              onClick={() => {
                const isLMSContext = window.location.pathname.startsWith('/lms');
                const basePath = isLMSContext ? '/lms' : '/docs';
                router.push(basePath);
              }}
            >
              <FileText className='h-4 w-4' />
              <span className='text-xs font-medium text-left'>All Documents</span>
            </div>

            {/* Tree items */}
            {treeData.rootIds.length > 0 ? (
              treeData.rootIds.map(itemId => renderTreeItem(itemId))
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No folders found. Create your first folder to get started.
              </div>
            )}
          </div>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                {createInFolder
                  ? 'Create a new subfolder'
                  : 'Create a new folder in your documents'}
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='folder-name'>Folder Name</Label>
                <Input
                  id='folder-name'
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  placeholder='Enter folder name'
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor='folder-color'>Color</Label>
                <div className='flex items-center gap-2'>
                  <input
                    type='color'
                    id='folder-color'
                    value={newFolderColor}
                    onChange={e => setNewFolderColor(e.target.value)}
                    className='w-10 h-8 border rounded'
                  />
                  <Input
                    value={newFolderColor}
                    onChange={e => setNewFolderColor(e.target.value)}
                    className='flex-1'
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateFolder}>Create Folder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DragOverlay>
          {draggedItem ? (
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-background border shadow-lg">
              {draggedItem.type === 'folder' ? (
                <Folder className='h-4 w-4' style={{ color: draggedItem.color }} />
              ) : (
                <FileText className='h-4 w-4 text-muted-foreground' />
              )}
              <span className='text-xs font-medium'>{draggedItem.name}</span>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
