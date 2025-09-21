import * as React from 'react';

import type { SlateLeafProps } from 'platejs';

import { SlateLeaf } from 'platejs';

import { cn } from '@/lib/utils/utils';

export function HighlightLeafStatic(props: SlateLeafProps) {
    return (
        <SlateLeaf
            {...props}
            className={cn(
                'rounded bg-yellow-200 px-1 py-0.5 font-medium',
                props.className
            )}
        >
            {props.children}
        </SlateLeaf>
    );
}
