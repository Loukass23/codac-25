
import type { SlateElementProps } from 'platejs';
import { SlateElement } from 'platejs';
import * as React from 'react';

import { cn } from '@/lib/utils/utils';

export function TocElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn(
                'my-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800',
                props.className
            )}
        >
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Table of Contents
            </div>
            {props.children}
        </SlateElement>
    );
}
