import { Global, css } from "@emotion/react";
const globalStyles = css`
  * {
    font-family: "Poppins", sans-serif !important;
    &::selection {
      background-color: #9a52ff;
    }
  }
  :root {
    font-family: "Poppins", sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light;
    color: rgba(255, 255, 255, 0.87);

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  a {
    font-weight: 500;
    color: #646cff;
    text-decoration: inherit;
  }
  a:hover {
    color: #535bf2;
  }
  html {
    background: linear-gradient(180deg, #232e58 0%, #171d34 100%);
    background-attachment: fixed;
    background-size: cover;
  }
  body {
    margin: 8px 16vw;

    @media (max-width: 1024px) {
      margin: 20px;
    }
  }
  .MuiDialog-container {
    backdrop-filter: blur(4px);
  }
`;
export const GlobalStyles = () => <Global styles={globalStyles} />;
