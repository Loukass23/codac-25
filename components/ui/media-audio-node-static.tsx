import * as React from 'react';

import type { SlateElementProps } from 'platejs';

import { SlateElement } from 'platejs';

import { cn } from '@/lib/utils/utils';

export function AudioElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn(
                'my-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700',
                props.className
            )}
        >
            <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center dark:bg-gray-800">
                    <span className="text-gray-500">🎵</span>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Audio file</p>
                </div>
            </div>
            {props.children}
        </SlateElement>
    );
}
