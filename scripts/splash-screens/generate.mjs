//@ts-check
"use strict";

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import devices from "./devices.mjs";
import template from "./template.mjs";

/**
 * @file generate.mjs
 * @description Generates splash screens for iOS/iPadOS from an HTML template.
 */

const ROOT_DIR = process.cwd(); // project root
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const SPLASH_DIR = path.join(PUBLIC_DIR, "splash-screens");
const INDEX_HTML_PATH = path.join(ROOT_DIR, "index.html");

/** @type {readonly ["portrait", "landscape"]} */
export const orientations = ["portrait", "landscape"];

/** @type {readonly ["light", "dark"]} */
export const modes = ["light", "dark"];

/** @type {'.png' | '.jpeg'} */ // png for sharper images, jpeg for smaller files
const fileType = ".jpeg";

/**
 * Returns splash screen file name for a device, mode, and orientation.
 *
 * @param {Object} params
 * @param {string} params.deviceName - Device identifier
 * @param {'light'|'dark'} params.mode - Color scheme
 * @param {'portrait'|'landscape'} params.orientation - Screen orientation
 * @returns {string} File name including extension (e.g., "iPhone_16_Pro_Max_light_portrait.jpeg")
 */
const getSplashFileName = ({ deviceName, mode, orientation }) =>
  `${deviceName}_${mode}_${orientation}${fileType}`;

const mode = process.argv.find((arg) => arg.startsWith("--mode="))?.split("=")[1] || "default";

if (mode !== "default" && mode !== "cleanup") {
  console.error("Invalid mode. Use --mode=default or --mode=cleanup");
  process.exit(1);
}

const startTime = performance.now();
const prefix = "[Splash Generator]";

if (mode === "cleanup") {
  // remove splash-screens directory
  if (fs.existsSync(SPLASH_DIR)) {
    fs.rmSync(SPLASH_DIR, { recursive: true });
    console.log(`${prefix} Removed splash-screens directory`);
  }

  // remove splash screen links from index.html
  let indexHtml = fs.readFileSync(INDEX_HTML_PATH, "utf8");
  const splashSectionRegex =
    /(<!--\s*[\w\.]+\s*-->[\s\n]*)?<link\s+rel="apple-touch-startup-image"[^>]*>/gi;
  indexHtml = indexHtml.replace(splashSectionRegex, "");
  fs.writeFileSync(INDEX_HTML_PATH, indexHtml);

  console.log(`${prefix} Removed splash screen links from index.html`);
  const endTime = performance.now();
  console.log(`${prefix} Cleanup completed in ${((endTime - startTime) / 1000).toFixed(2)}s`);
  process.exit(0);
}

if (!fs.existsSync(SPLASH_DIR)) fs.mkdirSync(SPLASH_DIR, { recursive: true });

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
      for (const mode of modes) {
        for (const orientation of orientations) {
          const width = orientation === "portrait" ? device.pxWidth : device.pxHeight;
          const height = orientation === "portrait" ? device.pxHeight : device.pxWidth;

          await page.setViewport({ width, height, deviceScaleFactor: 1 });
          await page.setContent(
            template({
              width,
              height,
              mode: mode === "light" ? "light" : "dark",
              orientation: orientation === "portrait" ? "portrait" : "landscape",
            }),
          );

          const fileName = getSplashFileName({ deviceName: device.name, mode, orientation });
          await page.screenshot({
            path: path.join(SPLASH_DIR, fileName),
            //@ts-ignore
            optimizeForSpeed: fileType === ".jpeg", // increases png size when true
            // @ts-ignore
            type: fileType === ".png" ? "png" : "jpeg",
            omitBackground: false,
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
 * @returns {string} HTML string with all splash screen link tags
 */
const generateLinkTags = () => {
  return devices
    .flatMap((device) =>
      modes.flatMap((mode) =>
        orientations.map((orientation) => {
          const mediaParts = [
            mode === "dark" ? "(prefers-color-scheme: dark)" : "screen",
            `(device-width: ${device.cssWidth}px)`,
            `(device-height: ${device.cssHeight}px)`,
            `(-webkit-device-pixel-ratio: ${device.ratio})`,
            `(orientation: ${orientation})`,
          ];

          return `<link rel="apple-touch-startup-image" media="${mediaParts.join(
            " and ",
          )}" href="/splash-screens/${getSplashFileName({ deviceName: device.name, mode, orientation })}">`;
        }),
      ),
    )
    .join("\n");
};

/**
 * Updates index.html with new splash screen links
 * @returns {void}
 */
const updateIndexHtml = () => {
  let indexHtml = fs.readFileSync(INDEX_HTML_PATH, "utf8");

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

  fs.writeFileSync(INDEX_HTML_PATH, newHtml);
  console.log(`${prefix} Updated index.html successfully`);
};

/** main */
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
