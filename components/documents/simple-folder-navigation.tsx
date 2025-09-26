'use client';

import {
  Folder,
  FolderOpen,
  MoreVertical,
  Plus,
  FileText,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { toast } from 'sonner';

import { createFolder } from '@/actions/documents/create-folder';
import { deleteFolder as deleteFolderAction } from '@/actions/documents/delete-folder';
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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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

interface RootItem {
  id: string;
  name: string;
  type: 'folder';
  color: string;
  icon: string | null;
  documentCount: number;
  children: string[];
}

// Simple tree component that doesn't rely on external libraries
export function SimpleDocsFolderNavigation({
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

  const treeData = use(_treeDataPromise);
  console.log(treeData);
  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
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

  const renderTreeItem = (itemId: string, level = 0) => {
    const item = treeData.items[itemId];
    if (!item) return null;

    const isFolder = item.type === 'folder';
    const isExpanded = expandedFolders.has(itemId);
    const isSelected = selectedFolderId === itemId;
    const isEditing = editingFolder === itemId;

    return (
      <div key={itemId} className='select-none'>
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors group',
            'hover:bg-muted/50',
            isSelected && 'bg-primary/10 text-primary',
            level > 0 && 'ml-4'
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {/* Expand/Collapse button for folders */}
          {isFolder && (
            <Button
              variant='ghost'
              size='sm'
              className='h-4 w-4 p-0'
              onClick={() => toggleFolder(itemId)}
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
                className='text-xs font-medium truncate cursor-pointer'
                onClick={() => {
                  if (isFolder) {
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
                  } else {
                    // Handle document click
                    const isLMSContext =
                      window.location.pathname.startsWith('/lms');
                    const basePath = isLMSContext ? '/lms' : '/docs';
                    router.push(`${basePath}/${itemId}`);
                  }
                }}
              >
                {item.name}
              </span>
            )}
          </div>

          {/* Document count badge for folders */}
          {isFolder &&
            item?.documentCount !== undefined &&
            item?.documentCount > 0 && (
              <Badge className='h-4 min-w-4 rounded-full px-1  tabular-nums'>
                {item.documentCount}
              </Badge>
            )}

          {/* Published indicator for documents */}
          {!isFolder && item.isPublished && (
            <Badge variant='outline' className='text-xs px-1.5 py-0.5'>
              Published
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
                      setEditingFolder(itemId);
                      setEditFolderName(item.name);
                    }}
                  >
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteFolder(itemId)}
                    className='text-destructive'
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Render children if folder is expanded */}
        {isFolder && isExpanded && item.children && (
          <div>
            {item.children.map(childId => renderTreeItem(childId, level + 1))}
          </div>
        )}
      </div>
    );
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
          {treeData.rootIds.map(itemId => renderTreeItem(itemId))}
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
