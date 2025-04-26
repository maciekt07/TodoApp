/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { qrcode } from "vite-plugin-qrcode";
import manifest from "./manifest";
import workbox from "./workbox.config";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
  },
  plugins: [
    react(),
    // Generate QR code for npm run dev:host
    qrcode({ filter: (url) => url.startsWith("http://192.168.0.") }),
    // https://vite-pwa-org.netlify.app/
    VitePWA({
      manifest, // manifest.ts
      devOptions: {
        enabled: true,
        type: "module",
      },
      registerType: "prompt",
      workbox, // workbox.config.ts
      includeAssets: ["**/*", "sw.js", "!splash-screens/**/*"],
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json", ".mjs", ".mts"],
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === "SOURCEMAP_ERROR" ||
          warning.message.includes("PURE") // ignore PURE comment warning
        ) {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@mui") || id.includes("@emotion")) {
              return "ui-lib";
            }
            if (id.includes("emoji-picker-react")) {
              return "emoji";
            }
            if (id.includes("ntc-ts")) {
              return "ntc";
            }
            return "vendor"; // other node_modules
          }

          if (id.includes("src/components/tasks")) {
            return "tasks";
          }
          if (id.includes("src/components/settings")) {
            return "settings";
          }
        },
      },
    },
  },
});
