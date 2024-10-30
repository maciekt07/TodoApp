import { useState, useEffect } from "react";

export type SystemTheme = "light" | "dark" | "unknown";

/**
 * A React hook to detect the system theme preference.
 * @returns The current system theme ('light', 'dark', or 'unknown').
 */
export const useSystemTheme = (): SystemTheme => {
  const [theme, setTheme] = useState<SystemTheme>("unknown");
  useEffect(() => {
    const mediaQueryListener = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(prefersDarkScheme.matches ? "dark" : "light");

    // Listen for changes in system theme
    prefersDarkScheme.addEventListener("change", mediaQueryListener);

    return () => {
      prefersDarkScheme.removeEventListener("change", mediaQueryListener);
    };
  }, []);

  return theme;
};
