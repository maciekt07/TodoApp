import React from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { isDark } from "../utils";

/**
 * this fixes MUI elements visibility issues when they are disabled and on the theme background.
 */
const DisabledThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const muiTheme = useMuiTheme();

  const customTheme = createTheme({
    ...muiTheme,
    palette: {
      mode: isDark(muiTheme.palette.secondary.main) ? "dark" : "light",
      primary: muiTheme.palette.primary,
      secondary: muiTheme.palette.secondary,
    },
  });

  return <MuiThemeProvider theme={customTheme}>{children}</MuiThemeProvider>;
};

export default DisabledThemeProvider;
