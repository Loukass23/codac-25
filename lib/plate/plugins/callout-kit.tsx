'use client';

import { CalloutPlugin } from '@platejs/callout/react';

import { CalloutElement } from '@/lib/plate/ui/callout-node';

export const CalloutKit = [CalloutPlugin.withComponent(CalloutElement)];
