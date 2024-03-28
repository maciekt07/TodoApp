import { createTheme } from "@mui/material";
import type { Theme } from "@mui/material";

export const ColorPalette = {
  fontDark: "#101727",
  fontLight: "#f0f0f0",
  purple: "#b624ff",
  red: "#ff3131",
  orange: "#ff9318",
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
      warning: {
        main: ColorPalette.orange,
      },
      error: {
        main: ColorPalette.red,
      },
    },
  });
};

export type AppTheme = string;

type ThemeConfig = {
  [key: AppTheme]: {
    primaryColor: string;
    secondaryColor?: string;
  };
};

const themeConfig: ThemeConfig = {
  Purple: {
    // Default dark theme
    primaryColor: ColorPalette.purple,
  },
  "Light Purple": {
    // Default light theme
    primaryColor: ColorPalette.purple,
    secondaryColor: "#edeef6",
  },
  Blue: {
    primaryColor: "#2a93d5",
  },
  Pink: {
    primaryColor: "#e5369a",
  },
  "Ultra Pink": {
    primaryColor: "#ff0090",
    secondaryColor: "#ff94d1",
  },

  "Dark Orange": {
    primaryColor: "#FF5631",
    secondaryColor: "#0D0D0D",
  },
  "Light Orange": {
    primaryColor: "#F26E56",
    secondaryColor: "#F6F6F6",
  },
  Cheesecake: {
    primaryColor: "#E14C94",
    secondaryColor: "#FDF0D5",
  },
  Aurora: {
    primaryColor: "#00e952",
    secondaryColor: "#011926",
  },
  // Add new themes here
};

export const Themes: { name: AppTheme; MuiTheme: Theme }[] = Object.entries(themeConfig).map(
  ([name, config]) => ({
    name: name as AppTheme,
    MuiTheme: createCustomTheme(config.primaryColor, config.secondaryColor),
  })
);
