/// <reference types="vite/client" />
// Extend the Window interface to include the AI property
declare global {
  interface Window {
    ai: string;
  }
}
