import * as React from 'react';

import type { SlateElementProps } from 'platejs';

import { SlateElement } from 'platejs';

import { cn } from '@/lib/utils/utils';

export function DateElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn(
                'inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200',
                props.className
            )}
        >
            {props.children}
        </SlateElement>
    );
}
