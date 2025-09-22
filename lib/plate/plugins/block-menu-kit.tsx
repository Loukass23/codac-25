'use client';

import { BlockMenuPlugin } from '@platejs/selection/react';

import { BlockSelectionKit } from '@/lib/plate/plugins/block-selection-kit';
import { BlockContextMenu } from '@/lib/plate/ui/block-context-menu';

export const BlockMenuKit = [
  ...BlockSelectionKit,
  BlockMenuPlugin.configure({
    render: { aboveEditable: BlockContextMenu },
  }),
];
