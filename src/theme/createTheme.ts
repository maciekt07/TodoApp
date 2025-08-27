import type { PaletteMode, Theme } from "@mui/material";
import { createTheme } from "@mui/material";
import type { SystemTheme } from "../hooks/useSystemTheme";
import type { DarkModeOptions } from "../types/user";
import { isDark } from "../utils";
import { muiComponentsProps } from "./muiComponents";
import { ColorPalette, themeConfig } from "./themeConfig";

/**
 * Creates a custom MUI theme based on provided primary color, background color, and palette mode.
 */
export const createCustomTheme = (
  primaryColor: string,
  backgroundColor = "#232e58",
  mode: PaletteMode = "dark",
): Theme => {
  return createTheme({
    components: {
      ...muiComponentsProps,
    },
    palette: {
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: backgroundColor,
      },
      warning: {
        main: mode === "dark" ? ColorPalette.orange : ColorPalette.orangeDark,
      },
      error: {
        main: ColorPalette.red,
      },
      // background: {
      //   paper: mode === "dark" ? ColorPalette.darkMode : ColorPalette.lightMode,
      // },
      mode,
    },
  });
};

/**
 * List of available themes with their name and corresponding MUI theme object.
 */
export const Themes: { name: string; MuiTheme: Theme }[] = Object.entries(themeConfig).map(
  ([name, config]) => ({
    name,
    MuiTheme: createCustomTheme(config.primaryColor, config.secondaryColor),
  }),
);

/**
 * Determines if dark mode should be enabled based on user preference, system theme, and background color
 */
export const isDarkMode = (
  darkmode: DarkModeOptions,
  systemTheme: SystemTheme,
  backgroundColor: string,
): boolean => {
  switch (darkmode) {
    case "light":
      return false;
    case "dark":
      return true;
    case "system":
      return systemTheme === "dark";
    case "auto":
      return isDark(backgroundColor);
    default:
      return false;
  }
};
