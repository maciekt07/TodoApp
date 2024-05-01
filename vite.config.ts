import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true,
        type: "module",
      },
      // cache all the imports
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*"],
      },
      // cache all the static assets in the public folder
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
            src: "logoMaskable.png",
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
                src: "add.png",
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
                src: "categories.png",
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
                src: "transfer.png",
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
                src: "purge.png",
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
                src: "profile.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
        ],
        screenshots: [
          {
            src: "wideScreenshot1.png",
            sizes: "1460x959",
            form_factor: "wide",
          },
          {
            src: "wideScreenshot2.png",
            sizes: "1460x959",
            form_factor: "wide",
          },
          {
            src: "narrowScreenshot1.png",
            sizes: "1170x2532",
            form_factor: "narrow",
          },
          {
            src: "narrowScreenshot2.png",
            sizes: "1170x2532",
            form_factor: "narrow",
          },
        ],
      },
    }),
  ],
});
