import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// A script to generate splash screens for iOS/iPadOS devices from a html template.

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const mode = process.argv.find((arg) => arg.startsWith("--mode="))?.split("=")[1] || "default";

// TODO: compress PNG images
/** @type {'.png' | '.jpeg'} */ // .jpeg technically works and its way easier to compress but its not recommended for splash screens
const fileType = ".jpeg";

if (mode !== "default" && mode !== "cleanup") {
  console.error("Invalid mode. Use --mode=default or --mode=cleanup");
  process.exit(1);
}

const startTime = performance.now();

const prefix = "[Splash Generator]";

if (mode === "cleanup") {
  // remove splash-screens directory
  const splashDir = path.join(__dirname, "../public/splash-screens");
  if (fs.existsSync(splashDir)) {
    fs.rmSync(splashDir, { recursive: true });
    console.log(`${prefix} Removed splash-screens directory`);
  }

  // remove splash screen links from index.html
  const indexPath = path.join(__dirname, "../index.html");
  let indexHtml = fs.readFileSync(indexPath, "utf8");

  const splashSectionRegex =
    /(<!--\s*[\w\.]+\s*-->[\s\n]*)?<link\s+rel="apple-touch-startup-image"[^>]*>/gi;
  indexHtml = indexHtml.replace(splashSectionRegex, "");

  fs.writeFileSync(indexPath, indexHtml);
  console.log(`${prefix} Removed splash screen links from index.html`);

  const endTime = performance.now();
  console.log(`${prefix} Cleanup completed in ${((endTime - startTime) / 1000).toFixed(2)}s`);
  process.exit(0);
}

/** @type {string} output dir path for splash screens */
const outputDir = path.join(__dirname, "../public/splash-screens");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

/**
 * Device configuration type
 * @typedef {Object} DeviceConfig
 * @property {number} cssWidth - CSS width in pixels
 * @property {number} cssHeight - CSS height in pixels
 * @property {number} pxWidth - Actual pixel width
 * @property {number} pxHeight - Actual pixel height
 * @property {number} ratio - Device pixel ratio
 * @property {string} name - Device name
 */

/** @type {DeviceConfig[]} iOS device configurations */
const devices = [
  // iPhone 16 Pro Max
  {
    cssWidth: 440,
    cssHeight: 956,
    pxWidth: 1320,
    pxHeight: 2868,
    ratio: 3,
    name: "iPhone_16_Pro_Max",
  },
  // iPhone 16 Pro
  {
    cssWidth: 402,
    cssHeight: 874,
    pxWidth: 1206,
    pxHeight: 2622,
    ratio: 3,
    name: "iPhone_16_Pro",
  },
  // iPhone 16 Plus / 15 Pro Max / 15 Plus / 14 Pro Max
  {
    cssWidth: 430,
    cssHeight: 932,
    pxWidth: 1290,
    pxHeight: 2796,
    ratio: 3,
    name: "iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max",
  },
  // iPhone 16 / 15 Pro / 15 / 14 Pro
  {
    cssWidth: 393,
    cssHeight: 852,
    pxWidth: 1179,
    pxHeight: 2556,
    ratio: 3,
    name: "iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro",
  },
  // iPhone 14 Plus / 13 Pro Max / 12 Pro Max
  {
    cssWidth: 428,
    cssHeight: 926,
    pxWidth: 1284,
    pxHeight: 2778,
    ratio: 3,
    name: "iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max",
  },
  // iPhone 14 / 13 Pro / 13 / 12 Pro / 12
  {
    cssWidth: 390,
    cssHeight: 844,
    pxWidth: 1170,
    pxHeight: 2532,
    ratio: 3,
    name: "iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12",
  },
  // iPhone 13 mini / 12 mini / 11 Pro / XS / X
  {
    cssWidth: 375,
    cssHeight: 812,
    pxWidth: 1125,
    pxHeight: 2436,
    ratio: 3,
    name: "iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X",
  },
  // iPhone 11 Pro Max / XS Max
  {
    cssWidth: 414,
    cssHeight: 896,
    pxWidth: 1242,
    pxHeight: 2688,
    ratio: 3,
    name: "iPhone_11_Pro_Max__iPhone_XS_Max",
  },
  // iPhone 11 / XR
  {
    cssWidth: 414,
    cssHeight: 896,
    pxWidth: 828,
    pxHeight: 1792,
    ratio: 2,
    name: "iPhone_11__iPhone_XR",
  },
  // iPhone 8 Plus / 7 Plus / 6s Plus / 6 Plus
  {
    cssWidth: 414,
    cssHeight: 736,
    pxWidth: 1242,
    pxHeight: 2208,
    ratio: 3,
    name: "iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus",
  },
  // // iPhone 8 / 7 / 6s / 6 / 4.7" iPhone SE
  // {
  //   cssWidth: 375,
  //   cssHeight: 667,
  //   pxWidth: 750,
  //   pxHeight: 1334,
  //   ratio: 2,
  //   name: "iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE",
  // },
  // // 4" iPhone SE / iPod touch 5th gen+
  // {
  //   cssWidth: 320,
  //   cssHeight: 568,
  //   pxWidth: 640,
  //   pxHeight: 1136,
  //   ratio: 2,
  //   name: "4__iPhone_SE__iPod_touch_5th_generation_and_later",
  // },
  // 13" iPad Pro M4
  {
    cssWidth: 1032,
    cssHeight: 1376,
    pxWidth: 2064,
    pxHeight: 2752,
    ratio: 2,
    name: "13__iPad_Pro_M4",
  },
  // 12.9" iPad Pro
  {
    cssWidth: 1024,
    cssHeight: 1366,
    pxWidth: 2048,
    pxHeight: 2732,
    ratio: 2,
    name: "12.9__iPad_Pro",
  },
  // 11" iPad Pro M4
  {
    cssWidth: 834,
    cssHeight: 1210,
    pxWidth: 1668,
    pxHeight: 2420,
    ratio: 2,
    name: "11__iPad_Pro_M4",
  },
  // 11" iPad Pro / 10.5" iPad Pro
  {
    cssWidth: 834,
    cssHeight: 1194,
    pxWidth: 1668,
    pxHeight: 2388,
    ratio: 2,
    name: "11__iPad_Pro__10.5__iPad_Pro",
  },
  // 10.9" iPad Air
  {
    cssWidth: 820,
    cssHeight: 1180,
    pxWidth: 1640,
    pxHeight: 2360,
    ratio: 2,
    name: "10.9__iPad_Air",
  },
  // 10.5" iPad Air
  {
    cssWidth: 834,
    cssHeight: 1112,
    pxWidth: 1668,
    pxHeight: 2224,
    ratio: 2,
    name: "10.5__iPad_Air",
  },
  // 10.2" iPad
  {
    cssWidth: 810,
    cssHeight: 1080,
    pxWidth: 1620,
    pxHeight: 2160,
    ratio: 2,
    name: "10.2__iPad",
  },
  // 9.7" iPad Pro / 7.9" iPad mini / 9.7" iPad Air / 9.7" iPad
  {
    cssWidth: 768,
    cssHeight: 1024,
    pxWidth: 1536,
    pxHeight: 2048,
    ratio: 2,
    name: "9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad",
  },
  // 8.3" iPad Mini
  {
    cssWidth: 744,
    cssHeight: 1133,
    pxWidth: 1488,
    pxHeight: 2266,
    ratio: 2,
    name: "8.3__iPad_Mini",
  },
];

/**
 * Generates HTML content for splash screen
 * @param {Object} params
 * @param {number} params.width - Viewport width
 * @param {number} params.height - Viewport height
 * @param {'light'|'dark'} params.mode - Color scheme
 * @param {'portrait'|'landscape'} params.orientation - Screen orientation
 * @returns {string} HTML content
 */
const generateHTMLContent = ({ width, height, mode, orientation }) => {
  const isLandscape = width > height;
  // FIXME: adjust styles for iphones smaller than ip8
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

/**
 * Generates splash screens for all configured devices
 * @async
 * @returns {Promise<void>}
 */
const generateSplashScreens = async () => {
  console.log(`${prefix} Starting splash screen generation in ${mode} mode...`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    for (const device of devices) {
      for (const mode of ["light", "dark"]) {
        for (const orientation of ["portrait", "landscape"]) {
          const width = orientation === "portrait" ? device.pxWidth : device.pxHeight;
          const height = orientation === "portrait" ? device.pxHeight : device.pxWidth;

          await page.setViewport({ width, height, deviceScaleFactor: 1 });
          await page.setContent(generateHTMLContent({ width, height, mode, orientation }));

          const fileName = `${device.name}_${mode}_${orientation}${fileType}`;
          await page.screenshot({
            path: path.join(outputDir, fileName),
            optimizeForSpeed: true,
            type: fileType.replace(".", ""),
            quality: fileType === ".jpeg" ? 80 : undefined,
          });
          console.log(`${prefix} Generated: ${fileName}`);
        }
      }
    }
  } finally {
    await browser.close();
  }
};

/**
 * Generates link tags for all device configurations
 * @returns {string} HTML string with all link tags
 */
const generateLinkTags = () =>
  devices
    .map(
      (device) => `
  <link rel="apple-touch-startup-image" media="
    screen and (device-width: ${device.cssWidth}px)
    and (device-height: ${device.cssHeight}px)
    and (-webkit-device-pixel-ratio: ${device.ratio})
    and (orientation: portrait)
  " href="/splash-screens/${device.name}_light_portrait${fileType}">
  <link rel="apple-touch-startup-image" media="
    (prefers-color-scheme: dark)
    and (device-width: ${device.cssWidth}px)
    and (device-height: ${device.cssHeight}px)
    and (-webkit-device-pixel-ratio: ${device.ratio})
    and (orientation: portrait)
  " href="/splash-screens/${device.name}_dark_portrait${fileType}">
  <link rel="apple-touch-startup-image" media="
    screen and (device-width: ${device.cssWidth}px)
    and (device-height: ${device.cssHeight}px)
    and (-webkit-device-pixel-ratio: ${device.ratio})
    and (orientation: landscape)
  " href="/splash-screens/${device.name}_light_landscape${fileType}">
  <link rel="apple-touch-startup-image" media="
    (prefers-color-scheme: dark)
    and (device-width: ${device.cssWidth}px)
    and (device-height: ${device.cssHeight}px)
    and (-webkit-device-pixel-ratio: ${device.ratio})
    and (orientation: landscape)
  " href="/splash-screens/${device.name}_dark_landscape${fileType}">
`,
    )
    .join("\n");

/**
 * Updates index.html with new splash screen links
 * @returns {void}
 */
const updateIndexHtml = () => {
  const indexPath = path.join(__dirname, "../index.html");
  let indexHtml = fs.readFileSync(indexPath, "utf8");

  // remove all existing splash screen links
  const splashSectionRegex =
    /(<!--\s*[\w\.]+\s*-->[\s\n]*)?<link\s+rel="apple-touch-startup-image"[^>]*>/gi;
  indexHtml = indexHtml.replace(splashSectionRegex, "");

  // insert new links before title tag
  const closingHeadIndex = indexHtml.indexOf("<title>");
  if (closingHeadIndex === -1) {
    throw new Error("<title> tag not found in index.html");
  }

  const newHtml = [
    indexHtml.slice(0, closingHeadIndex),
    generateLinkTags(),
    indexHtml.slice(closingHeadIndex),
  ].join("");

  fs.writeFileSync(indexPath, newHtml);
  console.log(`${prefix} Updated index.html successfully`);
};

(async () => {
  try {
    await generateSplashScreens();
    updateIndexHtml();
    const endTime = performance.now();
    console.log(
      `${prefix} Completed successfully in ${((endTime - startTime) / 1000).toFixed(2)}s`,
    );
  } catch (error) {
    console.error(`${prefix} ❌ Error:`, error.message);
    process.exit(1);
  }
})();
