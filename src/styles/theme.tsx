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
        p: "12px 24px",
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

export const createCustomTheme = (primaryColor: string, backgroundColor = "#232e58"): Theme => {
  return createTheme({
    components: {
      ...commonComponentProps,
    },
    palette: {
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: backgroundColor,
      },
      error: {
        main: ColorPalette.red,
      },
    },
  });
};

export type AppTheme = "purple" | "blue" | "orange" | "pink" | "ultraPink";
/**
 * To add new theme: Add theme name to `AppTheme` interface, create new Mui theme and it to this `Themes` object
 */
export const Themes: { name: AppTheme; MuiTheme: Theme }[] = [
  {
    name: "purple",
    MuiTheme: createCustomTheme(ColorPalette.purple),
  },

  {
    name: "blue",
    MuiTheme: createCustomTheme("#2a93d5"),
  },
  // {
  //   name: "orange",
  //   MuiTheme: createCustomTheme("#ff8e2b"),
  // },
  {
    name: "pink",
    MuiTheme: createCustomTheme("#e5369a"),
  },
  {
    name: "ultraPink",
    MuiTheme: createCustomTheme("#ff0090", "#ff94d1"),
  },
];
