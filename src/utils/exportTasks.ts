import type { Task } from "../types/user";

/**
 * Exports an array of tasks to a JSON file and initiates the download.
 * @param {Task[]} selectedTasks - The array of tasks to be exported.
 */
export const exportTasksToJson = (selectedTasks: Task[]): void => {
  // Get the current date and time for the filename
  const timestamp = new Date().toLocaleString().replace(/[/:, ]/g, "_");
  const filename = `Tasks_${timestamp}.json`;

  // Create a JSON blob
  const dataStr = JSON.stringify(selectedTasks, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });

  // Create a URL for the blob
  const url = window.URL.createObjectURL(blob);

  // Create a link element and initiate the download
  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.download = filename;
  linkElement.click();
  // Clean up the URL object
  window.URL.revokeObjectURL(url);
};
