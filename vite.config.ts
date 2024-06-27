import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true,
        type: "module",
      },
      registerType: "autoUpdate",
      workbox: {
        // Use runtime caching for dynamic imports
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "font" ||
              request.destination === "worker",
            handler: "CacheFirst",
            options: {
              cacheName: "dynamic-resources",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "documents",
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
      includeAssets: ["**/*"],
      manifest: {
        theme_color: "#7764E8",
        background_color: "#171D34",
        display: "standalone",
        scope: "/",
        start_url: "/",
        short_name: "Todo App",
        description:
          "Todo app with many features, including local storage, sharing tasks via link and more! Made by github.com/maciekt07",
        name: "Todo App",
        icons: [
          {
            src: "/logo192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/logo384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/logo512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa/logoMaskable.png",
            sizes: "256x256",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "Add Task",
            description: "Add Task",
            url: "/add",
            icons: [
              {
                src: "pwa/add.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
          {
            name: "Categories",
            description: "Task Categories",
            url: "/categories",
            icons: [
              {
                src: "pwa/categories.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
          {
            name: "Transfer",
            description: "Import or Export Task",
            url: "/transfer",
            icons: [
              {
                src: "pwa/transfer.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
          {
            name: "Purge",
            description: "Purge Tasks",
            url: "/purge",
            icons: [
              {
                src: "pwa/purge.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
          {
            name: "Profile",
            description: "User Profile",
            url: "/user",
            icons: [
              {
                src: "pwa/profile.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
        ],
        screenshots: [
          {
            src: "pwa/wideScreenshot1.png",
            sizes: "1460x959",
            form_factor: "wide",
          },
          {
            src: "pwa/wideScreenshot2.png",
            sizes: "1460x959",
            form_factor: "wide",
          },
          {
            src: "pwa/narrowScreenshot1.png",
            sizes: "1170x2532",
            form_factor: "narrow",
          },
          {
            src: "pwa/narrowScreenshot2.png",
            sizes: "1170x2532",
            form_factor: "narrow",
          },
        ],
      },
    }),
  ],
});
