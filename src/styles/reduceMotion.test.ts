import { describe, it, expect } from "vitest";
import type { Properties } from "csstype";
import type { Theme } from "@emotion/react";
import { reduceMotion } from "./reduceMotion.styled";
import type { ReduceMotionOption } from "../types/user";

describe("reduceMotion", () => {
  const createMockTheme = (reduceMotion: ReduceMotionOption): Partial<Theme> => ({
    reduceMotion,
  });

  it("returns null when theme.reduceMotion is off", () => {
    const theme = createMockTheme("off");
    const result = reduceMotion(theme as Theme);
    expect(result).toBeNull();
  });

  it("returns SerializedStyles with disabled animations when theme.reduceMotion is on", () => {
    const theme = createMockTheme("on");
    const result = reduceMotion(theme as Theme);
    expect(result).not.toBeNull();
    expect(result?.name).toBeDefined();
    expect(result?.styles).toContain("animation:none");
    expect(result?.styles).toContain("transition:none");
  });

  it("wraps styles in @media when theme.reduceMotion is system", () => {
    const theme = createMockTheme("system");
    const result = reduceMotion(theme as Theme);
    expect(result?.styles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(result?.styles).toContain("animation:none");
    expect(result?.styles).toContain("transition:none");
  });

  it("merges custom CSS properties correctly", () => {
    const theme = createMockTheme("on");
    const customOptions: Partial<Properties<string | number>> = { opacity: 0, color: "red" };
    const result = reduceMotion(theme as Theme, customOptions);
    expect(result?.styles).toContain("opacity:0");
    expect(result?.styles).toContain("color:red");
  });
});
