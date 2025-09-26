import { Value } from 'platejs';

import useSavePlate from '@/hooks/use-save-plate';

export function SaveManager({ onSave }: { onSave: (value: Value) => void }) {
  const { isSaving, lastSaved, hasUnsavedChanges, handleSavePlate } =
    useSavePlate({
      onSave,
      autoSave: true,
      autoSaveInterval: 30000,
    });
  return (
    <div className='flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          {isSaving && (
            <span className='flex items-center gap-1'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-blue-500' />
              Saving...
            </span>
          )}
          {!isSaving && lastSaved && (
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          )}
          {hasUnsavedChanges && !isSaving && (
            <span className='text-amber-600'>Unsaved changes</span>
          )}
        </div>
      </div>

      <button
        onClick={handleSavePlate}
        disabled={isSaving || !hasUnsavedChanges}
        className='rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
