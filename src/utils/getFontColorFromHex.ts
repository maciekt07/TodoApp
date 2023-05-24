export const getFontColorFromHex = (backgroundColor: string): string => {
  const hexColor = backgroundColor.replace("#", "");
  const red = parseInt(hexColor.substr(0, 2), 16);
  const green = parseInt(hexColor.substr(2, 2), 16);
  const blue = parseInt(hexColor.substr(4, 2), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
  return brightness > 125 ? "#1A1A1A" : "#F5F5F5";
};
