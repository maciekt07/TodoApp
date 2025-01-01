// Types for the experimental feature that allows the PWA to access files from the system

interface FileSystemFileHandle {
  getFile(): Promise<File>;
}

interface LaunchParams {
  files: FileSystemFileHandle[];
}

interface LaunchQueue {
  setConsumer(callback: (launchParams: LaunchParams) => void): void;
}

declare global {
  interface Window {
    launchQueue?: LaunchQueue;
  }
}

export {};
