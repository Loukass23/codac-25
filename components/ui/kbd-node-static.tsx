import * as React from 'react';

import type { SlateLeafProps } from 'platejs';

import { SlateLeaf } from 'platejs';

import { cn } from '@/lib/utils/utils';

export function KbdLeafStatic(props: SlateLeafProps) {
    return (
        <SlateLeaf
            {...props}
            className={cn(
                'rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-sm font-medium shadow-sm',
                props.className
            )}
        >
            {props.children}
        </SlateLeaf>
    );
}
