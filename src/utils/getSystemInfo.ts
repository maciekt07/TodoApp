type OperatingSystem = "Windows" | "macOS" | "Linux" | "iOS" | "Android" | "Unknown";
type Browser = "Chrome" | "Firefox" | "Safari" | "Edge" | "Unknown";

const userAgent = navigator.userAgent;

const getOperatingSystem = (): OperatingSystem => {
  if (/Windows NT/i.test(userAgent)) return "Windows";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Mac/i.test(userAgent)) return "macOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Unknown";
};

const getBrowser = (): Browser => {
  if (/Chrome/i.test(userAgent) && !/Edge/i.test(userAgent)) return "Chrome";
  if (/Firefox/i.test(userAgent)) return "Firefox";
  if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) return "Safari";
  if (/Edg/i.test(userAgent)) return "Edge";
  return "Unknown";
};

const isAppleDevice: boolean = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

export const systemInfo = {
  os: getOperatingSystem(),
  browser: getBrowser(),
  isAppleDevice,

  // evaluated at access time to handle auto launch without refresh like on windows
  get isPWA() {
    return (
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      (navigator as NavigatorStandalone).standalone === true
    );
  },
};
