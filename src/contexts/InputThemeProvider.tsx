import React from "react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { useTheme as useMUITheme } from "@mui/material/styles";
import { useTheme as useEmotionTheme } from "@emotion/react";
import { isDark } from "../utils";
import { ColorPalette } from "../theme/themeConfig";

// this fixes input visibility issues based on the theme background.

const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useEmotionTheme();
  const muiTheme = useMUITheme();

  const customTheme = {
    ...muiTheme,
    components: {
      ...muiTheme.components,
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: isDark(theme.secondary) ? ColorPalette.fontLight : ColorPalette.fontDark,
          },
        },
      },
    },
    palette: {
      ...muiTheme.palette,
      mode: isDark(theme.secondary) ? "dark" : "light",
    },
  };

  return <MUIThemeProvider theme={customTheme}>{children}</MUIThemeProvider>;
};

export default CustomThemeProvider;
