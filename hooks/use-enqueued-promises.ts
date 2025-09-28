import { useCallback, useRef } from 'react';

/**
 * Hook for managing enqueued promises to prevent race conditions
 * Only one promise can be in flight at a time, with queuing support
 */
export function useEnqueuedPromises() {
    const currentPromiseRef = useRef<Promise<any> | null>(null);
    const enqueuedPromiseRef = useRef<(() => Promise<any>) | null>(null);

    const enqueuePromise = useCallback(
        (promiseFactory: () => Promise<any>) => {
            // If no promise is currently running, start immediately
            if (!currentPromiseRef.current) {
                const promise = promiseFactory();
                currentPromiseRef.current = promise;

                promise
                    .finally(() => {
                        currentPromiseRef.current = null;

                        // Check if there's an enqueued promise waiting
                        if (enqueuedPromiseRef.current) {
                            const nextPromiseFactory = enqueuedPromiseRef.current;
                            enqueuedPromiseRef.current = null;
                            enqueuePromise(nextPromiseFactory);
                        }
                    });

                return promise;
            } else {
                // Replace any existing enqueued promise with the new one
                enqueuedPromiseRef.current = promiseFactory;
                return Promise.resolve(); // Return resolved promise for immediate execution
            }
        },
        []
    );

    return { enqueuePromise };
}
