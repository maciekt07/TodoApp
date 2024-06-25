import "@emotion/react";
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
  }
}
