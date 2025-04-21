/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { qrcode } from "vite-plugin-qrcode";
import manifest from "./manifest";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
  },
  optimizeDeps: {
    exclude: ["@vite-pwa/assets-generator"],
  },
  plugins: [
    react(),
    // Generate QR code for npm run dev:host
    qrcode({ filter: (url) => url.startsWith("http://192.168.0.") }),
    VitePWA({
      manifest,
      devOptions: {
        enabled: true,
        type: "module",
      },
      registerType: "prompt",
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,webmanifest}"],
        // Use runtime caching for dynamic imports and external resources
        runtimeCaching: [
          // Cache for Github API
          {
            urlPattern: /^https:\/\/api\.github\.com\/repos\/[^/]+\/[^/]+/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "github-api-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 30 * 60, // 30 minutes
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Cache for Buy Me a Coffee API
          {
            urlPattern: /^https:\/\/img\.buymeacoffee\.com\/button-api\/\?&slug=[^&]+$/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "bmc-html-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 30 * 60, // 30 minutes
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Cache for Google Fonts
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
      },
      includeAssets: ["**/*", "sw.js"],
    }),
  ],
});
