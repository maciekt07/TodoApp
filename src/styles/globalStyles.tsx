import { Global, css, useTheme } from "@emotion/react";
import { getFontColor } from "../utils";
import { ColorPalette } from "../theme/themeConfig";

export const GlobalStyles = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        * {
          font-family: "Poppins", sans-serif !important;
          -webkit-tap-highlight-color: transparent;
          &::selection {
            background-color: ${theme.primary + "e1"};
            color: ${getFontColor(theme.primary)};
            text-shadow: 0 0 12px ${getFontColor(theme.primary) + "b9"};
          }
        }
        :root {
          font-family: "Poppins", sans-serif;
          line-height: 1.5;
          font-weight: 400;
          color-scheme: ${theme.darkmode ? "dark" : "light"};
          color: ${getFontColor(theme.secondary)};
          font-synthesis: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          -webkit-text-size-adjust: 100%;
          --rsbs-backdrop-bg: rgba(0, 0, 0, 0.3);
          --rsbs-bg: ${theme.darkmode ? "#383838" : "#ffffff"};
        }
        input[type="datetime-local"]:placeholder-shown {
          color: transparent !important;
        }
        img {
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -o-user-select: none;
          user-select: none;
        }

        a {
          text-decoration: none;
          -webkit-text-decoration: none;
          color: inherit;
        }

        input[type="file"]::-webkit-file-upload-button {
          display: none;
        }
        div[role="dialog"] {
          border-radius: 42px 42px 0 0;
          z-index: 9999999;
        }

        div[data-rsbs-backdrop] {
          z-index: 999;
        }

        div[data-rsbs-header] {
          z-index: 999999;
          &::before {
            width: 60px;
            height: 6px;
            border-radius: 100px;
            background: ${theme.darkmode ? "#717171" : "#cfcfcf"};
            margin-top: 3px;
          }
        }
        div[data-rsbs-header] {
          box-shadow: none;
        }
        body {
          margin: 8px 16vw;
          touch-action: manipulation;
          background: ${theme.secondary};
          background-attachment: fixed;
          background-size: cover;
          transition: 0.3s background;
          @media (max-width: 1024px) {
            margin: 20px;
          }

          /* Custom Scrollbar Styles */
          ::-webkit-scrollbar {
            width: 8px;

            background-color: ${theme.secondary};
          }

          ::-webkit-scrollbar-thumb {
            background-color: ${theme.primary};
            border-radius: 64px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background-color: ${theme.primary + "d8"};
          }

          ::-webkit-scrollbar-track {
            border-radius: 64px;
            background-color: ${theme.secondary};
          }
        }

        pre {
          background-color: #000000d7;
          color: white;
          padding: 16px;
          border-radius: 18px;
          overflow-x: auto;
        }

        .EmojiPickerReact {
          --epr-search-border-color: ${theme.primary} !important;
          --epr-hover-bg-color-reduced-opacity: ${theme.primary + "64"} !important;
          --epr-hover-bg-color: ${theme.primary} !important;
          --epr-focus-bg-color: ${theme.primary + "64"} !important;
          --epr-dark-bg-color: ${ColorPalette.darkMode} !important;
          --epr-dark-category-label-bg-color: ${ColorPalette.darkMode + "d8"} !important;
          --epr-skin-tone-picker-menu-color: transparent !important;
          --epr-emoji-variation-picker-bg-color: ${theme.darkmode
            ? ColorPalette.darkMode
            : ColorPalette.lightMode} !important;
          --epr-emoji-variation-picker-menu-color: ${ColorPalette.darkMode} !important;
          --epr-dark-search-input-bg-color-active: #313131 !important;
          --epr-dark-picker-border-color: #616161 !important;
          border-radius: 20px !important;
          padding: 8px !important;
        }

        .epr-reactions {
          background: ${theme.darkmode ? "#141431dd" : "#ffffffd3"} !important;
          border: 1px solid ${theme.darkmode ? "#020217" : "#7d7d7d"} !important;
        }

        .epr-emoji-category-label {
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
        }

        .epr-emoji-native {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .epr-body,
        .MuiDialogContent-root,
        .MuiDrawer-paper,
        .customScrollbar,
        textarea {
          ::-webkit-scrollbar {
            width: 8px;
            border-radius: 4px;
            background-color: #84848415;
          }

          ::-webkit-scrollbar-thumb {
            background-color: #8484844b;
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background-color: #84848476;
          }

          ::-webkit-scrollbar-track {
            border-radius: 4px;
            background-color: #84848415;
          }
        }

        .MuiDialog-container {
          backdrop-filter: blur(4px);
        }
        .MuiButton-contained {
          box-shadow: none !important;
        }
        .MuiPaper-elevation8 {
          border-radius: 16px !important;
        }
        .MuiSelect-select,
        .MuiSelect-select {
          display: flex !important;
          justify-content: left;
          align-items: center;
          gap: 4px;
        }
        .MuiTooltip-tooltip {
          color: ${theme.darkmode ? "white" : "black"} !important;
          background-color: ${theme.darkmode ? "#141431dd" : "#ededf3dd"} !important;
          backdrop-filter: blur(6px) !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          font-size: 12px !important;
        }
        .MuiBottomNavigationAction-root {
          padding: 12px !important;
          margin: 0 !important;
          max-height: none;
        }
        .MuiSlider-valueLabel {
          border-radius: 10px !important;
          padding: 6px 14px !important;
          color: ${theme.darkmode ? "white" : "black"} !important;
          background-color: ${theme.darkmode ? "#141431dd" : "#ededf3dd"} !important;
          &::before,
          &::after {
            display: none;
          }
        }
        .MuiCircularProgress-circle {
          stroke-linecap: round !important;
        }
        /* 
        .MuiTabs-indicator {
          border-radius: 24px !important;
        } */
        .MuiAccordion-root {
          &::before {
            display: none;
          }
        }
      `}
    />
  );
};
