import * as React from 'react';

import type { SlateElementProps } from 'platejs';

import { SlateElement } from 'platejs';

import { cn } from '@/lib/utils/utils';

export function EquationElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn(
                'my-4 rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-800',
                props.className
            )}
        >
            {props.children}
        </SlateElement>
    );
}

export function InlineEquationElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn(
                'inline-block rounded bg-gray-100 px-2 py-1 dark:bg-gray-800',
                props.className
            )}
        >
            {props.children}
        </SlateElement>
    );
}
