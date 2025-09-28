'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook to detect toolbar width and determine when to show/hide button text
 * @param threshold - Minimum width in pixels to show text (default: 200px)
 * @returns Object with isWideEnough boolean and ref to attach to toolbar container
 */
export function useToolbarWidth(threshold: number = 200) {
    const [isWideEnough, setIsWideEnough] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const checkWidth = useCallback(() => {
        if (ref.current) {
            const width = ref.current.offsetWidth;
            setIsWideEnough(width >= threshold);
        }
    }, [threshold]);

    useEffect(() => {
        checkWidth();

        const resizeObserver = new ResizeObserver(checkWidth);
        if (ref.current) {
            resizeObserver.observe(ref.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [checkWidth]);

    return { isWideEnough, ref };
}
