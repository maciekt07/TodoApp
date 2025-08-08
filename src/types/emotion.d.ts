import "@emotion/react";
import type { Theme as MuiTheme } from "@mui/material/styles";
import type { ReduceMotionOption } from "./user";
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
     * Defines animation preference: "on" (disable), "off" (enable), or "system" (OS default)
     */
    reduceMotion: ReduceMotionOption;
    /**
     * Material UI Theme
     */
    mui: MuiTheme;
  }
}
