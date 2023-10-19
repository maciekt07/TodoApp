import { Global, css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { ColorPalette } from ".";

const globalStyles = css`
  * {
    font-family: "Poppins", sans-serif !important;
    -webkit-tap-highlight-color: transparent;
    &::selection {
      background-color: #9a52ff;
      color: #ffffff;
      text-shadow: 0 0 8px #d22eff;
    }
  }
  :root {
    font-family: "Poppins", sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light;
    color: #f5f5f5;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
    --rsbs-backdrop-bg: rgba(0, 0, 0, 0.3);
  }

  /* div[data-rsbs-backdrop="true"] {
    backdrop-filter: blur(2px);
  } */
  div[role="dialog"] {
    border-radius: 42px 42px 0 0;
    z-index: 9999999;
  }

  div[data-rsbs-backdrop="true"] {
    z-index: 999;
  }

  div[data-rsbs-header="true"] {
    z-index: 999999;
    &::before {
      width: 60px;
      height: 6px;
      border-radius: 100px;
      background: #cfcfcf;
      margin-top: 2px;
    }
  }

  body {
    margin: 8px 16vw;
    touch-action: manipulation;
    background: linear-gradient(180deg, #232e58 0%, #171d34 100%);
    background-attachment: fixed;
    background-size: cover;
    @media (max-width: 1024px) {
      margin: 20px;
    }

    /* Custom Scrollbar Styles */
    ::-webkit-scrollbar {
      width: 8px;

      background-color: #232e58;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #6d2aff;
      border-radius: 64px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: #8750ff;
    }

    ::-webkit-scrollbar-track {
      border-radius: 64px;
      background-color: #232e58;
    }
  }

  pre {
    background-color: black;
    color: white;
    padding: 16px;
    border-radius: 16px;
    overflow-x: auto;
    border: 2px solid #40404062;
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;

      background-color: #232e58;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #6d2aff;
      border-radius: 64px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: #8750ff;
    }

    ::-webkit-scrollbar-track {
      border-radius: 64px;
      background-color: #232e58;
    }
  }

  .EmojiPickerReact {
    --epr-hover-bg-color: #b624ffaf;
    --epr-focus-bg-color: #b624ffaf;
    --epr-highlight-color: #b624ff;
    --epr-search-border-color: #b624ff;
    --epr-category-icon-active-color: #b624ff;
  }

  .MuiDialog-container {
    backdrop-filter: blur(4px);
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
    color: white !important;
    background-color: #141431dd !important;
    backdrop-filter: blur(6px) !important;
    padding: 8px 16px !important;
    border-radius: 8px !important;
    font-size: 12px !important;
  }
`;

export const GlobalStyles = () => <Global styles={globalStyles} />;

export const DialogBtn = styled(Button)`
  padding: 10px 16px;
  border-radius: 16px;
  font-size: 16px;
  margin: 8px;
`;

export const StyledLink = styled.a`
  cursor: pointer;
  color: ${ColorPalette.purple};
  display: inline-block;
  position: relative;
  text-decoration: none;
  font-weight: 500;
  transition: 0.3s all;
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: ${ColorPalette.purple};
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
    border-radius: 100px;
  }
  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
  &:hover {
    text-shadow: 0px 0px 20px ${ColorPalette.purple};
  }
  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;

export const fadeInLeft = keyframes`
from {
  opacity: 0;
  transform: translateX(-40px)
}
to {
  opacity: 1;
  transform: translateX(0px)
  }
`;
export const fadeIn = keyframes`
from {
  opacity: 0;
}

`;
export const slideIn = keyframes`
  from{
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;
export const slideInBottom = keyframes`
  from{
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(182, 36, 255, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 12px rgba(182, 36, 255, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(182, 36, 255, 0);
  }
`;
