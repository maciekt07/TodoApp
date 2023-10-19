import { createTheme } from "@mui/material";

export const ColorPalette = {
  fontDark: "#1A1A1A",
  fontLight: "#F5F5F5",
  purple: "#b624ff",
  red: "#ff3131",
};

export const MuiTheme = createTheme({
  components: {
    MuiTooltip: {
      defaultProps: {
        disableInteractive: true,
      },
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },

  palette: {
    primary: {
      main: ColorPalette.purple,
    },
    error: {
      main: ColorPalette.red,
    },
  },
});
