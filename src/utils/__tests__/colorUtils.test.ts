import type { SystemTheme } from "../../hooks/useSystemTheme";
import { ColorPalette } from "../../theme/themeConfig";
import type { DarkModeOptions } from "../../types/user";
import { getFontColor, isDark, isDarkMode, isHexColor } from "../colorUtils";

describe("isHexColor", () => {
  it("validates correct hex colors", () => {
    expect(isHexColor("#FFFFFF")).toBe(true);
    expect(isHexColor("#FFF")).toBe(true);
    expect(isHexColor("#abc")).toBe(true);
    expect(isHexColor("#123456")).toBe(true);
  });

  it("rejects incorrect hex colors", () => {
    expect(isHexColor("FFFFFF")).toBe(false);
    expect(isHexColor("#FFFF")).toBe(false);
    expect(isHexColor("#GGGGGG")).toBe(false);
    expect(isHexColor("#1234567")).toBe(false);
  });
});

describe("getFontColor", () => {
  it("returns dark font color for bright backgrounds", () => {
    const result = getFontColor("#FFF");
    expect(result).toBe(ColorPalette.fontDark);
  });

  it("returns light font color for dark backgrounds", () => {
    const result = getFontColor("#000000");
    expect(result).toBe(ColorPalette.fontLight);
  });

  it("returns dark font color for mid-tone bright backgrounds", () => {
    const result = getFontColor("#F0F0F0");
    expect(result).toBe(ColorPalette.fontDark);
  });

  it("returns light font color for mid-tone dark backgrounds", () => {
    const result = getFontColor("#202020");
    expect(result).toBe(ColorPalette.fontLight);
  });

  it("handles hex colors with lowercase letters", () => {
    const result = getFontColor("#abcdef");
    expect(result).toBe(ColorPalette.fontDark);
  });

  it("returns correct color for near-threshold brightness", () => {
    const result = getFontColor("#7F7F7F"); // Near threshold value
    expect(result).toBe(ColorPalette.fontLight);
  });
});

describe("isDark", () => {
  it("returns true for dark colors", () => {
    expect(isDark("#202020")).toBe(true);
    expect(isDark("#7F7F7F")).toBe(true); // Near-threshold gray
  });

  it("returns false for light colors", () => {
    expect(isDark("#F0F0F0")).toBe(false);
    expect(isDark("#abcdef")).toBe(false);
  });
});

const isDarkModeCases: [string, DarkModeOptions, SystemTheme, string, boolean][] = [
  ["force light mode", "light", "dark", "#000000", false],
  ["force dark mode", "dark", "light", "#ffffff", true],
  ["auto mode with system light", "auto", "light", "#ffffff", false],
  ["auto mode with system dark", "auto", "dark", "#ffffff", false],
  ["auto mode with dark background", "auto", "light", "#000000", true],
  ["auto mode with light background", "auto", "dark", "#ffffff", false],
];

describe("isDarkMode", () => {
  test.each(isDarkModeCases)(
    "should return correct value for %s",
    (_, darkmode, systemTheme, backgroundColor, expected) => {
      expect(isDarkMode(darkmode, systemTheme, backgroundColor)).toBe(expected);
    },
  );
});
