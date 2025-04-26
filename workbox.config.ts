import type { GenerateSWOptions, StrategyName } from "workbox-build/build/types";

const isDev = process.env.NODE_ENV === "development";
// Dev: avoid API spam and hitting rate limits | Prod: fast loads with background updates
const apiCacheStrategy: StrategyName = isDev ? "CacheFirst" : "StaleWhileRevalidate";

const workbox: Partial<GenerateSWOptions> = {
  globPatterns: ["**/*.{js,css,html,svg,png,webmanifest}"],
  // Precache emoji previews for settings dialog
  additionalManifestEntries: [
    {
      url: "https://cdn.jsdelivr.net/npm/emoji-datasource-facebook/img/facebook/64/1f60e.png",
      revision: null,
    },
    {
      url: "https://cdn.jsdelivr.net/npm/emoji-datasource-twitter/img/twitter/64/1f60e.png",
      revision: null,
    },
    {
      url: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60e.png",
      revision: null,
    },
    {
      url: "https://cdn.jsdelivr.net/npm/emoji-datasource-google/img/google/64/1f60e.png",
      revision: null,
    },
  ],
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
