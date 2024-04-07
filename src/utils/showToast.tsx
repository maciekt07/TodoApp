import { ReactNode } from "react";
import toast, { Toast, ToastOptions, ToastType } from "react-hot-toast";

interface ToastProps extends ToastOptions {
  disableClickDismiss?: boolean;
  disableVibrate?: boolean;
  type?: ToastType;
}

/**
 * Function to display a toast notification.
 * @param message - The message to display in the toast notification.
 * @param type - The type of toast notification to display.
 * @param toastOptions - Additional options to configure the toast notification.
 * @returns {void}
 */
export const showToast = (
  message: string | ReactNode,
  { type, disableClickDismiss, disableVibrate, ...toastOptions }: ToastProps = {} as ToastProps
): void => {
  const toastFunction = {
    error: toast.error,
    success: toast.success,
    loading: toast.loading,
    blank: toast,
    custom: toast.custom,
  }[type || "success"];
  // Vibrate
  if (!disableVibrate && "vibrate" in navigator) {
    type === "error" ? navigator.vibrate([100, 50, 100]) : navigator.vibrate([100]);
  }
  toastFunction(
    (t: Toast) => (
      <div onClick={!disableClickDismiss ? () => toast.dismiss(t.id) : undefined}>{message}</div>
    ),
    {
      ...toastOptions,
    }
  );
};
