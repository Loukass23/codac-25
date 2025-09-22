'use client';

import { createPlatePlugin } from 'platejs/react';

import { FixedToolbar } from '@/lib/plate/ui/fixed-toolbar';
import { FixedToolbarButtons } from '@/lib/plate/ui/fixed-toolbar-buttons';

export const FixedToolbarKit = [
  createPlatePlugin({
    key: 'fixed-toolbar',
    render: {
      beforeEditable: () => (
        <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar>
      ),
    },
  }),
];
