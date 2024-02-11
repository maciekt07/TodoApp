import { Theme, createTheme } from "@mui/material";

export const ColorPalette = {
  fontDark: "#101727",
  fontLight: "#f0f0f0",
  purple: "#b624ff",
  red: "#ff3131",
};

// export const getColorFromTheme = (colorKey: keyof Palette) => {
//   const theme = useTheme();
//   const paletteColor = theme.palette[colorKey] as PaletteColor;
//   return paletteColor.main;
// };

const commonComponentProps: Theme["components"] = {
  MuiTooltip: {
    defaultProps: {
      disableInteractive: true,
      style: {
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      },
    },
  },
  MuiButton: {
    defaultProps: {
      sx: {
        p: "12px 20px",
        borderRadius: "14px",
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
  MuiDialog: {
    defaultProps: {
      PaperProps: {
        style: {
          padding: "12px",
          borderRadius: "24px",
        },
      },
    },
  },
};

export const MuiTheme: Theme = createTheme({
  components: {
    ...commonComponentProps,
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

export const MuiThemeBlue: Theme = createTheme({
  components: {
    ...commonComponentProps,
  },
  palette: {
    primary: {
      main: "#2a93d5",
    },
    secondary: {
      main: "#bababa",
    },
    error: {
      main: ColorPalette.red,
    },
  },
});

export const MuiThemeOrange: Theme = createTheme({
  components: {
    ...commonComponentProps,
  },
  palette: {
    primary: {
      main: "#e58b2a",
    },
    secondary: {
      main: "#bababa",
    },
    error: {
      main: ColorPalette.red,
    },
  },
});

export type AppTheme = "purple" | "blue" | "orange";
/**
 * To add new theme: Add theme name to `AppTheme` in `types/user.ts`, create new mui theme and add it here
 */
export const Themes: { name: AppTheme; MuiTheme: Theme }[] = [
  {
    name: "purple",
    MuiTheme: MuiTheme,
  },
  {
    name: "blue",
    MuiTheme: MuiThemeBlue,
  },
  {
    name: "orange",
    MuiTheme: MuiThemeOrange,
  },
];
