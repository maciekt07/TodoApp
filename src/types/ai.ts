// types for window.ai experimental chrome api
// https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/view#heading=h.z2j0iwg9yj7i

export interface AI {
  canCreateTextSession(): Promise<AIModelAvailability>;
  createTextSession(options?: AITextSessionOptions): Promise<AITextSession>;
  defaultTextSessionOptions(): Promise<AITextSessionOptions>;
}

export interface AITextSession {
  prompt(input: string): Promise<string>;
  promptStreaming(input: string): ReadableStream<string>;
  destroy(): void;
}

export interface AITextSessionOptions {
  topK: number;
  temperature: number;
}

export type AIModelAvailability = "readily" | "after-download" | "no";

declare global {
  interface Window {
    ai: AI;
  }
}
