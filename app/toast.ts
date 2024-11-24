import { useCallback, useRef } from 'react';
import { toast as toastFn } from 'sonner';

export const useSingleToast = () => {
    const toastIds = useRef<Array<string | number>>([]);

    const singleToast = useCallback(
        (type: 'success' | 'warning' | 'error', message: string) => {
            for (const toastId of toastIds.current) {
                toastFn.dismiss(toastId);
            }

            const toastOptions = {
                closeButton: true,
                duration: Number.POSITIVE_INFINITY,
            };

            const toastId =
                type === 'success'
                    ? toastFn.success(message, toastOptions)
                    : type === 'warning'
                      ? toastFn.warning(message, toastOptions)
                      : toastFn.error(message, toastOptions);

            toastIds.current = [toastId];
        },
        [],
    );

    return singleToast;
};
