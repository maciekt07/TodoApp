import { useEffect, useState } from "react";
import type { ReduceMotionOption } from "../types/user";

/**
 * Custom hook to determine whether to reduce motion based on user setting and system preference.
 *
 * @param reduceMotionSetting - user's reduce motion setting (system | on | off).
 * @returns A boolean indicating if reduced motion should be applied.
 * @example const prefersReducedMotion = usePrefersReducedMotion(user.settings.reduceMotion);
 */
export function usePrefersReducedMotion(reduceMotionSetting: ReduceMotionOption): boolean {
  const [systemPrefersReducedMotion, setSystemPrefersReducedMotion] = useState(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  if (reduceMotionSetting === "on") {
    return true;
  }

  if (reduceMotionSetting === "off") {
    return false;
  }

  // system fallback
  return systemPrefersReducedMotion;
}
