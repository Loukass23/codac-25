import { BaseTogglePlugin } from '@platejs/toggle';

import { ToggleElementStatic } from '@/lib/plate/ui/toggle-node-static';

export const BaseToggleKit = [
  BaseTogglePlugin.withComponent(ToggleElementStatic),
];
