import { ColorPalette } from "../theme/themeConfig";

/**
 * Returns the appropriate font color (either black or white) based on the provided background color in hex format.
 * @param {string} backgroundColor - The background color in hex format (e.g., "#FFFFFF").
 * @returns {string} The font color in hex format.
 */
export const getFontColor = (backgroundColor: string): string => {
  const hexColor = backgroundColor.startsWith("#") ? backgroundColor.slice(1) : backgroundColor;

  // If shorthand hex color (e.g., #fff), expand it to full form
  const expandedHex =
    hexColor.length === 3
      ? hexColor
          .split("")
          .map((char) => char + char)
          .join("")
      : hexColor;

  const red = parseInt(expandedHex.slice(0, 2), 16);
  const green = parseInt(expandedHex.slice(2, 4), 16);
  const blue = parseInt(expandedHex.slice(4, 6), 16);

  const brightness = Math.round((red * 299 + green * 587 + blue * 114) / 1000);

  const threshold = 128;
  return brightness > threshold ? ColorPalette.fontDark : ColorPalette.fontLight;
};

/**
 * Determines if the provided color is considered dark based on its brightness.
 * @param {string} color - The color in hex format
 */
export const isDark = (color: string): boolean => {
  return getFontColor(color) === ColorPalette.fontLight;
};
