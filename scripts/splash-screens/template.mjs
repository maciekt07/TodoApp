//@ts-check
"use strict";

/**
 * Generates HTML content for splash screen
 * @param {Object} params
 * @param {number} params.width - Viewport width
 * @param {number} params.height - Viewport height
 * @param {'light'|'dark'} params.mode - Color scheme
 * @param {'portrait'|'landscape'} params.orientation - Screen orientation
 * @returns {string} HTML content
 */
const template = ({ width, height, mode }) => {
  const isLandscape = width > height;
  // FIXME: adjust styles for iphones smaller than ip8
  //TODO: optimize gradient for smaller screenshot size with PNG
  return `
     <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&family=Urbanist:wght@800&display=swap" rel="stylesheet">
        <style>
          body {
            width: ${width}px;
            height: ${height}px;
            background: ${
              mode === "dark"
                ? "linear-gradient(to bottom right, #000000 0%, #1A143A 100%)"
                : "linear-gradient(to bottom right, #FFFFFF 0%, #CBC2FF 100%)"
            };
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            font-family: Poppins, sans-serif;
            margin: 0;
            padding: 0;
            position: relative;
          }
          .container {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            transform: ${isLandscape ? "scale(0.5)" : "none"};
          }
          .logo {
            width: 512px;
            height: 512px;
            margin-bottom: ${isLandscape ? "16px" : "90px"};
            border-radius: 140px;
          }
          .app-name {
            font-size: 128px;
            font-weight: 800;
            display: flex;
            align-items: center;
          }
          .todo {
            color: #7764E8;
          }
          .app {
            color: ${mode === "dark" ? "#ffffff" : "#111A2B"};
          }
          .dot {
            color: #7764E8;
          }
          .attribution {
            position: absolute;
            bottom: ${isLandscape ? "0px" : "128px"};
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            transform: ${isLandscape ? "scale(0.5)" : "none"};
          }
          .attribution-text {
            color: ${mode === "dark" ? "#ffffffbf" : "#111A2Bbf"};
            font-size: 48px;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            margin-bottom: 24px;
          }
          .attribution-box {
            display: flex;
            align-items: center;
            background-color: ${mode === "dark" ? "#ffffff19" : "#111A2B19"};
            backdrop-filter: blur(100px);
            padding: 20px 28px;
            border-radius: 999px;
          }
          .attribution-box img {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            margin-right: 16px;
          }
          .attribution-box span {
            color: ${mode === "dark" ? "#ffffff" : "#111A2B"};
            font-size: 56px;
            font-family: 'Urbanist', sans-serif;
            font-weight: 800;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="https://raw.githubusercontent.com/maciekt07/TodoApp/refs/heads/main/public/logo.svg" class="logo" alt="App Logo" />
          <div class="app-name">
            <span class="todo">Todo</span>
            <span class="app">&nbsp;App</span>
            <span class="dot">.</span>
          </div>
        </div>
        <div class="attribution">
          <div class="attribution-text">Made By</div>
          <div class="attribution-box">
            <img src="https://avatars.githubusercontent.com/u/85953204?v=4" alt="@maciekt07" />
            <span>@maciekt07</span>
          </div>
        </div>
      </body>
    </html>
          `;
};

export default template;
