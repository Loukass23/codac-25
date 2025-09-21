import * as React from 'react';

import type { SlateElementProps } from 'platejs';

import { SlateElement } from 'platejs';

import { cn } from '@/lib/utils/utils';

export function TableElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn(
                'my-4 w-full border-collapse border border-gray-300 dark:border-gray-600',
                props.className
            )}
        >
            {props.children}
        </SlateElement>
    );
}

export function TableRowElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn('border-b border-gray-300 dark:border-gray-600', props.className)}
        >
            {props.children}
        </SlateElement>
    );
}

export function TableCellElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn(
                'border-r border-gray-300 p-2 dark:border-gray-600',
                props.className
            )}
        >
            {props.children}
        </SlateElement>
    );
}

export function TableCellHeaderElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn(
                'border-r border-gray-300 bg-gray-100 p-2 font-semibold dark:border-gray-600 dark:bg-gray-800',
                props.className
            )}
        >
            {props.children}
        </SlateElement>
    );
}
