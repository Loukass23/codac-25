'use client';

import { createPlatePlugin } from 'platejs/react';

import { VerticalToolbar } from '@/components/ui/vertical-toolbar';
import { VerticalToolbarButtonsWithNames } from '@/components/ui/vertical-toolbar-buttons-with-names';

export const VerticalToolbarKit = [
  createPlatePlugin({
    key: 'vertical-toolbar',
    render: {
      beforeEditable: () => (
        <VerticalToolbar>
          <VerticalToolbarButtonsWithNames />
        </VerticalToolbar>
      ),
    },
  }),
];
