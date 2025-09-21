import * as React from 'react';

import type { SlateElementProps } from 'platejs';

import { SlateElement } from 'platejs';

import { cn } from '@/lib/utils/utils';

export function ColumnGroupElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn(
                'my-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3',
                props.className
            )}
        >
            {props.children}
        </SlateElement>
    );
}

export function ColumnElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn('space-y-2', props.className)}
        >
            {props.children}
        </SlateElement>
    );
}
