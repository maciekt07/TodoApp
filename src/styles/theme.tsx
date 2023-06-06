import { createTheme } from "@mui/material";

export const ColorPalette = {
  fontDark: "#1A1A1A",
  fontLight: "#F5F5F5",
  purple: "#b624ff",
};

export const MuiTheme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
  palette: {
    primary: {
      main: ColorPalette.purple,
    },
    error: {
      main: "#ff3131",
    },
  },
});
