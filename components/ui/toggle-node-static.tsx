
import type { SlateElementProps } from 'platejs';
import { SlateElement } from 'platejs';
import * as React from 'react';

import { cn } from '@/lib/utils/utils';

export function ToggleElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn(
                'my-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800',
                props.className
            )}
        >
            <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border border-gray-300 dark:border-gray-600"></div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Toggle
                </div>
            </div>
            {props.children}
        </SlateElement>
    );
}
