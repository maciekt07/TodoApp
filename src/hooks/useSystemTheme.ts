import { useState, useEffect } from "react";

export type SystemTheme = "light" | "dark" | "unknown";

/**
 * A React hook to detect the system theme preference.
 * @returns The current system theme ('light', 'dark', or 'unknown').
 */
export const useSystemTheme = (): SystemTheme => {
  const [theme, setTheme] = useState<SystemTheme>(() => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    return prefersDarkScheme.matches ? "dark" : "light";
  });
  useEffect(() => {
    const mediaQueryListener = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Listen for changes in system theme
    prefersDarkScheme.addEventListener("change", mediaQueryListener);

    return () => {
      prefersDarkScheme.removeEventListener("change", mediaQueryListener);
    };
  }, []);

  return theme;
};
