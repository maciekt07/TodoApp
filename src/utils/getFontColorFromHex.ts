import { ColorPalette } from "../styles";

/**
 * Returns the appropriate font color (either black or white) based on the provided background color in hex format.
 * @param {string} backgroundColor - The background color in hexformat (e.g., "#FFFFFF").
 * @returns {string} The font color in hex format.
 */
export const getFontColorFromHex = (backgroundColor: string): string => {
  const hexColor = backgroundColor.replace("#", "");
  const red = parseInt(hexColor.substr(0, 2), 16);
  const green = parseInt(hexColor.substr(2, 2), 16);
  const blue = parseInt(hexColor.substr(4, 2), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
  return brightness > 125 ? ColorPalette.fontDark : ColorPalette.fontLight;
};
