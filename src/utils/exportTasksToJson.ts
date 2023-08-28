import { Task } from "../types/user";
/**
 * Exports an array of tasks to a JSON file and initiates the download.
 * @param {Task[]} selectedTasks - The array of tasks to be exported.
 */
export const exportTasksToJson = (selectedTasks: Task[]): void => {
  const date = new Date();
  const dateString = date.toLocaleDateString().replace(/\//g, "_");
  const timeString = date
    .toLocaleTimeString()
    .replace(/:/g, "_")
    .replace(/ /g, "_");

  const dateResult = dateString + "_" + timeString;

  const dataStr = JSON.stringify(selectedTasks, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const exportFileDefaultName = `exported_tasks_${dateResult}.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};
