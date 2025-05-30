type OperatingSystem = "Windows" | "macOS" | "Linux" | "iOS" | "Android" | "Unknown";
type Browser = "Chrome" | "Firefox" | "Safari" | "Edge" | "Unknown";

const getUserAgent = (): string => {
  return typeof navigator !== "undefined" ? navigator.userAgent : "";
};

const getOperatingSystem = (): OperatingSystem => {
  const ua = getUserAgent();
  if (/Windows NT/i.test(ua)) return "Windows";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Mac/i.test(ua)) return "macOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Linux/i.test(ua)) return "Linux";
  return "Unknown";
};

const getBrowser = (): Browser => {
  const ua = getUserAgent();
  if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) return "Chrome";
  if (/Firefox/i.test(ua)) return "Firefox";
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
  if (/Edg/i.test(ua)) return "Edge";
  return "Unknown";
};

const isAppleDevice = (): boolean => {
  const ua = getUserAgent();
  return /iPhone|iPad|iPod|Macintosh/i.test(ua);
};

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

export const systemInfo = {
  os: getOperatingSystem(),
  browser: getBrowser(),
  isAppleDevice: isAppleDevice(),

  // evaluated at access time to handle auto launch without refresh like on windows
  get isPWA() {
    return (
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      (navigator as NavigatorStandalone).standalone === true
    );
  },
};
