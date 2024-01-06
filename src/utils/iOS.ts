/**
 * Checks if the current environment is an iOS device.
 *
 * @type {boolean}
 * @constant
 */
export const iOS: boolean =
  typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
