import * as React from 'react';

import type { SlateElementProps } from 'platejs';

import { SlateElement } from 'platejs';

import { cn } from '@/lib/utils/utils';

export function LinkElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn(
                'text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
                props.className
            )}
        >
            {props.children}
        </SlateElement>
    );
}
