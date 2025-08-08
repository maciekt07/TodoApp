import { css } from "@emotion/react";
import type { SerializedStyles, Theme } from "@emotion/react";
import type { Properties } from "csstype";

/**
 * Returns CSS styles that disable animations and transitions when motion reduction is preferred.
 * @param theme - Emotion theme object
 * @param options - Optional CSS properties to include when disabling motion
 * @returns SerializedStyles or undefined
 */
export const reduceMotion = (
  theme: Theme,
  options?: Partial<Properties<string | number>>,
): SerializedStyles | undefined => {
  const disableStyles = css({
    animation: "none !important",
    transition: "none !important",
    ...options,
  });

  if (theme.reduceMotion === "off") return undefined;

  if (theme.reduceMotion === "on") return disableStyles;

  // fallback to OS-level preference
  return css`
    @media (prefers-reduced-motion: reduce) {
      ${disableStyles}
    }
  `;
};
