import { createTheme } from "@mui/material";
import type { Theme } from "@mui/material";

export const ColorPalette = {
  fontDark: "#101727",
  fontLight: "#f0f0f0",
  purple: "#b624ff",
  red: "#ff3131",
} as const;

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
  MuiAvatar: {
    defaultProps: {
      style: {
        fontWeight: 500,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiInputBase-root": {
          borderRadius: "16px",
        },
      },
    },
  },
};

// eslint-disable-next-line react-refresh/only-export-components
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

export type AppTheme = string;

type ThemeConfig = {
  [key: string]: {
    primaryColor: string;
    secondaryColor?: string;
  };
};

const themeConfig: ThemeConfig = {
  purple: {
    primaryColor: ColorPalette.purple,
  },
  "light purple": {
    primaryColor: ColorPalette.purple,
    secondaryColor: "#edeef6",
  },
  blue: {
    primaryColor: "#2a93d5",
  },
  pink: {
    primaryColor: "#e5369a",
  },
  "ultra pink": {
    primaryColor: "#ff0090",
    secondaryColor: "#ff94d1",
  },

  "dark orange": {
    primaryColor: "#FF5631",
    secondaryColor: "#0D0D0D",
  },
  "light orange": {
    primaryColor: "#F26E56",
    secondaryColor: "#F6F6F6",
  },
  Cheesecake: {
    primaryColor: "#E14C94",
    secondaryColor: "#FDF0D5",
  },
  // Add new themes here
};

export const Themes: { name: AppTheme; MuiTheme: Theme }[] = Object.entries(themeConfig).map(
  ([name, config]) => ({
    name: name as AppTheme,
    MuiTheme: createCustomTheme(config.primaryColor, config.secondaryColor),
  })
);
