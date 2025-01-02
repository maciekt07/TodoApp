import { ColorPalette } from "../../theme/themeConfig";
import { getFontColor, isDark, isHexColor } from "../colorUtils";

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
