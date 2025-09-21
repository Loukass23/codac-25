import * as React from 'react';

import type { SlateElementProps, SlateLeafProps } from 'platejs';

import { SlateElement, SlateLeaf } from 'platejs';

import { cn } from '@/lib/utils/utils';

export function SuggestionElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn(
                'inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-800 dark:bg-green-900/20 dark:text-green-200',
                props.className
            )}
        >
            {props.children}
        </SlateElement>
    );
}

export function SuggestionLeafStatic(props: SlateLeafProps) {
    return (
        <SlateLeaf
            {...props}
            className={cn(
                'inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-sm font-medium text-green-800 dark:bg-green-900/20 dark:text-green-200',
                props.className
            )}
        >
            {props.children}
        </SlateLeaf>
    );
}
