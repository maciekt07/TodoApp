import { createTheme } from "@mui/material";
import type { Theme } from "@mui/material";
import { ColorPalette, themeConfig } from "./themeConfig";
import { muiComponentsProps } from "./muiComponents";

export const createCustomTheme = (
  primaryColor: string,
  backgroundColor = "#232e58",
  mode: "light" | "dark" = "dark"
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
        main: ColorPalette.orange,
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

export const Themes: { name: string; MuiTheme: Theme }[] = Object.entries(themeConfig).map(
  ([name, config]) => ({
    name: name as string,
    MuiTheme: createCustomTheme(config.primaryColor, config.secondaryColor),
  })
);
