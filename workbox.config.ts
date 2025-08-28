import type { GenerateSWOptions, StrategyName } from "workbox-build/build/types";
import { EmojiStyle } from "emoji-picker-react";

const isDev = process.env.NODE_ENV === "development";
// Dev: avoid API spam and hitting rate limits | Prod: fast loads with background updates
const apiCacheStrategy: StrategyName = isDev ? "CacheFirst" : "StaleWhileRevalidate";

// Precache emoji previews for settings dialog
export const settingsEmojiPreviewAssets = Object.values(EmojiStyle)
  .filter((style): style is Exclude<EmojiStyle, EmojiStyle.NATIVE> => style !== EmojiStyle.NATIVE)
  .map((platform) => ({
    url: `https://cdn.jsdelivr.net/npm/emoji-datasource-${platform}/img/${platform}/64/1f60e.png`,
    revision: null,
  }));

const workbox: Partial<GenerateSWOptions> = {
  cleanupOutdatedCaches: true,
  globDirectory: "dist",
  globPatterns: ["**/*.{js,css,html,svg,png,webmanifest,webp}"],
  additionalManifestEntries: [...settingsEmojiPreviewAssets],
  // Use runtime caching for dynamic imports and external resources
  runtimeCaching: [
    // Cache for Github API
    {
      urlPattern: /^https:\/\/api\.github\.com\/repos\/[^/]+\/[^/]+/i,
      handler: apiCacheStrategy,
      options: {
        cacheName: "github-api-cache",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 2 * 60 * 60, // 2 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache for Buy Me a Coffee API
    {
      urlPattern: /^https:\/\/img\.buymeacoffee\.com\/button-api\/\?&slug=[^&]+$/i,
      handler: apiCacheStrategy,
      options: {
        cacheName: "bmc-html-cache",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 2 * 60 * 60, // 2 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache for Google Fonts
    // FIXME: On first offline launch after install and precache, fonts don't load (fallback to system font).
    //        After launching the app once online, they load fine offline.
    {
      urlPattern: ({ url }) =>
        url.href.startsWith("https://fonts.googleapis.com/") ||
        url.href.startsWith("https://fonts.gstatic.com/"),
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200], // Important for opaque responses
        },
      },
    },
    // Cache for Google Favicon API
    {
      urlPattern: /^https:\/\/www\.google\.com\/s2\/favicons\?/,
      handler: "CacheFirst",
      options: {
        cacheName: "google-favicons",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 14 * 24 * 60 * 60, // 14 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // DON'T cache emojis for now since they take a lot of space
    //TODO: find a way to only cache the ones used by user
    {
      urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/emoji-datasource/i,
      handler: "NetworkOnly",
      options: {
        cacheName: "emoji-datasource-skip-cache",
      },
    },
    // DON'T cache iOS splash screens
    // iOS handles splash screens offline automatically no need to precache
    {
      urlPattern: ({ url }) => url.pathname.startsWith("/splash-screens/"),
      handler: "NetworkOnly",
      options: {
        cacheName: "splash-screens-no-cache",
      },
    },
    // DON'T cache Google Analytics
    {
      urlPattern: /gtag\/js\?id=/i,
      handler: "NetworkOnly",
      options: {
        cacheName: "google-analytics-no-cache",
      },
    },
    // Cache for application scripts, styles, and fonts
    {
      urlPattern: ({ request }) =>
        request.destination === "script" ||
        request.destination === "style" ||
        request.destination === "font" ||
        request.destination === "worker",
      handler: "CacheFirst",
      options: {
        cacheName: "app-assets",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Navigation routes using Network First strategy
    {
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "documents",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    // Cache for images
    {
      urlPattern: ({ request }) => request.destination === "image",
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
};

export default workbox;
