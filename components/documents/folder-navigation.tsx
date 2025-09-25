'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Plus,
  FileText,
  GripVertical,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createFolder } from '@/actions/documents/create-folder';
import { updateFolder as updateFolderAction } from '@/actions/documents/update-folder';
import { deleteFolder as deleteFolderAction } from '@/actions/documents/delete-folder';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { DocumentFolderWithChildren } from '@/data/documents/get-folders';

interface FolderNavigationProps {
  _foldersPromise: Promise<DocumentFolderWithChildren[]>;
  selectedFolderId: string | null;
}

interface FolderItemProps {
  folder: DocumentFolderWithChildren;
  level: number;
  isSelected: boolean;
  onEdit: (folder: DocumentFolderWithChildren) => void;
  onDelete: (folder: DocumentFolderWithChildren) => void;
  onAddSubfolder: (parentFolder: DocumentFolderWithChildren) => void;
}

function FolderItem({
  folder,
  level,
  isSelected,
  onEdit,
  onDelete,
  onAddSubfolder,
}: FolderItemProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: folder.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditName(folder.name);
  };

  const handleSaveEdit = async () => {
    if (editName.trim() && editName !== folder.name) {
      const result = await updateFolderAction({
        id: folder.id,
        name: editName.trim(),
      });

      if (result.success) {
        toast.success('Folder renamed successfully');
        setIsEditing(false);
      } else {
        toast.error('Failed to rename folder');
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(folder.name);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('group relative', isDragging && 'opacity-50')}
    >
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors',
          'hover:bg-muted/50',
          isSelected && 'bg-primary/10 text-primary'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          const params = new URLSearchParams();
          if (folder.id) {
            params.set('folder', folder.id);
          }
          const queryString = params.toString();
          router.push(`/docs${queryString ? `?${queryString}` : ''}`);
        }}
      >
        <div
          {...attributes}
          {...listeners}
          className='cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded'
        >
          <GripVertical className='h-3 w-3 text-muted-foreground' />
        </div>

        {folder.children.length > 0 && (
          <button
            onClick={e => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className='p-0.5 hover:bg-muted rounded'
          >
            {isExpanded ? (
              <ChevronDown className='h-3 w-3' />
            ) : (
              <ChevronRight className='h-3 w-3' />
            )}
          </button>
        )}

        <div
          className='flex items-center gap-2 flex-1 min-w-0'
          style={{ paddingLeft: folder.children.length === 0 ? '20px' : '0' }}
        >
          {folder.icon ? (
            <div className='flex-shrink-0'>
              {folder.icon === 'folder-open' ? (
                <FolderOpen
                  className='h-4 w-4'
                  style={{ color: folder.color }}
                />
              ) : (
                <Folder className='h-4 w-4' style={{ color: folder.color }} />
              )}
            </div>
          ) : (
            <Folder className='h-4 w-4' style={{ color: folder.color }} />
          )}

          {isEditing ? (
            <Input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className='h-6 text-sm'
              autoFocus
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <span className='text-sm font-medium truncate flex-1'>
              {folder.name}
            </span>
          )}

          {folder.documentCount > 0 && (
            <Badge variant='secondary' className='text-xs px-1.5 py-0.5'>
              {folder.documentCount}
            </Badge>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity'
              onClick={e => e.stopPropagation()}
            >
              <MoreVertical className='h-3 w-3' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            <DropdownMenuItem onClick={handleEdit}>Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddSubfolder(folder)}>
              <Plus className='h-3 w-3 mr-2' />
              Add Subfolder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(folder)}
              className='text-destructive'
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isExpanded && folder.children.length > 0 && (
        <div className='ml-2'>
          <SortableContext
            items={folder.children.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {folder.children.map(child => (
              <FolderItem
                key={child.id}
                folder={child}
                level={level + 1}
                isSelected={isSelected}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddSubfolder={onAddSubfolder}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}

export function FolderNavigation({
  _foldersPromise,
  selectedFolderId,
}: FolderNavigationProps) {
  const router = useRouter();
  const [draggedFolder, setDraggedFolder] =
    useState<DocumentFolderWithChildren | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#3B82F6');
  const [createInFolder, setCreateInFolder] = useState<string | null>(null);

  const folders = use(_foldersPromise);
  const handleDragStart = (event: DragStartEvent) => {
    const folder = findFolderById(folders, event.active.id as string);
    setDraggedFolder(folder);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setDraggedFolder(null);

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const draggedFolder = findFolderById(folders, active.id as string);
    const targetFolder = findFolderById(folders, over.id as string);

    if (!draggedFolder || !targetFolder) {
      return;
    }

    // Prevent moving folder into itself or its children
    if (isDescendant(draggedFolder, targetFolder)) {
      toast.error('Cannot move folder into its own subfolder');
      return;
    }

    const result = await updateFolderAction({
      id: draggedFolder.id,
      parentId: targetFolder.id,
    });

    if (result.success) {
      toast.success('Folder moved successfully');
      router.refresh();
    } else {
      toast.error('Failed to move folder');
    }
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

  const handleDeleteFolder = async (folder: DocumentFolderWithChildren) => {
    if (
      confirm(
        `Are you sure you want to delete "${folder.name}" and all its contents?`
      )
    ) {
      const result = await deleteFolderAction({
        id: folder.id,
      });

      if (result.success) {
        toast.success('Folder deleted successfully');
        router.refresh();
        if (selectedFolderId === folder.id) {
          router.push('/docs');
        }
      } else {
        toast.error('Failed to delete folder');
      }
    }
  };

  const findFolderById = (
    folders: DocumentFolderWithChildren[],
    id: string
  ): DocumentFolderWithChildren | null => {
    for (const folder of folders) {
      if (folder.id === id) {
        return folder;
      }
      const found = findFolderById(folder.children, id);
      if (found) {
        return found;
      }
    }
    return null;
  };

  const isDescendant = (
    parent: DocumentFolderWithChildren,
    child: DocumentFolderWithChildren
  ): boolean => {
    for (const subfolder of parent.children) {
      if (subfolder.id === child.id || isDescendant(subfolder, child)) {
        return true;
      }
    }
    return false;
  };

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

      <div className='overflow-y-auto'>
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className='p-2'>
            {/* Root folder (all documents) */}
            <div
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors',
                'hover:bg-muted/50',
                selectedFolderId === null && 'bg-primary/10 text-primary'
              )}
              onClick={() => router.push('/docs')}
            >
              <FileText className='h-4 w-4' />
              <span className='text-sm font-medium'>All Documents</span>
            </div>

            <SortableContext
              items={folders.map(f => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {folders.map(folder => (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  level={0}
                  isSelected={selectedFolderId === folder.id}
                  onEdit={() => {}}
                  onDelete={handleDeleteFolder}
                  onAddSubfolder={parentFolder => {
                    setCreateInFolder(parentFolder.id);
                    setShowCreateDialog(true);
                  }}
                />
              ))}
            </SortableContext>
          </div>

          <DragOverlay>
            {draggedFolder ? (
              <div className='flex items-center gap-2 px-2 py-1.5 bg-background border rounded-md shadow-lg'>
                <Folder
                  className='h-4 w-4'
                  style={{ color: draggedFolder.color }}
                />
                <span className='text-sm font-medium'>
                  {draggedFolder.name}
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
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
