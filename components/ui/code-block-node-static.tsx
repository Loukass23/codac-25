
import type { SlateElementProps, SlateLeafProps } from 'platejs';
import { SlateElement, SlateLeaf } from 'platejs';
import * as React from 'react';

import { cn } from '@/lib/utils/utils';

export function CodeBlockElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn(
                'my-4 rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100',
                props.className
            )}
        >
            {props.children}
        </SlateElement>
    );
}

export function CodeLineElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn('block', props.className)}
        >
            {props.children}
        </SlateElement>
    );
}

export function CodeSyntaxLeafStatic(props: SlateLeafProps) {
    return (
        <SlateLeaf
            {...props}
            className={cn('font-mono', props.className)}
        >
            {props.children}
        </SlateLeaf>
    );
}
