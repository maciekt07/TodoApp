import { ColorPalette, themeConfig } from "./themeConfig";
import type { SystemTheme } from "../hooks/useSystemTheme";
import type { DarkModeOptions } from "../types/user";
import { createCustomTheme, isDarkMode, Themes } from "./createTheme";

// this util causes an error in this test file for some reason idk why
vi.mock("../utils/getSystemInfo", () => ({
  getOperatingSystem: () => "Windows",
}));

describe("createCustomTheme", () => {
  it("should create a theme with the given primary and background colors", () => {
    const theme = createCustomTheme("#ff0000", "#00ff00", "light");
    expect(theme.palette.primary.main).toBe("#ff0000");
    expect(theme.palette.secondary.main).toBe("#00ff00");
    expect(theme.palette.mode).toBe("light");
  });

  it("should default to dark mode and the default background color if not provided", () => {
    const theme = createCustomTheme("#ff0000");
    expect(theme.palette.secondary.main).toBe("#232e58");
    expect(theme.palette.mode).toBe("dark");
  });

  it("should set warning color based on mode", () => {
    const darkTheme = createCustomTheme("#ff0000", "#00ff00", "dark");
    const lightTheme = createCustomTheme("#ff0000", "#00ff00", "light");
    expect(darkTheme.palette.warning.main).toBe(ColorPalette.orange);
    expect(lightTheme.palette.warning.main).toBe(ColorPalette.orangeDark);
  });
});

describe("Themes", () => {
  it("should generate themes based on themeConfig", () => {
    expect(Themes.length).toBe(Object.keys(themeConfig).length);
    Themes.forEach(({ name, MuiTheme }) => {
      expect(themeConfig).toHaveProperty(name);
      expect(MuiTheme).toBeDefined();
    });
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
