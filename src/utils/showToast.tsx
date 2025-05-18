import { Button } from "@mui/material";
import { ReactNode } from "react";
import toast, { Toast, ToastOptions, ToastType } from "react-hot-toast";

interface BaseToastProps extends ToastOptions {
  /** Prevent closing toast by clicking on it */
  disableClickDismiss?: boolean;
  /** Disable device vibration when toast appears */
  disableVibrate?: boolean;
  /** Show dismiss button inside toast and not close it on click */
  dismissButton?: boolean;
  type?: ToastType;
}

type ToastProps = BaseToastProps &
  (
    | {
        /** ‼️ requires `id` and `visibleToasts` */
        preventDuplicate: true;
        id: string;
        visibleToasts: Toast[];
      }
    | { preventDuplicate?: false; id?: string; visibleToasts?: Toast[] }
  );

/**
 * Displays a configurable toast notification
 *
 * @param {string|ReactNode} message - Content to display in the toast
 * @param {ToastProps} [options] - Configuration options for toast behavior and appearance
 *
 * @example
 * // basic usage
 * showToast('Update successful!', {type: "success"});
 *
 * @example
 * // with duplicate prevention
 * showToast('Only show once at a time', {
 *   preventDuplicate: true,
 *   id: 'unique-message',
 *   visibleToasts: activeToasts
 * });
 */

export const showToast = (
  message: string | ReactNode,
  {
    type,
    disableClickDismiss,
    disableVibrate,
    dismissButton,
    preventDuplicate,
    visibleToasts,
    ...toastOptions
  }: ToastProps = {} as ToastProps,
): void => {
  // Prevent showing duplicate of toasts if enabled
  if (preventDuplicate) {
    if (!toastOptions.id || !visibleToasts) {
      console.error("[Toast] `preventDuplicate: true` requires both `id` and `visibleToasts`.");
      return;
    }
    console.log("[Toast] prevented duplicate toast", toastOptions.id);
    const alreadyVisible = visibleToasts.some((t) => t.id === toastOptions.id && t.visible);
    if (alreadyVisible) return;
  }

  // Selects the appropriate toast function based on the specified type or defaults to success.
  const toastFunction = {
    error: toast.error,
    success: toast.success,
    loading: toast.loading,
    blank: toast,
    custom: toast.custom,
  }[type || "success"];

  // Vibrates the device based on the toast type, unless disabled or not supported.
  if (!disableVibrate && "vibrate" in navigator) {
    const vibrationPattern = type === "error" ? [100, 50, 100] : [100];
    try {
      navigator.vibrate(vibrationPattern);
    } catch (err) {
      console.error(err);
    }
  }

  // Display the toast notification.
  toastFunction(
    (t: Toast) => (
      <div onClick={!disableClickDismiss && !dismissButton ? () => toast.dismiss(t.id) : undefined}>
        {message}
        {dismissButton && (
          <div>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => toast.dismiss(t.id)}
              sx={{ mt: "8px", w: "100%", p: "12px 24px", fontSize: "16px", borderRadius: "16px" }}
            >
              Dismiss
            </Button>
          </div>
        )}
      </div>
    ),
    {
      ...toastOptions, // Passes any additional toast options.
    },
  );
};
