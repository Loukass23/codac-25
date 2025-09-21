import * as React from 'react';

import type { SlateElementProps } from 'platejs';

import { SlateElement } from 'platejs';

import { cn } from '@/lib/utils/utils';

export function ImageElementStatic(props: SlateElementProps) {
    return (
        <SlateElement
            {...props}
            className={cn(
                'my-4 rounded-lg border border-gray-200 dark:border-gray-700',
                props.className
            )}
        >
            <div className="flex items-center justify-center p-8">
                <div className="h-32 w-32 rounded-lg bg-gray-100 flex items-center justify-center dark:bg-gray-800">
                    <span className="text-gray-500">🖼️</span>
                </div>
            </div>
            {props.children}
        </SlateElement>
    );
}
