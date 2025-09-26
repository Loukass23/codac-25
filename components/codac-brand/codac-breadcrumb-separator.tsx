import React from 'react';

import { cn } from '@/lib/utils';

import { CodacRightAngleBracket } from './codac-right-angle-bracket';

interface CodacBreadcrumbSeparatorProps {
    className?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const CodacBreadcrumbSeparator: React.FC<CodacBreadcrumbSeparatorProps> = ({
    className,
    size = 'xs',
}) => {
    return (
        <div className={cn('flex items-center justify-center', className)}>
            <CodacRightAngleBracket
                size={size}
                className="text-muted-foreground/60"
            />
        </div>
    );
};

export default CodacBreadcrumbSeparator;
