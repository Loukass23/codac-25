'use client';

import { createPlatePlugin } from 'platejs/react';

import { SaveStateMenu } from '@/components/ui/save-toolbar-button';

// Plugin that renders a save state menu in the editor
export const saveToolbarPlugin = createPlatePlugin({
  key: 'save-toolbar',
  render: {
    // Render the save state menu at the top of the editor
    beforeEditable: () => {
      // Only render on client side to avoid SSR issues
      if (typeof window === 'undefined') {
        return null;
      }
      
      return (
        <div className='border-b bg-muted/30 px-4 py-2'>
          <SaveStateMenu />
        </div>
      );
    },
  },
});

export const SaveToolbarKit = [saveToolbarPlugin];
