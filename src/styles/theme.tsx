import { Theme, createTheme } from "@mui/material";

export const ColorPalette: { [key: string]: string } = {
  fontDark: "#101727",
  fontLight: "#F5F5F5",
  purple: "#b624ff",
  red: "#ff3131",
};

export const MuiTheme: Theme = createTheme({
  components: {
    MuiTooltip: {
      defaultProps: {
        disableInteractive: true,
        style: {
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        style: {
          borderRadius: "18px",
        },
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
    secondary: {
      main: "#bababa",
    },
    error: {
      main: ColorPalette.red,
    },
  },
});
