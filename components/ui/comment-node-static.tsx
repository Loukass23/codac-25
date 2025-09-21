import * as React from 'react';

import type { SlateLeafProps } from 'platejs';

import { SlateLeaf } from 'platejs';

import { cn } from '@/lib/utils/utils';

export function CommentLeafStatic(props: SlateLeafProps) {
    return (
        <SlateLeaf
            {...props}
            className={cn(
                'rounded bg-yellow-100 px-1 py-0.5 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
                props.className
            )}
        >
            {props.children}
        </SlateLeaf>
    );
}
