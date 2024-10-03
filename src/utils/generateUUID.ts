import type { UUID } from "../types/user";

export const generateUUID = (): UUID => {
  // Check if crypto is supported
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  } else {
    // crypto may fail with Vite --host as it requires HTTPS for full functionality
    // Fallback to manual UUID generation
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }) as UUID;
  }
};
