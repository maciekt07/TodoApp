import type { ManifestOptions } from "vite-plugin-pwa";

const manifest: Partial<ManifestOptions> = {
  name: "Todo App",
  short_name: "Todo App",
  display: "standalone",
  scope: "/",
  start_url: "/",
  theme_color: "#7764E8",
  background_color: "#171D34",
  description:
    "A fast and modern Todo app built with React, featuring task sharing via link, P2P Task Sync with WebRTC, theme customization, offline usage as a PWA, and caching for smooth performance. Made by github.com/maciekt07",
  categories: ["productivity", "utilities", "lifestyle"],
  edge_side_panel: {
    preferred_width: 500,
  },
  file_handlers: [
    {
      action: "/transfer",
      accept: {
        "application/json": [".json"],
      },
    },
  ],
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
      purpose: "any",
    },
    {
      src: "pwa/logoMaskable.png",
      sizes: "512x512",
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
    // {
    //   name: "Purge",
    //   description: "Purge Tasks",
    //   url: "/purge",
    //   icons: [
    //     {
    //       src: "pwa/purge.png",
    //       sizes: "192x192",
    //       type: "image/png",
    //     },
    //   ],
    // },
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
      src: "pwa/wideScreenshot1.webp",
      sizes: "1460x959",
      form_factor: "wide",
    },
    {
      src: "pwa/wideScreenshot2.webp",
      sizes: "1460x959",
      form_factor: "wide",
    },
    {
      src: "pwa/narrowScreenshot1.webp",
      sizes: "1170x2532",
      form_factor: "narrow",
    },
    {
      src: "pwa/narrowScreenshot2.webp",
      sizes: "1170x2532",
      form_factor: "narrow",
    },
  ],
};
export default manifest;
