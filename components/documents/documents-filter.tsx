'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Filter, Grid3X3, List, Plus, Search } from 'lucide-react';

import { CreateDocumentForm } from './create-document-form';

interface DocumentsFilterProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filterType: string;
    onFilterChange: (type: string) => void;
    documentTypes: string[];
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    selectedFolderId: string | null;
    onDocumentCreated?: () => void;
}

export function DocumentsFilter({
    searchQuery,
    onSearchChange,
    filterType,
    onFilterChange,
    documentTypes,
    viewMode,
    onViewModeChange,
    selectedFolderId,
    onDocumentCreated,
}: DocumentsFilterProps) {
    return (
        <div className='p-4 border-b space-y-4'>
            <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>
                    {selectedFolderId ? 'Documents in Folder' : 'All Documents'}
                </h2>
                <CreateDocumentForm
                    selectedFolderId={selectedFolderId}
                    onDocumentCreated={onDocumentCreated}
                    trigger={
                        <Button size='sm'>
                            <Plus className='h-4 w-4 mr-2' />
                            New Document
                        </Button>
                    }
                />
            </div>

            <div className='flex items-center gap-4'>
                <div className='relative flex-1'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                        placeholder='Search documents...'
                        value={searchQuery}
                        onChange={e => onSearchChange(e.target.value)}
                        className='pl-9'
                    />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='outline' size='sm'>
                            <Filter className='h-4 w-4 mr-2' />
                            {filterType === 'all'
                                ? 'All Types'
                                : filterType.replace('_', ' ')}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onFilterChange('all')}>
                            All Types
                        </DropdownMenuItem>
                        {documentTypes.map(type => (
                            <DropdownMenuItem
                                key={type}
                                onClick={() => onFilterChange(type)}
                            >
                                {type.replace('_', ' ')}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center border rounded-md">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => onViewModeChange('grid')}
                        className="rounded-r-none border-r"
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => onViewModeChange('list')}
                        className="rounded-l-none"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
