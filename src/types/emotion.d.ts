import "@emotion/react";
import type { Theme as MuiTheme } from "@mui/material/styles";
declare module "@emotion/react" {
  export interface Theme {
    /**
     * Emotion Primary color
     */
    primary: string;
    /**
     * Emotion Background color
     */
    secondary: string;
    /**
     * Emotion darkmode
     */
    darkmode: boolean;
    /**
     * Material UI Theme
     */
    mui: MuiTheme;
  }
}
