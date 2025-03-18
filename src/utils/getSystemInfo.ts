type OperatingSystem = "Windows" | "macOS" | "Linux" | "iOS" | "Android" | "Unknown";
type Browser = "Chrome" | "Firefox" | "Safari" | "Edge" | "Unknown";

const userAgent = navigator.userAgent;

const getOperatingSystem = (): OperatingSystem => {
  if (/Windows NT/i.test(userAgent)) return "Windows";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Mac/i.test(userAgent)) return "macOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  if (/Android/i.test(userAgent)) return "Android";
  return "Unknown";
};

const getBrowser = (): Browser => {
  if (/Chrome/i.test(userAgent) && !/Edge/i.test(userAgent)) return "Chrome";
  if (/Firefox/i.test(userAgent)) return "Firefox";
  if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) return "Safari";
  if (/Edg/i.test(userAgent)) return "Edge";
  return "Unknown";
};

export const systemInfo = { os: getOperatingSystem(), browser: getBrowser() };
