import { type Theme } from "@mui/material";

export const muiComponentsProps: Theme["components"] = {
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
    styleOverrides: {
      root: {
        padding: "12px 24px",
        borderRadius: "14px",
      },
      // TODO: use startIcon for mui button icons instead
      // startIcon: {
      //   fontSize: "24px",
      //   "& > *:nth-of-type(1)": {
      //     fontSize: "inherit",
      //   },
      // },
      // endIcon: {
      //   fontSize: "24px",
      //   "& > *:nth-of-type(1)": {
      //     fontSize: "inherit",
      //   },
      // },
    },
  },

  MuiSelect: {
    styleOverrides: {
      root: {
        borderRadius: "18px",
      },
    },
  },
  MuiDialog: {
    defaultProps: {
      slotProps: {
        paper: {
          style: {
            padding: "12px",
            borderRadius: "24px",
            minWidth: "400px",
          },
        },
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        color: "#fff",
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: "16px",
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
