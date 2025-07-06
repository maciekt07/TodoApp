import React from "react";
import { ThemeProvider as MuiThemeProvider, Theme } from "@mui/material/styles";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme as useEmotionTheme } from "@emotion/react";
import { isDark } from "../utils";
import { ColorPalette } from "../theme/themeConfig";

/**
 * this fixes input visibility issues based on the theme background.
 */
const InputThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const emotionTheme = useEmotionTheme();
  const muiTheme = useMuiTheme();

  const customTheme: Theme = {
    ...muiTheme,
    components: {
      ...muiTheme.components,
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: isDark(emotionTheme.secondary) ? ColorPalette.fontLight : ColorPalette.fontDark,
          },
        },
      },
    },
    palette: {
      ...muiTheme.palette,
      mode: isDark(emotionTheme.secondary) ? "dark" : "light",
    },
  };

  return <MuiThemeProvider theme={customTheme}>{children}</MuiThemeProvider>;
};

export default InputThemeProvider;
