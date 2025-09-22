import { BaseCalloutPlugin } from '@platejs/callout';

import { CalloutElementStatic } from '@/lib/plate/ui/callout-node-static';

export const BaseCalloutKit = [
  BaseCalloutPlugin.withComponent(CalloutElementStatic),
];
