//@ts-check
"use strict";

/**
 * @file devices.mjs
 * @description iOS/iPadOS device configurations for generating splash screens.
 */

// https://gist.github.com/ricsantos/e7baee6885626b9cb87c021a5097623f

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

export default devices;
